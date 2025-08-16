import { appConfig } from "@microboat/web/config";
import type { Locale } from "next-intl";
import { create } from "zustand";

interface LocaleState {
	currentLocale: Locale;
	setCurrentLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
	currentLocale: appConfig.i18n.defaultLocale as Locale,
	setCurrentLocale: (locale) =>
		set(() => ({
			currentLocale: locale,
		})),
}));
