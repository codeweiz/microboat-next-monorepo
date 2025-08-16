import { db } from "@microboat/web/database/client";
import { account, session, user, verification } from "@microboat/web/database/schema";
import { getLocaleFromRequest } from "@microboat/web/lib/i18n";
import { getBaseUrl } from "@microboat/web/lib/urls";
import { sendEmail } from "@microboat/web/mail";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: getBaseUrl(),
	trustedOrigins: [getBaseUrl()],
	database: drizzleAdapter(await db(), {
		provider: "sqlite",
		schema: {
			user: user,
			session: session,
			account: account,
			verification: verification,
		},
	}),
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		freshAge: 0,
	},
	user: {
		deleteUser: {
			enabled: true,
		},
		additionalFields: {
			locale: {
				type: "string",
				required: false,
			},
			customerId: {
				type: "string",
				required: false,
			},
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async (
				{ user: { email, name }, url },
				request,
			) => {
				const locale = getLocaleFromRequest(request);
				await sendEmail({
					to: email,
					templateKey: "emailVerification",
					context: {
						name,
						url,
					},
					locale,
				});
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user: { email, name }, url }, request) => {
			const locale = getLocaleFromRequest(request);
			await sendEmail({
				to: email,
				templateKey: "forgotPassword",
				context: {
					name,
					url,
				},
				locale,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user: { email, name }, url }, request) => {
			const locale = getLocaleFromRequest(request);
			await sendEmail({
				to: email,
				templateKey: "emailVerification",
				context: {
					url,
					name,
				},
				locale,
			});
		},
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"],
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			scope: ["email", "profile"],
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	plugins: [admin()],
	onAPIError: {
		onError(error, ctx) {
			console.error(error, { ctx });
		},
	},
});

export type Session = typeof auth.$Infer.Session;
