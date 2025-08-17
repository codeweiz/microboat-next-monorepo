import {OAuthManagerConfig, OAuthProvider} from "@microboat/auth/types";
import {ProviderRegistry} from "@microboat/common/types";
import {createProviderRegistry} from "@microboat/common/service";

// OAuth 管理器实现
export class OAuthManager {
    private registry: ProviderRegistry<OAuthProvider>;
    private config: OAuthManagerConfig;

    constructor(config: OAuthManagerConfig) {
        this.registry = createProviderRegistry<OAuthProvider>();
        this.config = config;

        // 注册初始提供商
        config.providers.forEach(provider => {
            this.registry.register(provider);
        });
    }

    // 注册新的 OAuth 提供商
    registerProvider(provider: OAuthProvider): void {
        this.registry.register(provider);
    }

    // 获取提供商
    getProvider(id: string): OAuthProvider | undefined {
        return this.registry.get(id);
    }

    // 获取所有启用的提供商
    getEnabledProviders(): OAuthProvider[] {
        return this.registry.getEnabled();
    }

    // 获取所有提供商
    getAllProviders(): OAuthProvider[] {
        return this.registry.getAll();
    }

    // 获取提供商的显示数据
    getProvidersForDisplay(): Array<{
        id: string;
        displayName: string;
        icon: OAuthProvider['icon'];
        enabled: boolean;
    }> {
        return this.getAllProviders().map(provider => ({
            id: provider.id,
            displayName: provider.displayName,
            icon: provider.icon,
            enabled: provider.enabled,
        }));
    }

    // 检查提供商是否启用
    isProviderEnabled(id: string): boolean {
        const provider = this.getProvider(id);
        return provider?.enabled ?? false;
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
    updateProviderConfig(id: string, config: Partial<OAuthProvider['config']>): void {
        const provider = this.registry.get(id);
        if (provider) {
            provider.config = {...provider.config, ...config};
        }
    }
}

export function createOAuthManager(config: OAuthManagerConfig): OAuthManager {
    return new OAuthManager(config);
}