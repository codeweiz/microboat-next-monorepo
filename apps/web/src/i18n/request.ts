import { appConfigService } from "@microboat/web/config/app-config-service";
import { getUserLocale } from "@microboat/web/i18n/lib/locale-cookie";
import { getMessagesForLocale } from "@microboat/web/i18n/messages";
import { routing } from "@microboat/web/i18n/routing";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	let requested = await requestLocale;
	if (!requested) {
		requested = await getUserLocale();
	}

	if (!(routing.locales.includes(requested) && appConfigService.getI18n().enabled)) {
		requested = routing.defaultLocale;
	}

	return {
		locale: requested,
		messages: await getMessagesForLocale(requested),
	};
});
