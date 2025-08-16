"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { UserAvatar } from "@microboat/web/components/shared/user-avatar";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import { appConfig } from "@microboat/web/config";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { getSignedUploadUrl } from "@microboat/web/storage/actions";
import { Camera, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export function ChangeAvatarForm() {
	const { user, reloadSession } = useSession();
	const t = useTranslations();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file || !user) {
			return;
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			setError(t("settings.account.avatar.invalidFileType"));
			return;
		}

		// Validate file size (5MB limit)
		if (file.size > 5 * 1024 * 1024) {
			setError(t("settings.account.avatar.fileTooLarge"));
			return;
		}

		try {
			setError(null);
			setIsUploading(true);

			// Generate a unique key for the avatar
			const fileExtension = file.name.split(".").pop() || "jpg";
			const avatarKey = `${user.id}-${Date.now()}.${fileExtension}`;

			// Get signed upload URL
			const result = await getSignedUploadUrl({
				bucket: appConfig.storage.bucketNames.avatars,
				key: avatarKey,
				contentType: file.type,
			});

			if (!result.data) {
				throw new Error("Failed to get upload URL");
			}

			const uploadResponse = await fetch(result.data, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!uploadResponse.ok) {
				let errorText = "";
				try {
					errorText = await uploadResponse.text();
				} catch (e) {
					console.error("Failed to read error response:", e);
				}

				console.error("Upload failed details:", {
					status: uploadResponse.status,
					statusText: uploadResponse.statusText,
					errorText,
					url: result.data,
				});

				throw new Error(
					`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}${errorText ? ` - ${errorText}` : ""}`,
				);
			}

			const { error: updateError } = await authClient.updateUser({
				image: avatarKey,
			});

			if (updateError) {
				setError(getAuthErrorMessage(updateError.code));
				return;
			}

			reloadSession();
		} catch (err) {
			console.error("Avatar upload error:", err, err?.message, err?.stack);

			// Provide more specific error messages
			if (err instanceof TypeError && err.message === "Failed to fetch") {
				setError(
					`error message: ${err.message}, stack: ${err.stack}, cause: ${err.cause}`,
				);
			} else if (err?.message?.includes("CORS")) {
				setError(
					"CORS error: The server is not configured to accept requests from this domain.",
				);
			} else {
				setError(
					err instanceof Error
						? err.message
						: "Unknown error occurred during upload",
				);
			}
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	// Loading skeleton when user data is not available
	if (!user) {
		return (
			<div className="space-y-8">
				<div>
					<div className="flex items-center justify-between mb-6">
						<div className="space-y-2">
							<Skeleton className="h-7 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>

					<div className="flex flex-col items-center space-y-4">
						<Skeleton className="h-24 w-24 rounded-full" />
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Avatar Section */}
			<div>
				<div className="mb-6">
					<h2 className="text-xl font-semibold">
						{t("settings.account.avatar.title")}
					</h2>
					<p className="text-sm text-muted-foreground mt-2">
						{t("settings.account.avatar.description")}
					</p>
				</div>

				<div className="flex flex-col items-center space-y-4">
					{/* Avatar Display */}
					<div className="relative group">
						<UserAvatar
							name={user.name}
							image={user.image}
							className={`h-24 w-24 cursor-pointer transition-all duration-200 ${
								isUploading
									? "opacity-50 cursor-not-allowed"
									: "group-hover:opacity-80"
							}`}
						/>
						{/* Loading overlay */}
						{isUploading && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
								<Loader2 className="h-8 w-8 text-white animate-spin" />
							</div>
						)}
						{/* Hover overlay */}
						{!isUploading && (
							<button
								type="button"
								onClick={handleAvatarClick}
								className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
								aria-label={t("settings.account.avatar.changeAvatar")}
							>
								<Camera className="h-6 w-6 text-white" />
							</button>
						)}
					</div>

					{/* Upload Instructions */}
					<div className="text-center space-y-2">
						{isUploading && (
							<p className="text-sm text-muted-foreground">
								{t("settings.account.avatar.uploading")}
							</p>
						)}

						{!isUploading && (
							<p className="text-xs text-muted-foreground">
								{t("settings.account.avatar.supportedFormats")}
							</p>
						)}
					</div>

					{/* Hidden File Input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						disabled={isUploading}
					/>
				</div>

				<CustomFormMessage error={error} />
			</div>
		</div>
	);
}
