import {
	createAnalyticsManager,
	createGoogleAnalyticsProvider,
	createUmamiProvider,
	createPlausibleProvider,
	type AnalyticsManager,
	type AnalyticsProvider,
} from "@microboat/config";

// 创建分析提供商
const providers: AnalyticsProvider[] = [];

// Google Analytics
if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
	providers.push(createGoogleAnalyticsProvider({
		trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
		enabled: true,
	}));
}

// Umami Analytics
if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL) {
	providers.push(createUmamiProvider({
		websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
		scriptUrl: process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL,
		enabled: true,
	}));
}

// Plausible Analytics
if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL) {
	providers.push(createPlausibleProvider({
		domain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
		scriptUrl: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL,
		enabled: true,
	}));
}

// 创建分析管理器
const analyticsManager = createAnalyticsManager({
	providers,
	autoExecute: false,
	cookieConsent: true,
});

// 导出便利函数
export const getEnabledAnalyticsConfig = () => analyticsManager.getEnabledProviders();
export const hasEnabledAnalyticsConfig = () => analyticsManager.hasEnabledProviders();
export const getAnalyticsProviderConfig = (id: string) => analyticsManager.getProvider(id);
export const executeAnalytics = () => analyticsManager.executeEnabled();

export default analyticsManager;

export type { AnalyticsManager, AnalyticsProvider };
