import { ConfigService } from "@microboat/common";
import type { MailProvider } from "../types";
import type { TemplateKey } from "../types/templates";
import type { Locale } from "next-intl";
import { ResendMailProvider, PlunkMailProvider } from "../providers";
import { getTemplate } from "../templates";

export class MailService {
	private mailProviderInstance: MailProvider | null = null;

	constructor(private configService: ConfigService) {}

	async sendEmail<T extends TemplateKey>(
		params: {
			to: string;
			locale?: Locale;
		} & (
			| {
					templateKey: T;
					context: any;
			  }
			| {
					subject: string;
					text?: string;
					html?: string;
			  }
		),
	) {
		const { to, locale = this.configService.getI18n().defaultLocale } = params;

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
			const provider = this.getMailProvider();
			await provider.sendEmail({
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

	private getMailProvider(): MailProvider {
		if (this.mailProviderInstance) {
			return this.mailProviderInstance;
		}

		const mailConfig = this.configService.getMail();
		const provider = mailConfig.provider as keyof typeof this.providers;
		
		if (!this.providers[provider]) {
			throw new Error(`Mail provider ${provider} not found`);
		}
		this.mailProviderInstance = new this.providers[provider]({
			from: mailConfig.from,
		});
		return this.mailProviderInstance;
	}

	private providers = {
		resend: ResendMailProvider,
		plunk: PlunkMailProvider,
	} as const;


	// Newsletter actions
	async subscribeToNewsletter(email: string): Promise<void> {
		const provider = this.getMailProvider();
		await provider.subscribe(email);
	}

	async unsubscribeFromNewsletter(email: string): Promise<void> {
		const provider = this.getMailProvider();
		await provider.unsubscribe(email);
	}

	async isSubscribedToNewsletter(email: string): Promise<boolean> {
		const provider = this.getMailProvider();
		return await provider.isSubscribed(email);
	}
}