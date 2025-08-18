import { appConfigService } from "@microboat/web/config/app-config-service";
import { routing } from "@microboat/web/i18n/routing";
import { getBaseUrl } from "@microboat/web/lib/urls";
import type { MetadataRoute } from "next";

/**
 * Static routes for sitemap (excluding auth routes)
 * You can modify these routes based on your project structure
 */
const staticRoutes = [
	// Marketing pages
	"/",
	"/pricing",
	"/contact",
	"/changelog",
	"/blog",
	"/docs",

	// Legal pages
	"/legal/privacy-policy",
	"/legal/terms-of-service",

	// App pages (if publicly accessible)
	// '/app/dashboard',
	// '/app/settings',
];

/**
 * Auth routes - these don't have locale prefixes
 */
const authRoutes = [
	"/auth/login",
	"/auth/signup",
	"/auth/forgot-password",
	"/auth/reset-password",
];

/**
 * Generate a sitemap for the website
 *
 * @returns {Promise<MetadataRoute.Sitemap>} The sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const sitemapList: MetadataRoute.Sitemap = [];
	const baseUrl = getBaseUrl();

	// Add auth routes without locale prefixes
	sitemapList.push(
		...authRoutes.map((route) => ({
			url: `${baseUrl}${route}`,
			lastModified: new Date(),
			priority: 0.8,
			changeFrequency: "weekly" as const,
		})),
	);

	// Add static routes for all locales
	sitemapList.push(
		...staticRoutes.flatMap((route) => {
			if (appConfigService.getI18n().enabled) {
				return routing.locales.map((locale) => {
					// For default locale (en), don't add prefix
					if (locale === appConfigService.getI18n().defaultLocale) {
						return {
							url: `${baseUrl}${route}`,
							lastModified: new Date(),
							priority: route === "/" ? 1.0 : 0.8,
							changeFrequency: "weekly" as const,
						};
					}

					// For other locales, add prefix
					return {
						url: `${baseUrl}/${locale}${route}`,
						lastModified: new Date(),
						priority: route === "/" ? 1.0 : 0.8,
						changeFrequency: "weekly" as const,
					};
				});
			}

			return [
				{
					url: `${baseUrl}${route}`,
					lastModified: new Date(),
					priority: route === "/" ? 1.0 : 0.8,
					changeFrequency: "weekly" as const,
				},
			];
		}),
	);

	// Remove duplicates and invalid URLs
	const uniqueUrls = new Set();
	const cleanedSitemap = sitemapList.filter((item) => {
		if (!item.url || uniqueUrls.has(item.url)) {
			return false;
		}
		uniqueUrls.add(item.url);
		return true;
	});

	return cleanedSitemap;
}
