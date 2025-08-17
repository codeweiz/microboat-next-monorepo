import type { BaseProvider, ProviderRegistry } from "./types";

export class ProviderRegistryImpl<T extends BaseProvider> implements ProviderRegistry<T> {
  private providers = new Map<string, T>();

  register(provider: T): void {
    this.providers.set(provider.id, provider);
  }

  unregister(id: string): void {
    this.providers.delete(id);
  }

  get(id: string): T | undefined {
    return this.providers.get(id);
  }

  getAll(): T[] {
    return Array.from(this.providers.values());
  }

  getEnabled(): T[] {
    return this.getAll().filter(provider => provider.enabled);
  }

  has(id: string): boolean {
    return this.providers.has(id);
  }

  clear(): void {
    this.providers.clear();
  }

  forEach(callback: (provider: T, id: string) => void): void {
    this.providers.forEach(callback);
  }
}

export function createProviderRegistry<T extends BaseProvider>(): ProviderRegistry<T> {
  return new ProviderRegistryImpl<T>();
}