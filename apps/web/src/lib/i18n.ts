import {appConfig} from "@microboat/web/config";
import {parse as parseCookies} from "cookie";
import type {Locale} from "next-intl";

export const getLocaleFromRequest = (request?: Request): Locale => {
    const cookies = parseCookies(request?.headers.get("cookie") ?? "");
    return (
        (cookies[appConfig.i18n.localeCookieName] as Locale) ??
        appConfig.i18n.defaultLocale as Locale
    );
};
