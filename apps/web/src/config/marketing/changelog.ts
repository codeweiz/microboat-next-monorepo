import { getTranslations } from "next-intl/server";

export interface ChangelogEntry {
	version: string;
	date: string;
	title: string;
	description: string;
	items?: string[];
	image?: string;
	button?: {
		url: string;
		text: string;
	};
}

export interface ChangelogConfig {
	title: string;
	description: string;
	entries: ChangelogEntry[];
}

export async function getChangelogConfig(): Promise<ChangelogConfig> {
	const t = await getTranslations("changelog");

	const entries: ChangelogEntry[] = [
		{
			version: t("entries.v1_3_0.version"),
			date: t("entries.v1_3_0.date"),
			title: t("entries.v1_3_0.title"),
			description: t("entries.v1_3_0.description"),
			items: [t("entries.v1_3_0.items.item1"), t("entries.v1_3_0.items.item2")],
		},
		{
			version: t("entries.v1_2_0.version"),
			date: t("entries.v1_2_0.date"),
			title: t("entries.v1_2_0.title"),
			description: t("entries.v1_2_0.description"),
			items: [t("entries.v1_2_0.items.item1"), t("entries.v1_2_0.items.item2")],
		},
		{
			version: t("entries.v1_0_0.version"),
			date: t("entries.v1_0_0.date"),
			title: t("entries.v1_0_0.title"),
			description: t("entries.v1_0_0.description"),
			image: "/marketing/feature-techstacks.png",
			button: {
				url: "https://nextdevkit.com/en/blog/build-nextjs-template",
				text: t("button.text"),
			},
		},
	];

	return {
		title: t("title"),
		description: t("description"),
		entries,
	};
}
