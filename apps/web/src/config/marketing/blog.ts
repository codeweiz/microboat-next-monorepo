import { getTranslations } from "next-intl/server";

export interface BlogConfig {
	title: string;
	description: string;
	placeholderImage: string;
}

export async function getBlogConfig(): Promise<BlogConfig> {
	const t = await getTranslations("blog");

	return {
		title: t("title"),
		description: t("description"),
		placeholderImage:
			"/marketing/feature-techstacks.png",
	};
}
