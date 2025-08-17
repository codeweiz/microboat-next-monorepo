import {OAuthProvider} from "@microboat/auth/types";

// OAuth 管理器配置
export interface OAuthManagerConfig {
    providers: OAuthProvider[];
    defaultRedirectUri?: string;
}