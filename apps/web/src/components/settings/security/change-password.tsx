"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { Button } from "@microboat/web/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@microboat/web/components/ui/form";
import { Input } from "@microboat/web/components/ui/input";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	currentPassword: z.string().min(1),
	newPassword: z.string().min(8),
});

interface ChangePasswordFormProps {
	accounts: any[];
	isPending: boolean;
}

export function ChangePasswordForm({
	accounts,
	isPending,
}: ChangePasswordFormProps) {
	const t = useTranslations();
	const router = useRouter();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
		},
	});

	const hasPasswordAccount = accounts?.some(
		(account) => account.provider === "credential",
	);

	if (isPending || !hasPasswordAccount) {
		return null;
	}

	const onSubmit = form.handleSubmit(async (values) => {
		setError(null);
		setSuccess(null);

		const { error } = await authClient.changePassword({
			currentPassword: values.currentPassword,
			newPassword: values.newPassword,
			revokeOtherSessions: true,
		});

		if (error) {
			setError(getAuthErrorMessage(error.code));
			return;
		}

		setSuccess(t("settings.security.passwordUpdateSuccess"));
		form.reset();
		router.refresh();
	});

	return (
		<div className="space-y-8">
			<div>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold">
							{t("settings.security.title")}
						</h2>
						<p className="text-sm text-muted-foreground mt-2">
							{t("settings.security.description")}
						</p>
					</div>
					<Button
						variant="ghost"
						onClick={onSubmit}
						disabled={
							!(
								form.formState.isValid &&
								Object.keys(form.formState.dirtyFields).length
							)
						}
						className="font-bold cursor-pointer"
					>
						{form.formState.isSubmitting
							? "Saving..."
							: t("settings.security.save")}
					</Button>
				</div>

				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-6">
						<div className="grid grid-cols-1 gap-4">
							<FormField
								control={form.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-bold">
											{t("settings.security.oldPassword")}
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showCurrentPassword ? "text" : "password"}
													autoComplete="current-password"
													className="pr-10"
												/>
												<button
													type="button"
													onClick={() =>
														setShowCurrentPassword(!showCurrentPassword)
													}
													className="absolute inset-y-0 right-0 pr-3 flex items-center"
												>
													{showCurrentPassword ? (
														<EyeOff className="h-4 w-4 text-gray-400" />
													) : (
														<Eye className="h-4 w-4 text-gray-400" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-bold">
											{t("settings.security.newPassword")}
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showNewPassword ? "text" : "password"}
													autoComplete="new-password"
													className="pr-10"
												/>
												<button
													type="button"
													onClick={() => setShowNewPassword(!showNewPassword)}
													className="absolute inset-y-0 right-0 pr-3 flex items-center"
												>
													{showNewPassword ? (
														<EyeOff className="h-4 w-4 text-gray-400" />
													) : (
														<Eye className="h-4 w-4 text-gray-400" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<CustomFormMessage success={success} error={error} />
					</form>
				</Form>
			</div>
		</div>
	);
}
