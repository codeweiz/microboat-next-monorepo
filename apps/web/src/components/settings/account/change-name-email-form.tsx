"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { Button } from "@microboat/web/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@microboat/web/components/ui/form";
import { Input } from "@microboat/web/components/ui/input";
import { Label } from "@microboat/web/components/ui/label";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import { useConfig } from "@microboat/common";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function ChangeNameEmailForm() {
	const config = useConfig();
	const { user, reloadSession } = useSession();
	const t = useTranslations();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const canChangeEmail = config.getSettings().account.canChangeEmail;

	const formSchema = z.object({
		name: z
			.string()
			.min(1, { message: t("auth.validation.nameRequired") })
			.max(50, { message: t("auth.validation.nameMaxLength") }),
		email: z.string().email({ message: t("auth.validation.emailInvalid") }),
	});

	type FormSchema = z.infer<typeof formSchema>;

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: user?.name ?? "",
			email: user?.email ?? "",
		},
	});

	// Reset form values when user data changes
	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name ?? "",
				email: user.email ?? "",
			});
		}
	}, [user, form]);

	const onSubmit = async (values: FormSchema) => {
		try {
			setError(null);
			setSuccess(null);
			setIsSaving(true);

			// Check if anything actually changed
			const hasNameChanged = values.name !== user?.name;
			const hasEmailChanged = values.email !== user?.email && canChangeEmail;

			if (!hasNameChanged && !hasEmailChanged) {
				console.log("No changes to save");
				setIsSaving(false);
				return;
			}

			// Update name if changed
			if (hasNameChanged) {
				const { error: nameError } = await authClient.updateUser({
					name: values.name,
				});

				if (nameError) {
					setError(getAuthErrorMessage(nameError.code));
					setIsSaving(false);
					return;
				}
			}

			if (hasEmailChanged && canChangeEmail) {
				const { error: emailError } = await authClient.changeEmail({
					newEmail: values.email,
					callbackURL: config.getAuth().redirectAfterSignIn,
				});

				if (emailError) {
					setError(getAuthErrorMessage(emailError.code));
					setIsSaving(false);
					return;
				}
			}

			reloadSession();

			form.reset({
				name: values.name,
				email: canChangeEmail ? values.email : (user?.email ?? ""),
			});

			if (hasEmailChanged) {
				setSuccess(t("settings.account.general.emailUpdateSuccess"));
			} else if (hasNameChanged) {
				setSuccess(t("settings.account.general.nameUpdateSuccess"));
			}
		} catch (err) {
			setError(getAuthErrorMessage(err));
		} finally {
			setIsSaving(false);
		}
	};

	// Loading skeleton when user data is not available
	if (!user) {
		return (
			<div className="space-y-8">
				{/* General Section Skeleton */}
				<div>
					<div className="flex items-center justify-between mb-6">
						<div className="space-y-2">
							<Skeleton className="h-7 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-9 w-16" />
					</div>

					<div className="space-y-4">
						<div>
							<Skeleton className="h-4 w-12 mb-2" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-48 mt-1" />
						</div>

						<div>
							<Skeleton className="h-4 w-12 mb-2" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-56 mt-1" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* General Section */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold">
							{t("settings.account.general.title")}
						</h2>
						<p className="text-sm text-muted-foreground mt-2">
							{t("settings.account.general.description")}
						</p>
					</div>
					<Button
						variant="ghost"
						onClick={form.handleSubmit(onSubmit)}
						disabled={
							isSaving || !(form.formState.isValid && form.formState.isDirty)
						}
						className="font-bold cursor-pointer"
					>
						{isSaving ? "Saving..." : t("settings.account.general.save")}
					</Button>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="name" className="font-bold">
										{t("settings.account.general.name")}
									</Label>
									<FormControl>
										<Input id="name" {...field} className="mt-2" />
									</FormControl>
									<FormMessage />
									<p className="text-xs text-muted-foreground mt-1">
										{t("auth.validation.nameRequired")} and{" "}
										{t("auth.validation.nameMaxLength")}
									</p>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<Label htmlFor="email" className="font-bold">
										{t("settings.account.general.email")}
									</Label>
									<FormControl>
										<Input
											id="email"
											{...field}
											className={`mt-2 ${!canChangeEmail ? "bg-muted" : ""}`}
											disabled={!canChangeEmail}
										/>
									</FormControl>
									{canChangeEmail && <FormMessage />}
									<p className="text-xs text-muted-foreground mt-1">
										{canChangeEmail
											? t("settings.account.general.emailNote")
											: t("settings.account.general.emailCanNotBeUpdated")}
									</p>
								</FormItem>
							)}
						/>

						<CustomFormMessage success={success} error={error} />
					</form>
				</Form>
			</div>
		</div>
	);
}
