import type { BaseProvider, ComponentConfig } from "../core/types";
import type { JSXElementConstructor } from "react";

// OAuth 提供商配置
export interface OAuthProviderConfig {
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  scopes?: string[];
  [key: string]: any;
}

// OAuth 提供商接口
export interface OAuthProvider extends BaseProvider<OAuthProviderConfig> {
  displayName: string;
  icon: JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
  authUrl?: string;
  tokenUrl?: string;
  className?: string;
}

// OAuth 管理器配置
export interface OAuthManagerConfig {
  providers: OAuthProvider[];
  defaultRedirectUri?: string;
}