"use server";

import { actionClient } from "@microboat/web/lib/safe-action";
import { appConfigService } from "@microboat/web/config/app-config-service";
import { MailService } from "@microboat/mail";
import { z } from "zod";

const newsletterSchema = z.object({
	email: z.string().email(),
});

export const subscribeToNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.void())
	.action(async ({ parsedInput: { email } }) => {
		const mailService = new MailService(appConfigService);
		await mailService.subscribeToNewsletter(email);
	});

export const unsubscribeFromNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.void())
	.action(async ({ parsedInput: { email } }) => {
		const mailService = new MailService(appConfigService);
		await mailService.unsubscribeFromNewsletter(email);
	});

export const isSubscribedToNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.boolean())
	.action(async ({ parsedInput: { email } }) => {
		const mailService = new MailService(appConfigService);
		return await mailService.isSubscribedToNewsletter(email);
	});