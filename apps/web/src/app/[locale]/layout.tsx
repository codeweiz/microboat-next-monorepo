import { AppProviders } from "@microboat/web/components/shared/providers";
import { routing } from "@microboat/web/i18n/routing";
import { metadata } from "@microboat/web/lib/metadata";
import type { Metadata } from "next";
import { type Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app.metadata" });

	return metadata({
		title: {
			template: `%s | ${t("title")}`,
			default: t("title") || "",
		},
		description: t("description"),
	});
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: Locale }>;
}>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<AppProviders locale={locale}>
			<NextIntlClientProvider>{children}</NextIntlClientProvider>
		</AppProviders>
	);
}
