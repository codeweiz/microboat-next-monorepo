"use server";

import { appConfigService } from "@microboat/web/config/app-config-service";
import { actionClient } from "@microboat/web/lib/safe-action";
import { MailService } from "@microboat/mail";
import { getLocale } from "next-intl/server";
import { z } from "zod";

const contactFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Name must be at least 2 characters" })
		.max(50, { message: "Name must not exceed 50 characters" }),
	email: z.string().email({ message: "Please enter a valid email address" }),
	message: z
		.string()
		.min(10, { message: "Message must be at least 10 characters" })
		.max(5000, { message: "Message must not exceed 5000 characters" }),
});

export const sendContactEmailAction = actionClient
	.inputSchema(contactFormSchema)
	.action(async ({ parsedInput }) => {
		try {
			const { name, email, message } = parsedInput;

			const contactEmail = appConfigService.getMail().contact;

			if (!contactEmail) {
				console.error("The contact email not setup");
				throw new Error("The contact email not setup");
			}

			const locale = await getLocale();

			const mailService = new MailService(appConfigService);
			const isSuccess = await mailService.sendEmail({
				to: contactEmail,
				templateKey: "contactForm",
				context: {
					name,
					email,
					message,
				},
				locale,
			});

			return isSuccess;
		} catch (error) {
			console.error("send contact email failed:", error);
			return false;
		}
	});
