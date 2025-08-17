import type { BaseConfig, ConfigManager } from "../core/types";
import { createConfigManager } from "../core/manager";
import { createAnalyticsManager } from "../analytics/manager";
import { createOAuthManager } from "../auth/manager";
import type { AnalyticsManagerConfig } from "../analytics/types";
import type { OAuthManagerConfig } from "../auth/types";

// 通用配置工厂
export function createAppConfig<T extends BaseConfig>(config: T): ConfigManager<T> {
  return createConfigManager(config);
}

// 快速创建分析管理器
export function createQuickAnalyticsManager(providers: AnalyticsManagerConfig['providers']): ReturnType<typeof createAnalyticsManager> {
  return createAnalyticsManager({
    providers,
    autoExecute: false,
    cookieConsent: true,
  });
}

// 快速创建 OAuth 管理器
export function createQuickOAuthManager(providers: OAuthManagerConfig['providers']): ReturnType<typeof createOAuthManager> {
  return createOAuthManager({
    providers,
  });
}

// 环境变量辅助函数  
export function getEnvConfig(key: string, defaultValue?: string): string | undefined {
  if (typeof process !== 'undefined' && process?.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
}

// 条件配置辅助函数
export function conditionalConfig<T>(condition: boolean, config: T): T | undefined {
  return condition ? config : undefined;
}

// 配置合并辅助函数
export function mergeConfigs<T extends BaseConfig>(...configs: Partial<T>[]): Partial<T> {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {} as Partial<T>);
}