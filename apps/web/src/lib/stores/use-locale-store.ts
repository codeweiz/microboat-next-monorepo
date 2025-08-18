import { appConfigService } from "@microboat/web/config/app-config-service";
import type { Locale } from "next-intl";
import { create } from "zustand";

interface LocaleState {
	currentLocale: Locale;
	setCurrentLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
	currentLocale: appConfigService.getI18n().defaultLocale as Locale,
	setCurrentLocale: (locale) =>
		set(() => ({
			currentLocale: locale,
		})),
}));
