import { createProviderRegistry } from "../core/registry";
import type { ProviderRegistry } from "../core/types";
import type { AnalyticsProvider, AnalyticsManagerConfig } from "./types";

export class AnalyticsManager {
  private registry: ProviderRegistry<AnalyticsProvider>;
  private config: AnalyticsManagerConfig;

  constructor(config: AnalyticsManagerConfig) {
    this.registry = createProviderRegistry<AnalyticsProvider>();
    this.config = config;
    
    // 注册初始提供商
    config.providers.forEach(provider => {
      this.registry.register(provider);
    });
  }

  // 注册新的分析提供商
  registerProvider(provider: AnalyticsProvider): void {
    this.registry.register(provider);
  }

  // 获取提供商
  getProvider(id: string): AnalyticsProvider | undefined {
    return this.registry.get(id);
  }

  // 获取所有启用的提供商
  getEnabledProviders(): AnalyticsProvider[] {
    return this.registry.getEnabled();
  }

  // 获取所有提供商
  getAllProviders(): AnalyticsProvider[] {
    return this.registry.getAll();
  }

  // 检查是否有启用的提供商
  hasEnabledProviders(): boolean {
    return this.getEnabledProviders().length > 0;
  }

  // 执行所有启用的提供商
  async executeEnabled(): Promise<void> {
    const enabled = this.getEnabledProviders();
    
    await Promise.all(
      enabled.map(async (provider) => {
        try {
          if (provider.execute) {
            await provider.execute();
          }
          if (provider.onAccept) {
            await provider.onAccept();
          }
        } catch (error) {
          console.error(`Analytics provider ${provider.id} execution failed:`, error);
        }
      })
    );
  }

  // 启用提供商
  enableProvider(id: string): void {
    const provider = this.registry.get(id);
    if (provider) {
      provider.enabled = true;
    }
  }

  // 禁用提供商
  disableProvider(id: string): void {
    const provider = this.registry.get(id);
    if (provider) {
      provider.enabled = false;
    }
  }

  // 更新提供商配置
  updateProviderConfig(id: string, config: Partial<AnalyticsProvider['config']>): void {
    const provider = this.registry.get(id);
    if (provider) {
      provider.config = { ...provider.config, ...config };
    }
  }
}

export function createAnalyticsManager(config: AnalyticsManagerConfig): AnalyticsManager {
  return new AnalyticsManager(config);
}