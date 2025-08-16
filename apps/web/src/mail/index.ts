import {
	getTemplate,
	type mailTemplates,
	type TemplateKey,
} from "@microboat/web/mail/templates";
import { appConfig } from "@microboat/web/config";
import { getMailProvider } from "@microboat/web/mail/providers";
import type { Locale } from "next-intl";

export async function sendEmail<T extends TemplateKey>(
	params: {
		to: string;
		locale?: Locale;
	} & (
		| {
				templateKey: T;
				context: Omit<
					Parameters<(typeof mailTemplates)[T]>[0],
					"locale" | "messages"
				>;
		  }
		| {
				subject: string;
				text?: string;
				html?: string;
		  }
	),
) {
	const { to, locale = appConfig.i18n.defaultLocale } = params;

	let html: string;
	let text: string;
	let subject: string;

	if ("templateKey" in params) {
		const { templateKey, context } = params;
		const template = await getTemplate({
			templateKey,
			context,
			locale,
		});
		subject = template.subject;
		text = template.text;
		html = template.html;
	} else {
		subject = params.subject;
		text = params.text ?? "";
		html = params.html ?? "";
	}

	try {
		await getMailProvider().sendEmail({
			to,
			subject,
			text,
			html,
		});
		return true;
	} catch (e) {
		console.error("send email failed", e);
		return false;
	}
}
