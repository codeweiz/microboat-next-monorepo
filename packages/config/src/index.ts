// 核心配置系统
export * from "./core";

// 分析配置
export * from "./analytics";

// 认证配置
export * from "./auth";

// 工具函数
export * from "./utils";

// 重新导出常用的类型，便于使用
export type {
  // 核心类型
  BaseConfig,
  BaseProvider,
  ExecutableProvider,
  ConfigManager,
  ProviderRegistry,
  ComponentConfig,
  
  // 基础配置类型
  MetadataConfig,
  I18nConfig,
  ThemeConfig,
  MailConfig,
  AuthConfig,
  StorageConfig,
  BlogConfig,
  
  // UI 相关类型
  NavItem,
  NavSubMenu,
  NavSubItem,
  SocialMedia,
  SidebarNavItem,
  SidebarNestedNavItem,
  QuickLink,
  Resource,
  LegalLink,
  FooterData,
} from "./core/types";