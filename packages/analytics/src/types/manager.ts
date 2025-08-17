import {AnalyticsProvider} from "@microboat/analytics/types";

// 分析管理器配置
export interface AnalyticsManagerConfig {
    providers: AnalyticsProvider[];
    autoExecute?: boolean;
    cookieConsent?: boolean;
}
