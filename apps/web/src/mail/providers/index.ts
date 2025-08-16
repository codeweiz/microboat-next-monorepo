import { appConfig } from "@microboat/web/config";
import { PlunkMailProvider } from "@microboat/web/mail/providers/plunk";
import type { MailProvider } from "@microboat/web/mail/types";
import { ResendMailProvider } from "./resend";

const providers = {
	resend: ResendMailProvider,
	plunk: PlunkMailProvider,
} as const;

let mailProviderInstance: MailProvider | null = null;

export function getMailProvider(): MailProvider {
	if (mailProviderInstance) {
		return mailProviderInstance;
	}

	const provider = appConfig.mail.provider as keyof typeof providers;
	mailProviderInstance = new providers[provider]();
	return mailProviderInstance;
}
