"use client";

import {createContext, useContext, useMemo} from "react";
import {ConfigService, createConfigService} from "./config-service";
import type {AppConfig} from "../types/app";

// 配置上下文
const ConfigContext = createContext<ConfigService | null>(null);

/**
 * 配置提供者
 * @param children 子组件
 * @param config 应用配置
 * */
export function ConfigProvider({children, config}: {
    children: React.ReactNode;
    config: AppConfig;
}) {
    const configService = useMemo(() => createConfigService(config), [config]);

    return (
        <ConfigContext.Provider value={configService}>
            {children}
        </ConfigContext.Provider>
    );
}

/**
 * 使用配置
 *
 * @return 配置服务
 * */
export function useConfig(): ConfigService {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
}