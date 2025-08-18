import type { MailProvider, SendParams } from "../types";

export class PlunkMailProvider implements MailProvider {
	private apiKey: string;
	private from: string;

	constructor(config?: { from?: string }) {
		const apiKey = process.env.PLUNK_API_KEY;
		
		if (!apiKey) {
			throw new Error("Environment variable PLUNK_API_KEY is not set");
		}

		this.apiKey = apiKey;
		this.from = config?.from || process.env.PLUNK_FROM_EMAIL || "noreply@example.com";
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