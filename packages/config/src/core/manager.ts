import type { BaseConfig, ConfigManager } from "./types";

export class ConfigManagerImpl<T extends BaseConfig> implements ConfigManager<T> {
  private config: T;

  constructor(initialConfig: T) {
    this.config = { ...initialConfig };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.config[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.config[key] = value;
  }

  merge(config: Partial<T>): void {
    this.config = { ...this.config, ...config };
  }

  getAll(): T {
    return { ...this.config };
  }

  validate?(): boolean {
    // 可以在子类中重写实现具体的验证逻辑
    return true;
  }
}

export function createConfigManager<T extends BaseConfig>(initialConfig: T): ConfigManager<T> {
  return new ConfigManagerImpl(initialConfig);
}