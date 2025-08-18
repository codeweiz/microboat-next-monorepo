import "server-only";

import { appConfigService } from "@microboat/web/config/app-config-service";
import { cookies } from "next/headers";
import type { Locale } from "next-intl";

export async function getUserLocale() {
	const cookie = (await cookies()).get(appConfigService.getI18n().localeCookieName);
	return cookie?.value ?? appConfigService.getI18n().defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
	(await cookies()).set(appConfigService.getI18n().localeCookieName, locale);
}
