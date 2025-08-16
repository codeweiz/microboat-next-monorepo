import type { PricePlan } from "@microboat/web/payment/types";
import type { ReactNode } from "react";

export type AppConfig = {
	metadata: MetadataConfig;
	i18n: I18nConfig;
	ui: UiConfig;
	mail: MailConfig;
	auth: AuthConfig;
	settings: SettingsConfig;
	storage: StorageConfig;
	payment: PaymentConfig;
	blog: BlogConfig;
	affiliate: AffiliateConfig;
};

export interface MetadataConfig {
	name: string;
	title: string;
	description: string;
	images: {
		logoLight: string;
		logoDark: string;
		ogImage: string;
	};
	keywords: string[];
}

export interface I18nConfig {
	enabled: boolean;
	defaultLocale: string;
	localeCookieName: string;
	locales: Record<string, { name: string }>;
}

export interface UiConfig {
	theme: {
		enabled: boolean;
		defaultMode: "system" | "light" | "dark";
	};
}

export interface MailConfig {
	provider: "resend" | "plunk";
	from: string;
	contact: string;
}

export interface AuthConfig {
	enableSocialLogin: boolean;
	enablePasswordLogin: boolean;
	redirectAfterSignIn: string;
	redirectAfterLogout: string;
}

export interface SettingsConfig {
	account: {
		canChangeEmail: boolean;
	};
}

export interface StorageConfig {
	provider: string;
	bucketNames: Record<string, string>;
}

export interface PaymentConfig {
	provider: "stripe" | "creem";
	currency: string;
	yearlyDiscount: number;
	redirectAfterCheckout: string;
	plans: Record<string, PricePlan>;
}

export interface BlogConfig {
	pagination: number;
}

export interface AffiliateConfig {
	affonso: {
		enabled: boolean;
		id: string;
	};
}

export type SidebarNavItem = {
	id: string;
	title: string;
	icon?: ReactNode;
	href?: string;
};

export type SidebarNestedNavItem = SidebarNavItem & {
	items?: SidebarNavItem[];
};
