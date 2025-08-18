import { appConfigService } from "@microboat/web/config/app-config-service";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: Object.keys(appConfigService.getI18n().locales),
	defaultLocale: appConfigService.getI18n().defaultLocale,
	localeCookie: {
		name: appConfigService.getI18n().localeCookieName,
	},
	localeDetection: appConfigService.getI18n().enabled,
	localePrefix: appConfigService.getI18n().enabled ? "as-needed" : "never",
});
