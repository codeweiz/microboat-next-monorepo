import { Changelog } from "@microboat/web/components/marketing/changelog";
import { getChangelogConfig } from "@microboat/web/config/marketing/changelog";
import { metadata } from "@microboat/web/lib/metadata";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "changelog" });

	return metadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords")?.split(",") || [],
	});
}

export default async function ChangelogPage() {
	const changelogConfig = await getChangelogConfig();

	return (
		<Changelog
			title={changelogConfig.title}
			description={changelogConfig.description}
			entries={changelogConfig.entries}
		/>
	);
}
