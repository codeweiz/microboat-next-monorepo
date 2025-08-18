import { Link, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";
import EmailLayout from "../components/layout";
import { getDefaultMessages } from "@microboat/web/i18n/messages";
import type { i18nEmailProps } from "../types";
import EmailButton from "../components/email-button";

export function EmailVerification({
  name,
	url,
	locale,
	messages,
}: {
  name: string;
	url: string;
} & i18nEmailProps) {
	const t = createTranslator({
		locale,
		messages,
	});

	return (
		<EmailLayout>
			<Text>{t("mail.emailVerification.body", { name })}</Text>

			<EmailButton href={url}>
				{t("mail.emailVerification.confirmEmail")} &rarr;
			</EmailButton>

			<Text className="text-muted-foreground text-sm">
				{t("mail.common.openLinkInBrowser")}
				<Link href={url} className="break-all">
					{url}
				</Link>
			</Text>
		</EmailLayout>
	);
}

EmailVerification.PreviewProps = {
	locale: "en" as any,
	messages: await getDefaultMessages(),
	url: "#",
	name: "John Doe",
};

export default EmailVerification;
