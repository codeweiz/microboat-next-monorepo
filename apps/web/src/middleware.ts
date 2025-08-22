import { appConfigService } from "@microboat/web/config/app-config-service";
import { getSession } from "@microboat/web/lib/auth/edge";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { withQuery } from "ufo";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl;

	if (pathname.startsWith("/app")) {
		const response = NextResponse.next();
		const session = await getSession(req);

		if (!session) {
			return NextResponse.redirect(
				new URL(
					withQuery("/auth/login", {
						redirectTo: pathname,
					}),
					origin,
				),
			);
		}

		let locale = req.cookies.get(appConfigService.getI18n().localeCookieName)?.value;

		if (!locale || (session.user.locale && locale !== session.user.locale)) {
			locale = session.user.locale ?? appConfigService.getI18n().defaultLocale;
			response.cookies.set(appConfigService.getI18n().localeCookieName, locale);
		}

		return response;
	}

	if (pathname.startsWith("/auth")) {
		const session = await getSession(req);

		if (session && pathname !== "/auth/reset-password") {
			return NextResponse.redirect(
				new URL(appConfigService.getAuth().redirectAfterSignIn, origin),
			);
		}

		return NextResponse.next();
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: [
		"/((?!api|images|image-proxy|fonts|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.ico).*)",
	],
};
