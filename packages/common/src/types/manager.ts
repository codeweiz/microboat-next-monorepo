// 基础配置接口
export interface BaseConfig {
    [key: string]: any;
}

// 配置管理器接口
export interface ConfigManager<T extends BaseConfig> {
    get<K extends keyof T>(key: K): T[K];

    set<K extends keyof T>(key: K, value: T[K]): void;

    merge(config: Partial<T>): void;

    validate?(): boolean;
}
