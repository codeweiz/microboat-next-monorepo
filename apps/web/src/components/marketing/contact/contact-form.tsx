"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { SocialButton } from "@microboat/web/components/shared/footer/social-button";
import { Button } from "@microboat/web/components/ui/button";
import { Input } from "@microboat/web/components/ui/input";
import { Label } from "@microboat/web/components/ui/label";
import { Textarea } from "@microboat/web/components/ui/textarea";
import { appConfig } from "@microboat/web/config";
import { sendContactEmailAction } from "@microboat/web/lib/actions/send-contact-email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ContactForm() {
	const t = useTranslations("contact");
	const [isPending, startTransition] = useTransition();

	const formSchema = z.object({
		name: z
			.string()
			.min(2, { message: t("form.nameMinLength") })
			.max(50, { message: t("form.nameMaxLength") }),
		email: z
			.string()
			.min(1, { message: t("form.emailRequired") })
			.email({ message: t("form.emailInvalid") }),
		message: z
			.string()
			.min(10, { message: t("form.messageMinLength") })
			.max(5000, { message: t("form.messageMaxLength") }),
	});

	type ContactFormValues = z.infer<typeof formSchema>;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ContactFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			message: "",
		},
	});

	const onSubmit = (values: ContactFormValues) => {
		startTransition(async () => {
			try {
				const result = await sendContactEmailAction(values);

				if (result?.data) {
					toast.success(t("form.success"));
					reset();
				} else {
					toast.error(t("form.error"));
				}
			} catch (err) {
				console.error("Form submission error:", err);
				toast.error(t("form.error"));
			}
		});
	};

	return (
		<div className="min-h-screen bg-background py-32 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold text-foreground mb-4">
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
				</div>

				<div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
					<div className="space-y-8 lg:pr-4">
						<div>
							<h2 className="text-xl font-semibold text-foreground mb-4">
								{t("corporateOffice")}
							</h2>
							<p className="text-muted-foreground whitespace-pre-line">
								{t("address")}
							</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold text-foreground mb-4">
								{t("emailUs")}
							</h2>
							<div className="space-y-2">
								<div>
									<span className="text-muted-foreground">
										{appConfig.mail.contact}
									</span>
								</div>
							</div>
						</div>

						<SocialButton />
					</div>

					<div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border transform -translate-x-1/2" />

					<div className="lg:pl-4">
						<h2 className="text-xl font-semibold text-foreground mb-6">
							{t("inquiries")}
						</h2>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<Label
									htmlFor="name"
									className="text-sm font-medium text-foreground"
								>
									{t("form.fullName")}
								</Label>
								<Input
									id="name"
									type="text"
									placeholder="Your name"
									className="mt-1"
									{...register("name")}
								/>
							</div>

							<CustomFormMessage error={errors.name?.message || ""} />

							<div>
								<Label
									htmlFor="email"
									className="text-sm font-medium text-foreground"
								>
									Email
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="your@email.com"
									className="mt-1"
									{...register("email")}
								/>
							</div>

							<CustomFormMessage error={errors.email?.message || ""} />

							<div>
								<Label
									htmlFor="message"
									className="text-sm font-medium text-foreground"
								>
									{t("form.message")}
								</Label>
								<Textarea
									id="message"
									placeholder="Write your message here..."
									rows={4}
									className="mt-1"
									{...register("message")}
								/>
							</div>

							<CustomFormMessage error={errors.message?.message || ""} />

							<div className="flex justify-center">
								<Button
									type="submit"
									disabled={isPending}
									className="px-8 py-2 cursor-pointer w-full"
								>
									{isPending ? t("form.submitting") : t("form.submit")}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
