import type { AnalyticsProvider, AnalyticsProviderConfig } from "./types";

// Google Analytics 提供商工厂
export function createGoogleAnalyticsProvider(config: {
  trackingId: string;
  enabled?: boolean;
}): AnalyticsProvider {
  return {
    id: "google",
    name: "Google Analytics",
    label: "Google Analytics",
    enabled: config.enabled ?? true,
    config: {
      trackingId: config.trackingId,
    },
    onAccept: () => {
      try {
        // 确保在浏览器环境中执行
        if (typeof window === 'undefined') return;
        
        window.dataLayer = window.dataLayer || [];
        function gtag(..._args: unknown[]) {
          (window.dataLayer as Array<any>).push(arguments);
        }
        gtag("js", new Date());
        gtag("config", config.trackingId);

        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}`;
        script.async = true;
        document.body.appendChild(script);
      } catch (error) {
        console.error("Google Analytics initialization error:", error);
      }
    },
  };
}

// Umami Analytics 提供商工厂
export function createUmamiProvider(config: {
  websiteId: string;
  scriptUrl: string;
  enabled?: boolean;
}): AnalyticsProvider {
  return {
    id: "umami",
    name: "Umami Analytics",
    label: "Umami Analytics",
    enabled: config.enabled ?? true,
    config: {
      websiteId: config.websiteId,
      scriptUrl: config.scriptUrl,
    },
    onAccept: () => {
      try {
        if (typeof window === 'undefined') return;
        
        const script = document.createElement("script");
        script.src = config.scriptUrl;
        script.defer = true;
        script.setAttribute("data-website-id", config.websiteId);
        document.head.appendChild(script);
      } catch (error) {
        console.error("Umami Analytics initialization error:", error);
      }
    },
  };
}

// Plausible Analytics 提供商工厂
export function createPlausibleProvider(config: {
  domain: string;
  scriptUrl: string;
  enabled?: boolean;
}): AnalyticsProvider {
  return {
    id: "plausible",
    name: "Plausible Analytics",
    label: "Plausible Analytics",
    enabled: config.enabled ?? true,
    config: {
      domain: config.domain,
      scriptUrl: config.scriptUrl,
    },
    onAccept: () => {
      try {
        if (typeof window === 'undefined') return;
        
        const script = document.createElement("script");
        script.defer = true;
        script.setAttribute("data-domain", config.domain);
        script.src = config.scriptUrl;
        document.head.appendChild(script);
      } catch (error) {
        console.error("Plausible Analytics initialization error:", error);
      }
    },
  };
}

// 自定义分析提供商工厂
export function createCustomAnalyticsProvider(config: {
  id: string;
  name: string;
  label?: string;
  enabled?: boolean;
  config?: AnalyticsProviderConfig;
  onAccept?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
  execute?: () => void | Promise<void>;
}): AnalyticsProvider {
  return {
    id: config.id,
    name: config.name,
    label: config.label ?? config.name,
    enabled: config.enabled ?? true,
    config: config.config ?? {},
    onAccept: config.onAccept,
    onReject: config.onReject,
    execute: config.execute,
  };
}

// 全局类型声明
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    plausible?: (...args: any[]) => void;
  }
}