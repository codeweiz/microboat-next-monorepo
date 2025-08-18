import { getDefaultMessages } from "@microboat/web/i18n/messages";
import EmailLayout from "../components/layout";
import type { i18nEmailProps } from "../types";
import { Heading, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";

export function NewsletterSignup({ locale, messages }: i18nEmailProps) {
	const t = createTranslator({
		locale,
		messages,
	});

	return (
		<EmailLayout>
			<Heading className="text-xl">
				{t("mail.newsletterSignup.subject")}
			</Heading>
			<Text>{t("mail.newsletterSignup.body")}</Text>
		</EmailLayout>
	);
}

NewsletterSignup.PreviewProps = {
	locale: "en" as any,
	messages: await getDefaultMessages(),
};

export default NewsletterSignup;
