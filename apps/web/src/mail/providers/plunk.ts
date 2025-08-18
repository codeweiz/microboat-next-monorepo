import { appConfigService } from "@microboat/web/config/app-config-service";
import type { MailProvider, SendParams } from "@microboat/web/mail/types";

export class PlunkMailProvider implements MailProvider {
		private apiKey: string;
		private from: string;

		constructor() {
			const apiKey = process.env.PLUNK_API_KEY;
			const { from } = appConfigService.getMail();

			if (!apiKey) {
				throw new Error("Environment variable PLUNK_API_KEY is not set");
			}

			this.apiKey = apiKey;
			this.from = from;
		}

		async sendEmail(params: SendParams): Promise<void> {
			const response = await fetch("https://api.useplunk.com/v1/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					to: params.to,
					from: this.from,
					subject: params.subject,
					body: params.html,
					text: params.text,
				}),
			});

			if (!response.ok) {
				console.error("Could not send email", await response.json());
				throw new Error("Could not send email");
			}
		}

		subscribe(email: string): Promise<void> {
			throw new Error("Method not implemented.");
		}
		unsubscribe(email: string): Promise<void> {
			throw new Error("Method not implemented.");
		}
		isSubscribed(email: string): Promise<boolean> {
			throw new Error("Method not implemented.");
		}
	}
