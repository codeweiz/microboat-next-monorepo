import {ExecutableProvider} from "@microboat/common/types";

// 分析提供商配置接口
export interface AnalyticsProviderConfig {
    trackingId?: string;
    websiteId?: string;
    scriptUrl?: string;
    domain?: string;

    [key: string]: any;
}

// 分析提供商接口
export interface AnalyticsProvider extends ExecutableProvider<AnalyticsProviderConfig> {
    label: string;
    onAccept?: () => void | Promise<void>;
    onReject?: () => void | Promise<void>;
}
