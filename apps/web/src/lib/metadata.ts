import { appConfigService } from "@microboat/web/config/app-config-service";
import { getBaseUrl } from "@microboat/web/lib/urls";
import type { Metadata } from "next";

export function metadata({
	title,
	description,
	image,
	canonicalUrl,
	keywords,
}: {
	title?: string | { template: string; default: string };
	description?: string;
	image?: string;
	canonicalUrl?: string;
	keywords?: string[];
} = {}): Metadata {
	title = title || appConfigService.getMetadata().title;
	description = description || appConfigService.getMetadata().description;
	image = image || appConfigService.getMetadata().images?.ogImage;
	keywords = keywords || appConfigService.getMetadata().keywords;
	const ogImageUrl = image.startsWith("/")
		? new URL(`${getBaseUrl()}${image}`)
		: new URL(image);
	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl || "./",
		},
		keywords,
		openGraph: {
			type: "website",
			locale: "en_US",
			url: canonicalUrl || getBaseUrl(),
			title,
			description,
			siteName: appConfigService.getMetadata().title,
			images: [ogImageUrl.toString()],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImageUrl.toString()],
			site: getBaseUrl(),
		},
		icons: [
			{
				rel: "icon",
				url: "/favicon-96x96.png",
				sizes: "96x96",
				type: "image/png",
			},
			{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "shortcut icon", url: "/favicon.ico" },
			{
				rel: "apple-touch-icon",
				url: "/apple-touch-icon.png",
				sizes: "180x180",
			},
		],
		metadataBase: new URL(getBaseUrl()),
	};
}
