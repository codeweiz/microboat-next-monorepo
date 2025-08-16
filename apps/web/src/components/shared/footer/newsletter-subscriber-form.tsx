"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { Button } from "@microboat/web/components/ui/button";
import { Input } from "@microboat/web/components/ui/input";
import { subscribeToNewsletter } from "@microboat/web/mail/actions";
import { Check, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface NewsletterSubscriberFormProps {
	title: string;
	description: string;
	inputPlaceholder: string;
	submitAriaLabel: string;
}

export function NewsletterSubscriberForm({
	title,
	description,
	inputPlaceholder,
	submitAriaLabel,
}: NewsletterSubscriberFormProps) {
	const t = useTranslations("footer.newsletter");

	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			setError("Please enter your email address");
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		try {
			setError(null);
			setSuccess(null);
			setIsSubmitting(true);

			const result = await subscribeToNewsletter({ email: email.trim() });
			if (result?.serverError) {
				throw new Error(result.serverError);
			}

			setSuccess(t("subscribeSuccess"));
			setIsSubscribed(true);
			setEmail("");
		} catch (err) {
			console.error("Error subscribing to newsletter:", err);
			setError(t("subscribeError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubscribed && success) {
		return (
			<div className="relative">
				<h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
				<p className="mb-6 text-muted-foreground">{description}</p>
				<div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
					<div className="flex-shrink-0">
						<Check className="h-5 w-5 text-green-600 dark:text-green-400" />
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-green-800 dark:text-green-200">
							{success}
						</p>
					</div>
				</div>
				<div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
			</div>
		);
	}

	return (
		<div className="relative">
			<h2 className="mb-4 text-xl font-bold tracking-tight">{title}</h2>
			<p className="mb-6 text-muted-foreground">{description}</p>
			<form className="relative space-y-4" onSubmit={handleSubmit}>
				<div className="relative">
					<Input
						type="email"
						placeholder={inputPlaceholder}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="pr-12 backdrop-blur-sm"
						disabled={isSubmitting}
						required
					/>
					<Button
						type="submit"
						size="icon"
						className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 cursor-pointer"
						disabled={isSubmitting}
					>
						<Send className="h-4 w-4" />
						<span className="sr-only">{submitAriaLabel}</span>
					</Button>
				</div>
				{(error || success) && (
					<CustomFormMessage success={success} error={error} />
				)}
			</form>
			<div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
		</div>
	);
}
