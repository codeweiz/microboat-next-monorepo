import { getDefaultMessages } from "@microboat/web/i18n/messages";
import EmailButton from "../components/email-button";
import EmailLayout from "../components/layout";
import type { i18nEmailProps } from "../types";
import { Link, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";

export function ForgotPassword({
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
			<Text>{t("mail.forgotPassword.body", { name })}</Text>

			<EmailButton href={url}>
				{t("mail.forgotPassword.resetPassword")} &rarr;
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

ForgotPassword.PreviewProps = {
	locale: "en" as any,
	messages: await getDefaultMessages(),
	url: "#",
};

export default ForgotPassword;
