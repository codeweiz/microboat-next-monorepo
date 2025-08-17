import type {JSXElementConstructor} from "react";
import {OAuthProvider, OAuthProviderConfig} from "@microboat/auth/types";

// OAuth 提供商工厂函数
export function createOAuthProvider(config: {
    id: string;
    name: string;
    displayName: string;
    icon: JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
    enabled?: boolean;
    config?: OAuthProviderConfig;
    authUrl?: string;
    tokenUrl?: string;
}): OAuthProvider {
    return {
        id: config.id,
        name: config.name,
        displayName: config.displayName,
        icon: config.icon,
        enabled: config.enabled ?? true,
        config: config.config ?? {},
        authUrl: config.authUrl,
        tokenUrl: config.tokenUrl,
    };
}

// 创建多个 OAuth 提供商
export function createOAuthProviders<T extends Record<string, any>>(
    providers: T
): { [K in keyof T]: OAuthProvider } {
    const result = {} as { [K in keyof T]: OAuthProvider };

    for (const [key, config] of Object.entries(providers)) {
        if (config && typeof config === 'object') {
            result[key as keyof T] = createOAuthProvider(config);
        }
    }

    return result;
}

// 类型辅助函数
export type OAuthProviderKey<T extends Record<string, OAuthProvider>> = keyof T;
export type OAuthProviderMap<T extends Record<string, any>> = {
    [K in keyof T]: OAuthProvider;
};