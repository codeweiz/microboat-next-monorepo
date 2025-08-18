import type { MailProvider, SendParams } from "../types";
import { Resend } from "resend";

export class ResendMailProvider implements MailProvider {
	private resend: Resend;
	private from: string;
	private audienceId?: string;

	constructor(config?: { from?: string }) {
		const resendApiKey = process.env.RESEND_API_KEY;
		
		if (!resendApiKey) {
			throw new Error("Environment variable RESEND_API_KEY is not set");
		}

		this.resend = new Resend(resendApiKey);
		this.from = config?.from || process.env.RESEND_FROM_EMAIL || "noreply@example.com";
		this.audienceId = process.env.RESEND_AUDIENCE_ID;
	}

	async sendEmail(params: SendParams): Promise<void> {
		const { data, error } = await this.resend.emails.send({
			from: this.from,
			to: params.to,
			subject: params.subject,
			html: params.html,
			text: params.text,
		});

		if (error) {
			console.error("Could not send email", error);
			throw new Error("Could not send email");
		}
	}

	private async findContactByEmail(email: string): Promise<any | null> {
		if (!this.audienceId) {
			throw new Error("RESEND_AUDIENCE_ID environment variable is not set");
		}

		try {
			const { data, error } = await this.resend.contacts.list({
				audienceId: this.audienceId,
			});

			if (error) {
				console.error("Error listing contacts:", error);
				return null;
			}

			if (data?.data && Array.isArray(data.data)) {
				return data.data.find((contact) => contact.email === email) || null;
			}

			return null;
		} catch (error) {
			console.error("Error finding contact by email:", error);
			return null;
		}
	}

	async subscribe(email: string): Promise<void> {
		if (!this.audienceId) {
			throw new Error("RESEND_AUDIENCE_ID environment variable is not set");
		}

		try {
			const existingContact = await this.findContactByEmail(email);

			if (existingContact) {
				const { error } = await this.resend.contacts.update({
					id: existingContact.id,
					audienceId: this.audienceId,
					email,
					unsubscribed: false,
				});

				if (error) {
					console.error("Error updating contact subscription:", error);
					throw new Error(
						`Could not update contact subscription: ${error.message}`,
					);
				}

				console.log(`Updated subscription for: ${email}`);
			} else {
				const { error } = await this.resend.contacts.create({
					email,
					audienceId: this.audienceId,
					unsubscribed: false,
				});

				if (error) {
					console.error("Error creating contact:", error);
					throw new Error(`Could not create contact: ${error.message}`);
				}

				console.log(`Created new contact: ${email}`);
			}
		} catch (error) {
			console.error("Error subscribing to newsletter:", error);
			throw error;
		}
	}

	async unsubscribe(email: string): Promise<void> {
		if (!this.audienceId) {
			throw new Error("RESEND_AUDIENCE_ID environment variable is not set");
		}

		try {
			const existingContact = await this.findContactByEmail(email);

			if (!existingContact) {
				console.warn(`Contact not found for unsubscribe: ${email}`);
				return;
			}

			const { error } = await this.resend.contacts.update({
				id: existingContact.id,
				audienceId: this.audienceId,
				email,
				unsubscribed: true,
			});

			if (error) {
				console.error("Error unsubscribing contact:", error);
				throw new Error(`Could not unsubscribe contact: ${error.message}`);
			}

			console.log(`Unsubscribed: ${email}`);
		} catch (error) {
			console.error("Error unsubscribing from newsletter:", error);
			throw error;
		}
	}

	async isSubscribed(email: string): Promise<boolean> {
		if (!this.audienceId) {
			throw new Error("RESEND_AUDIENCE_ID environment variable is not set");
		}

		try {
			const contact = await this.findContactByEmail(email);

			if (!contact) {
				return false;
			}

			return contact.unsubscribed === false;
		} catch (error) {
			console.error("Error checking subscription status:", error);
			return false;
		}
	}
}