import type {
    AppConfig,
    MetadataConfig,
    I18nConfig,
    UiConfig,
    MailConfig,
    AuthConfig,
    SettingsConfig,
    StorageConfig,
    PaymentConfig,
    BlogConfig,
    AffiliateConfig
} from "../types/app";

/**
 * 配置服务接口
 * */
export interface ConfigService {
    // 获取完整配置
    getConfig(): AppConfig;

    // 按模块获取配置
    getMetadata(): MetadataConfig;

    getI18n(): I18nConfig;

    getUi(): UiConfig;

    getMail(): MailConfig;

    getAuth(): AuthConfig;

    getSettings(): SettingsConfig;

    getStorage(): StorageConfig;

    getPayment(): PaymentConfig;

    getBlog(): BlogConfig;

    getAffiliate(): AffiliateConfig;
}

/**
 * 创建配置服务
 *
 * @param config 应用配置
 * @return 配置服务
 * */
export function createConfigService(config: AppConfig): ConfigService {
    return {
        getConfig: () => config,
        getMetadata: () => config.metadata,
        getI18n: () => config.i18n,
        getUi: () => config.ui,
        getMail: () => config.mail,
        getAuth: () => config.auth,
        getSettings: () => config.settings,
        getStorage: () => config.storage,
        getPayment: () => config.payment,
        getBlog: () => config.blog,
        getAffiliate: () => config.affiliate,
    };
}
