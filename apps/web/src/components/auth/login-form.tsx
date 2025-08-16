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
import { appConfig } from "@microboat/web/config";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SocialSignin } from "./social-signin";

export function LoginForm() {
	const router = useRouter();
	const { enableSocialLogin, enablePasswordLogin } = appConfig.auth;
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirectTo");
	const t = useTranslations("auth");

	const loginSchema = z.object({
		email: z
			.string()
			.min(1, { message: t("validation.emailRequired") })
			.email({ message: t("validation.emailInvalid") }),
		password: z.string().min(1, { message: t("validation.passwordRequired") }),
	});

	type LoginFormValues = z.infer<typeof loginSchema>;

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const redirectPath = redirectTo ?? appConfig.auth.redirectAfterSignIn;

	const onSubmit = async (values: LoginFormValues) => {
		try {
			const result = await authClient.signIn.email(
				{
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
						router.replace(redirectPath);
					},
					onError: (ctx) => {
						setError(getAuthErrorMessage(ctx.error.code));
					},
				},
			);

			if (result.error) {
				throw result.error;
			}
		} catch (e) {
			setError(
				getAuthErrorMessage(
					e && typeof e === "object" && "code" in e
						? (e.code as string)
						: undefined,
				),
			);
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
				<h1 className="text-2xl font-semibold">{t("login.title")}</h1>
				<p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
			</div>

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
						{t("login.dividerText")}
					</span>
					<div className="flex-1 h-px bg-gray-300" />
				</div>
			)}

			{/* Password Login Form */}
			{enablePasswordLogin && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold">
											{t("login.emailLabel")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t("login.emailPlaceholder")}
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
											{t("login.passwordLabel")}
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showPassword ? "text" : "password"}
													disabled={isLoading}
													className="h-12 text-base pr-10"
													autoComplete="current-password"
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
															? t("login.hidePassword")
															: t("login.showPassword")}
													</span>
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="text-left">
							<a
								className="text-sm underline text-muted-foreground hover:text-primary"
								href="/auth/forgot-password"
							>
								{t("login.forgotPassword")}
							</a>
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
									{t("login.submittingButton")}
								</>
							) : (
								t("login.submitButton")
							)}
						</Button>
					</form>
				</Form>
			)}

			<div className="text-center mt-8">
				<span className="text-sm text-muted-foreground">
					{t("login.footerText")}{" "}
					<a
						href={
							redirectPath
								? `/auth/signup?redirectTo=${redirectPath}`
								: "/auth/signup"
						}
						className="font-bold hover:underline"
					>
						{t("login.footerLink")}
					</a>
				</span>
			</div>
		</div>
	);
}
