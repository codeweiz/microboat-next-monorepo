"use client";

import { ChangeNewsletterSubscriberForm } from "@microboat/web/components/settings/notification/change-newsletter-subscriber-form";
import { useTranslations } from "next-intl";

export default function NotificationPage() {
	const t = useTranslations("settings.notification");

	return (
		<div className="space-y-8">
			<ChangeNewsletterSubscriberForm />
		</div>
	);
}
