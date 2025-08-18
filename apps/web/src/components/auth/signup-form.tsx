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
import { useConfig } from "@microboat/common";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SocialSignin } from "./social-signin";

export function SignupForm() {
	const config = useConfig();
	const { enableSocialLogin, enablePasswordLogin } = config.getAuth();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirectTo");
	const t = useTranslations("auth");

  

	const signupSchema = z.object({
		name: z
			.string()
			.min(1, { message: t("validation.nameRequired") })
			.max(50, { message: t("validation.nameMaxLength") }),
		email: z
			.string()
			.min(1, { message: t("validation.emailRequired") })
			.email({ message: t("validation.emailInvalid") }),
		password: z
			.string()
			.min(8, { message: t("validation.passwordMinLength") })
			.max(100, { message: t("validation.passwordMaxLength") }),
	});

	type SignupFormValues = z.infer<typeof signupSchema>;
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const isLoading = form.formState.isSubmitting;
	const redirectPath = redirectTo ?? config.getAuth().redirectAfterSignIn;

	const onSubmit = async (values: SignupFormValues) => {
		try {
			const { error } = await authClient.signUp.email(
				{
					name: values.name,
					email: values.email,
					password: values.password,
					callbackURL: redirectPath,
				},
				{
					onRequest: () => {
						setError(null);
						setSuccess(null);
					},
					onSuccess: () => {
						setSuccess(t("signup.successMessage"));
						form.reset();

						if (config.getAffiliate().affonso.enabled) {
							console.log("signup by affonso affiliate:", values.email);
							// @ts-expect-error - Affonso is not typed
							window.Affonso.signup(values.email);
						}
					},
					onError: (ctx) => {
						setError(getAuthErrorMessage(ctx.error.code));
					},
				},
			);

			if (error) {
				throw error;
			}
		} catch (err) {
			setError(getAuthErrorMessage(err));
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

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
				<h1 className="text-2xl font-semibold">{t("signup.title")}</h1>
				{success && (
					<div className="text-md font-bold text-muted-foreground bg-green-500/10 dark:bg-green-900/10 p-4 rounded-md">
						{t("signup.successMessage")}
					</div>
				)}
			</div>

			{/* Only show the form if not showing success message */}
			{!success && (
				<>
					{/* Social Login Section */}
					{enableSocialLogin && (
						<div className="mb-6">
							<SocialSignin />
						</div>
					)}

					{/* Divider - only show when both login methods are enabled */}
					{enableSocialLogin && enablePasswordLogin && (
						<div className="flex items-center gap-4 mb-6">
							<div className="flex-1 h-px bg-gray-300" />
							<span className="text-sm text-gray-500">
								{t("signup.dividerText")}
							</span>
							<div className="flex-1 h-px bg-gray-300" />
						</div>
					)}

					{/* Password Signup Form */}
					{enablePasswordLogin && (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-bold">
													{t("signup.nameLabel")}
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={t("signup.namePlaceholder")}
														type="text"
														disabled={isLoading}
														className="h-12 text-base"
														autoComplete="name"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-bold">
													{t("signup.emailLabel")}
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={t("signup.emailPlaceholder")}
														type="email"
														disabled={isLoading}
														className="h-12 text-base"
														autoComplete="email"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-bold">
													{t("signup.passwordLabel")}
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
																	? t("signup.hidePassword")
																	: t("signup.showPassword")}
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
											{t("signup.submittingButton")}
										</>
									) : (
										t("signup.submitButton")
									)}
								</Button>
							</form>
						</Form>
					)}
				</>
			)}

			<div className="text-center mt-8">
				<span className="text-sm text-muted-foreground">
					{t("signup.footerText")}{" "}
					<a
						href={
							redirectPath
								? `/auth/login?redirectTo=${redirectPath}`
								: "/auth/login"
						}
						className="font-bold hover:underline"
					>
						{t("signup.footerLink")}
					</a>
				</span>
			</div>
		</div>
	);
}
