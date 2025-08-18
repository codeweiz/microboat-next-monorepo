import type { Locale } from "next-intl";

export interface TemplateRenderParams {
	locale: Locale;
	context: any;
}

export interface TemplateResult {
	subject: string;
	text: string;
	html: string;
}

export type TemplateKey = "magicLink" | "forgotPassword" | "newsletterSignup" | "emailVerification" | "contactForm";