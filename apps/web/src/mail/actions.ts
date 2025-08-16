"use server";

import { actionClient } from "@microboat/web/lib/safe-action";
import { getMailProvider } from "@microboat/web/mail/providers";
import { z } from "zod";

const newsletterSchema = z.object({
	email: z.string().email(),
});

export const subscribeToNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.void())
	.action(async ({ parsedInput: { email } }) => {
		const mailProvider = getMailProvider();
		await mailProvider.subscribe(email);
	});

export const unsubscribeFromNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.void())
	.action(async ({ parsedInput: { email } }) => {
		const mailProvider = getMailProvider();
		await mailProvider.unsubscribe(email);
	});

export const isSubscribedToNewsletter = actionClient
	.inputSchema(newsletterSchema)
	.outputSchema(z.boolean())
	.action(async ({ parsedInput: { email } }) => {
		const mailProvider = getMailProvider();
		return await mailProvider.isSubscribed(email);
	});