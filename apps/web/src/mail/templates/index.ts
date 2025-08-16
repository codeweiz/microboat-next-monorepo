import { getMessagesForLocale } from "@microboat/web/i18n/messages";
import { render } from "@react-email/render";
import type { Locale, Messages } from "next-intl";
import { ContactForm } from "./contact-form";
import { EmailVerification } from "./email-verification";
import { ForgotPassword } from "./forgot-password";
import { MagicLink } from "./magic-link";
import { NewsletterSignup } from "./newsletter-signup";

export const mailTemplates = {
	magicLink: MagicLink,
	forgotPassword: ForgotPassword,
	newsletterSignup: NewsletterSignup,
	emailVerification: EmailVerification,
	contactForm: ContactForm,
} as const;

export type TemplateKey = keyof typeof mailTemplates;

export async function getTemplate<T extends TemplateKey>({
	templateKey,
	context,
	locale,
}: {
	templateKey: T;
	context: Omit<
		Parameters<(typeof mailTemplates)[T]>[0],
		"locale" | "messages"
	>;
	locale: Locale;
}) {
	const template = mailTemplates[templateKey];
	const messages = await getMessagesForLocale(locale);

	const email = template({
		...(context as any),
		locale,
		messages,
	});

	const subject =
		"subject" in messages.mail[templateKey as keyof Messages["mail"]]
			? messages.mail[templateKey].subject
			: "";

	const html = await render(email);
	const text = await render(email, { plainText: true });
	return { html, text, subject };
}
