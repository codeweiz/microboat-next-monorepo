// 提供商基础接口
export interface BaseProvider<TConfig = any> {
    id: string;
    name: string;
    enabled: boolean;
    config: TConfig;
}

// 可执行的提供商接口
export interface ExecutableProvider<TConfig = any> extends BaseProvider<TConfig> {
    execute?: () => void | Promise<void>;
}

// 提供商注册表接口
export interface ProviderRegistry<T extends BaseProvider = BaseProvider> {
    register(provider: T): void;

    unregister(id: string): void;

    get(id: string): T | undefined;

    getAll(): T[];

    getEnabled(): T[];
}
