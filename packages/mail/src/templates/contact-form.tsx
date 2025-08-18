import { getDefaultMessages } from "@microboat/web/i18n/messages";
import EmailLayout from "../components/layout";
import type { i18nEmailProps } from "../types";
import { Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";

export function ContactForm({
	name,
	email,
	message,
	locale,
	messages,
}: {
	name: string;
	email: string;
	message: string;
} & i18nEmailProps) {
	const t = createTranslator({
		locale,
		messages,
	});

	return (
		<EmailLayout>
			<Text>{t("mail.contactForm.greeting", { name })}</Text>

			<Text className="font-semibold">
				{t("mail.contactForm.fromLabel")} {name}
			</Text>

			<Text className="font-semibold">
				{t("mail.contactForm.emailLabel")} {email}
			</Text>

			<Text className="font-semibold">
				{t("mail.contactForm.messageLabel")}
			</Text>
			<Text className="whitespace-pre-wrap">{message}</Text>
		</EmailLayout>
	);
}

ContactForm.PreviewProps = {
	locale: "en" as any,
	messages: await getDefaultMessages(),
	name: "John Doe",
	email: "john@example.com",
	message: "This is a test message from the contact form.",
};

export default ContactForm;
