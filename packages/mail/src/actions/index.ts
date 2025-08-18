"use server";

import { ConfigService } from "@microboat/common";
import { MailService } from "../service";
import { z } from "zod";

const newsletterSchema = z.object({
	email: z.string().email(),
});

export async function subscribeToNewsletter(
	email: string,
	configService: ConfigService
) {
	const mailService = new MailService(configService);
	await mailService.subscribeToNewsletter(email);
}

export async function unsubscribeFromNewsletter(
	email: string,
	configService: ConfigService
) {
	const mailService = new MailService(configService);
	await mailService.unsubscribeFromNewsletter(email);
}

export async function isSubscribedToNewsletter(
	email: string,
	configService: ConfigService
): Promise<boolean> {
	const mailService = new MailService(configService);
	return await mailService.isSubscribedToNewsletter(email);
}