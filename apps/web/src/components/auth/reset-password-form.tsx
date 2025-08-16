"use client";

import { Logo } from "@microboat/web/components/icons/logo";
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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const t = useTranslations("auth");

	const resetPasswordSchema = z
		.object({
			password: z
				.string()
				.min(8, { message: t("validation.passwordMinLength") })
				.max(100, { message: t("validation.passwordMaxLength") }),
			confirmPassword: z
				.string()
				.min(1, { message: t("validation.confirmPasswordRequired") }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("validation.passwordsNotMatch"),
			path: ["confirmPassword"],
		});

	type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: ResetPasswordFormValues) => {
		setError(null);
		setSuccess(null);

		if (!token) {
			setError(t("resetPassword.invalidTokenError"));
			return;
		}

		try {
			const result = await authClient.resetPassword({
				newPassword: values.password,
				token,
			});

			if (result.error) {
				throw result.error;
			}

			setSuccess(t("resetPassword.successMessage"));

			// Redirect to login page after success
			setTimeout(() => {
				router.push("/auth/login");
			}, 2000);
		} catch (err) {
			setError(getAuthErrorMessage(err));
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	// If no token, show error
	if (!token) {
		return (
			<div className="w-full max-w-md mx-auto">
				<div className="text-center space-y-6 mb-8">
					<h1 className="text-2xl font-semibold">
						{t("resetPassword.invalidLinkTitle")}
					</h1>
					<p className="text-sm text-muted-foreground">
						{t("resetPassword.invalidLinkSubtitle")}
					</p>
				</div>
				<CustomFormMessage error={t("resetPassword.invalidLinkError")} />
				<div className="text-center mt-8">
					<a
						href="/auth/forgot-password"
						className="font-bold underline hover:text-primary"
					>
						{t("resetPassword.invalidLinkAction")}
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center space-y-6 mb-8">
				<div className="flex justify-center">
					<div
						className="flex size-12 shrink-0 items-center justify-center"
						aria-hidden="true"
					>
						<Logo />
					</div>
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">{t("resetPassword.title")}</h1>
					{success ? (
						<div className="text-md font-bold text-muted-foreground bg-green-500/10 dark:bg-green-900/10 p-4 rounded-md">
							{t("resetPassword.successMessage")}
						</div>
					) : (
						<p className="text-sm text-muted-foreground max-w-sm mx-auto">
							{t("resetPassword.subtitle")}
						</p>
					)}
				</div>
			</div>

			{!success && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold">
											{t("resetPassword.newPasswordLabel")}
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showPassword ? "text" : "password"}
													disabled={isLoading}
													className="h-12 text-base pr-10"
													autoComplete="new-password"
												/>
												<button
													type="button"
													onClick={togglePasswordVisibility}
													disabled={isLoading}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
												>
													{showPassword ? (
														<EyeOffIcon className="size-4" />
													) : (
														<EyeIcon className="size-4" />
													)}
													<span className="sr-only">
														{showPassword
															? t("resetPassword.hidePassword")
															: t("resetPassword.showPassword")}
													</span>
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold">
											{t("resetPassword.confirmPasswordLabel")}
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showConfirmPassword ? "text" : "password"}
													disabled={isLoading}
													className="h-12 text-base pr-10"
													autoComplete="new-password"
												/>
												<button
													type="button"
													onClick={toggleConfirmPasswordVisibility}
													disabled={isLoading}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
												>
													{showConfirmPassword ? (
														<EyeOffIcon className="size-4" />
													) : (
														<EyeIcon className="size-4" />
													)}
													<span className="sr-only">
														{showConfirmPassword
															? t("resetPassword.hidePassword")
															: t("resetPassword.showPassword")}
													</span>
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<CustomFormMessage success={success} error={error} />

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full h-12 text-base font-bold rounded-lg cursor-pointer"
						>
							{isLoading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									{t("resetPassword.submittingButton")}
								</>
							) : (
								t("resetPassword.submitButton")
							)}
						</Button>
					</form>
				</Form>
			)}

			<div className="text-center mt-8">
				<span className="text-sm text-muted-foreground">
					{t("resetPassword.footerText")}{" "}
					<a
						href="/auth/login"
						className="font-bold underline hover:text-primary"
					>
						{t("resetPassword.footerLink")}
					</a>
				</span>
			</div>
		</div>
	);
}
