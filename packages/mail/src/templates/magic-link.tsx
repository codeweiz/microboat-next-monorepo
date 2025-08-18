import { getDefaultMessages } from "@microboat/web/i18n/messages";
import EmailButton from "../components/email-button";
import EmailLayout from "../components/layout";
import type { i18nEmailProps } from "../types";
import { Link, Text } from "@react-email/components";
import React from "react";
import { createTranslator } from "use-intl/core";

export function MagicLink({
	url,
	locale,
	messages,
}: {
	url: string;
} & i18nEmailProps) {
	const t = createTranslator({
		locale,
		messages,
	});

	return (
		<EmailLayout>
			<Text>{t("mail.magicLink.body")}</Text>

			<Text>{t("mail.common.useLink")}</Text>

			<EmailButton href={url}>{t("mail.magicLink.login")} &rarr;</EmailButton>

			<Text className="text-muted-foreground text-sm">
				{t("mail.common.openLinkInBrowser")}
				<Link href={url} className="break-all">
					{url}
				</Link>
			</Text>
		</EmailLayout>
	);
}

MagicLink.PreviewProps = {
	locale: "en" as any,
	messages: await getDefaultMessages(),
	url: "#",
};

export default MagicLink;
