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
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export function ForgotPasswordForm() {
	const id = useId();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const t = useTranslations("auth");

	const forgotPasswordSchema = z.object({
		email: z
			.string()
			.min(1, { message: t("validation.emailRequired") })
			.email({ message: t("validation.emailInvalid") }),
	});

	type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: ForgotPasswordFormValues) => {
		setError(null);
		setSuccess(null);

		try {
			const result = await authClient.forgetPassword({
				email: values.email,
				redirectTo: "/auth/reset-password",
			});

			if (result.error) {
				throw result.error;
			}

			setSuccess(t("forgotPassword.successMessage"));
		} catch (err) {
			setError(getAuthErrorMessage(err));
		}
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
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold">
						{t("forgotPassword.title")}
					</h1>
					{success ? (
						<div className="text-md font-bold text-muted-foreground bg-green-500/10 dark:bg-green-900/10 p-4 rounded-md">
							{t("forgotPassword.successMessage")}
						</div>
					) : (
						<p className="text-sm text-muted-foreground max-w-sm mx-auto">
							{t("forgotPassword.subtitle")}
						</p>
					)}
				</div>
			</div>

			{!success && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold">
										{t("forgotPassword.emailLabel")}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t("forgotPassword.emailPlaceholder")}
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

						<CustomFormMessage success={success} error={error} />

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full h-12 text-base font-bold rounded-lg cursor-pointer"
						>
							{isLoading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									{t("forgotPassword.submittingButton")}
								</>
							) : (
								t("forgotPassword.submitButton")
							)}
						</Button>
					</form>
				</Form>
			)}

			<div className="text-center mt-8">
				<span className="text-sm text-muted-foreground">
					{t("forgotPassword.footerText")}{" "}
					<a
						href="/auth/login"
						className="font-bold underline hover:text-primary"
					>
						{t("forgotPassword.footerLink")}
					</a>
				</span>
			</div>
		</div>
	);
}
