import deepmerge from "deepmerge";
import type { Locale, Messages } from "next-intl";
import { routing } from "@microboat/web/i18n/routing";
import { appConfigService } from "@microboat/web/config/app-config-service";

const importLocale = async (locale: Locale): Promise<Messages> => {
	return (await import(`../../messages/${locale}.json`)).default as Messages;
};

export const getMessagesForLocale = async (
	locale: Locale,
): Promise<Messages> => {
	const localeMessages = await importLocale(locale);
	if (locale === routing.defaultLocale) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(appConfigService.getI18n().defaultLocale);
	return deepmerge(defaultLocaleMessages, localeMessages);
};

export const getDefaultMessages = async (): Promise<Messages> => {
	return await getMessagesForLocale(appConfigService.getI18n().defaultLocale);
};
