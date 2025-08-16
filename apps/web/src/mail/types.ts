import type { Locale, Messages } from "next-intl";

export interface MailProvider {
	sendEmail(params: SendParams): Promise<void>;
	subscribe(email: string): Promise<void>;
	unsubscribe(email: string): Promise<void>;
	isSubscribed(email: string): Promise<boolean>;
}

export interface SendParams {
	to: string;
	subject: string;
	text: string;
	html?: string;
}

export interface i18nEmailProps {
	locale: Locale;
	messages: Messages;
}
