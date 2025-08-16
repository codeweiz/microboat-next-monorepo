import { appConfig } from "@microboat/web/config";
import { getDefaultMessages } from "@microboat/web/i18n/messages";
import EmailLayout from "@microboat/web/mail/components/layout";
import type { i18nEmailProps } from "@microboat/web/mail/types";
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
	locale: appConfig.i18n.defaultLocale,
	messages: await getDefaultMessages(),
};

export default NewsletterSignup;
