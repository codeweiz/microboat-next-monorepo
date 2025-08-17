import type { PricePlan } from "@microboat/web/payment/types";
import type {
	MetadataConfig,
	I18nConfig,
	ThemeConfig,
	MailConfig,
	AuthConfig,
	StorageConfig,
	BlogConfig,
	SidebarNavItem,
	SidebarNestedNavItem,
} from "@microboat/config";

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

export interface UiConfig {
	theme: ThemeConfig;
}

export interface SettingsConfig {
	account: {
		canChangeEmail: boolean;
	};
}

export interface PaymentConfig {
	provider: "stripe" | "creem";
	currency: string;
	yearlyDiscount: number;
	redirectAfterCheckout: string;
	plans: Record<string, PricePlan>;
}

export interface AffiliateConfig {
	affonso: {
		enabled: boolean;
		id: string;
	};
}

export type {
	MetadataConfig,
	I18nConfig,
	ThemeConfig,
	MailConfig,
	AuthConfig,
	StorageConfig,
	BlogConfig,
	SidebarNavItem,
	SidebarNestedNavItem,
};
