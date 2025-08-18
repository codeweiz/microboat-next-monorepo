import {appConfigService} from "@microboat/web/config/app-config-service";
import {parse as parseCookies} from "cookie";
import type {Locale} from "next-intl";

export const getLocaleFromRequest = (request?: Request): Locale => {
    const cookies = parseCookies(request?.headers.get("cookie") ?? "");
    return (
        (cookies[appConfigService.getI18n().localeCookieName] as Locale) ??
        appConfigService.getI18n().defaultLocale as Locale
    );
};
