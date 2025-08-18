import { appConfigService } from "@microboat/web/config/app-config-service";
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

	const provider = appConfigService.getMail().provider as keyof typeof providers;
	mailProviderInstance = new providers[provider]();
	return mailProviderInstance;
}
