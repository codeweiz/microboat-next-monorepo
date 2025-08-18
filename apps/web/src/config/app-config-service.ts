import { createConfigService } from "@microboat/common";
import { appConfig } from "./index";

// 配置服务实例
export const appConfigService = createConfigService(appConfig);