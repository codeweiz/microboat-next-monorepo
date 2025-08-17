import type { AppConfig } from "@microboat/web/config/types";
import { PaymentType, PlanInterval } from "@microboat/web/payment/types";

export const appConfig = {
	metadata: {
		name: "MICROBOAT",
		title: "MICROBOAT - Next.js Starter Kit",
		description: "The Ultimate Next.js Starter Kit for Your Next Project",
		images: {
			logoLight: "/logo-light.svg",
			logoDark: "/logo-dark.svg",
			ogImage: "/og-image.png",
		},
		keywords: [
			"Next.js",
			"Starter Kit",
			"Next.js SaaS Template",
			"Next.js Boilerplate",
		],
	},
	ui: {
		theme: {
			enabled: true,
			defaultMode: "system",
		},
	},
	blog: {
		pagination: 3,
	},
	mail: {
		provider: "resend",
		from: "noreply@" + process.env.DOMAIN as string,
		contact: "contact@" + process.env.DOMAIN as string,
	},
	i18n: {
		enabled: true,
		defaultLocale: "en",
		locales: {
			en: { name: "English" },
			zh: { name: "简体中文" },
		},
		localeCookieName: "NEXT_LOCALE",
	},
	auth: {
		enableSocialLogin: true,
		enablePasswordLogin: true,
		redirectAfterSignIn: "/app/dashboard",
		redirectAfterLogout: "/",
	},
	settings: {
		account: {
			canChangeEmail: true,
		},
	},
	storage: {
		provider: "s3",
		bucketNames: {
			avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME || "avatars",
		},
	},
	payment: {
		provider: "creem",
		currency: "USD",
		yearlyDiscount: 20,
		redirectAfterCheckout: "/app/dashboard",
		plans: {
			free: {
				id: "free",
				isFree: true,
			},
			pro: {
				id: "pro",
				prices: [
					{
						type: PaymentType.SUBSCRIPTION,
						priceId: process.env.NEXT_PUBLIC_PRICE_ID_PRO_MONTHLY as string,
						amount: 9.9,
						interval: PlanInterval.MONTH,
						trialPeriodDays: 7,
					},
					{
						type: PaymentType.SUBSCRIPTION,
						priceId: process.env.NEXT_PUBLIC_PRICE_ID_PRO_YEARLY as string,
						amount: 99,
						interval: PlanInterval.YEAR,
						trialPeriodDays: 30,
					},
				],
				popular: true,
			},
			lifetime: {
				id: "lifetime",
				prices: [
					{
						type: PaymentType.ONE_TIME,
						priceId: process.env.NEXT_PUBLIC_PRICE_ID_LIFETIME as string,
						amount: 399,
					},
				],
				isLifetime: true,
			},
			enterprise: {
				id: "enterprise",
				isEnterprise: true,
				highlighted: true,
			},
		},
	},
	affiliate: {
		affonso: {
			enabled: false,
			id: process.env.NEXT_PUBLIC_AFFILIATE_AFFONSO_ID || "",
		},
	},
} as const satisfies AppConfig;

export type { AppConfig };
