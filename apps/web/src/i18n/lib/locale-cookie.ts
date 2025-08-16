import "server-only";

import { appConfig } from "@microboat/web/config";
import { cookies } from "next/headers";
import type { Locale } from "next-intl";

export async function getUserLocale() {
	const cookie = (await cookies()).get(appConfig.i18n.localeCookieName);
	return cookie?.value ?? appConfig.i18n.defaultLocale;
}

export async function setLocaleCookie(locale: Locale) {
	(await cookies()).set(appConfig.i18n.localeCookieName, locale);
}
