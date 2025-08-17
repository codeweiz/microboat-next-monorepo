import {PricePlan, ThemeConfig} from "@microboat/common/types";

// 应用配置
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

// 元数据配置
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

// 国际化配置
export interface I18nConfig {
    enabled: boolean;
    defaultLocale: string;
    localeCookieName: string;
    locales: Record<string, { name: string }>;
}

// UI 配置
export interface UiConfig {
    theme: ThemeConfig;
}

// 邮件配置
export interface MailConfig {
    provider: string;
    from: string;
    contact: string;
}

// 认证配置
export interface AuthConfig {
    enableSocialLogin: boolean;
    enablePasswordLogin: boolean;
    redirectAfterSignIn: string;
    redirectAfterLogout: string;
}

// 设置配置
export interface SettingsConfig {
    account: {
        canChangeEmail: boolean;
    };
}

// 存储配置
export interface StorageConfig {
    provider: string;
    bucketNames: Record<string, string>;
}

// 支付配置
export interface PaymentConfig {
    // 支付提供商
    provider: "stripe" | "creem";
    // 货币
    currency: string;
    // 年订阅折扣
    yearlyDiscount: number;
    // 结账后重定向
    redirectAfterCheckout: string;
    // 价格计划
    plans: Record<string, PricePlan>;
}

// 博客配置
export interface BlogConfig {
    pagination: number;
}

// Affiliate 配置
export interface AffiliateConfig {
    affonso: {
        enabled: boolean;
        id: string;
    };
}