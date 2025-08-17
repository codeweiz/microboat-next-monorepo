import type { ReactNode } from "react";

// 基础配置接口
export interface BaseConfig {
  [key: string]: any;
}

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

// 配置管理器接口
export interface ConfigManager<T extends BaseConfig> {
  get<K extends keyof T>(key: K): T[K];
  set<K extends keyof T>(key: K, value: T[K]): void;
  merge(config: Partial<T>): void;
  validate?(): boolean;
}

// 提供商注册表接口
export interface ProviderRegistry<T extends BaseProvider = BaseProvider> {
  register(provider: T): void;
  unregister(id: string): void;
  get(id: string): T | undefined;
  getAll(): T[];
  getEnabled(): T[];
}

// 通用 React 组件配置
export interface ComponentConfig {
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

// 元数据配置
export interface MetadataConfig {
  name: string;
  title: string;
  description: string;
  images: {
    logoLight: string;
    logoDark: string;
    ogImage: string;
  };
  keywords: string[];
}

// 国际化配置
export interface I18nConfig {
  enabled: boolean;
  defaultLocale: string;
  localeCookieName: string;
  locales: Record<string, { name: string }>;
}

// UI 主题配置
export interface ThemeConfig {
  enabled: boolean;
  defaultMode: "system" | "light" | "dark";
}

// 邮件配置
export interface MailConfig {
  provider: string;
  from: string;
  contact: string;
}

// 认证配置
export interface AuthConfig {
  enableSocialLogin: boolean;
  enablePasswordLogin: boolean;
  redirectAfterSignIn: string;
  redirectAfterLogout: string;
}

// 存储配置
export interface StorageConfig {
  provider: string;
  bucketNames: Record<string, string>;
}

// 博客配置
export interface BlogConfig {
  pagination: number;
}

// 导航相关配置
export interface NavSubItem {
  label: string;
  description: string;
  icon: React.ElementType;
  link: string;
}

export interface NavSubMenu {
  title: string;
  items: NavSubItem[];
}

export interface NavItem {
  id: number;
  label: string;
  link?: string;
  subMenus?: NavSubMenu[];
}

// 社交媒体配置
export interface SocialMedia {
  name: string;
  href: string;
  icon: ReactNode;
}

// 侧边栏配置
export type SidebarNavItem = {
  id: string;
  title: string;
  icon?: ReactNode;
  href?: string;
};

export type SidebarNestedNavItem = SidebarNavItem & {
  items?: SidebarNavItem[];
};

// 页脚相关配置
export interface QuickLink {
  label: string;
  href: string;
}

export interface Resource {
  label: string;
  href: string;
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface FooterData {
  newsletter: {
    title: string;
    description: string;
    inputPlaceholder: string;
    submitAriaLabel: string;
  };
  quickLinks: {
    title: string;
    links: QuickLink[];
  };
  resources: {
    title: string;
    links: Resource[];
  };
  social: {
    title: string;
    media: SocialMedia[];
  };
  copyright: string;
  legalLinks: LegalLink[];
}