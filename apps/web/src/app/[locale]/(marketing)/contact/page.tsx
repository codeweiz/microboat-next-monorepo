import { ContactForm } from "@microboat/web/components/marketing/contact/contact-form";
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
	const t = await getTranslations({ locale, namespace: "contact" });

	return metadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords")?.split(",") || [],
	});
}

export default function ContactPage() {
	return (
		<div className="overflow-x-hidden">
			<ContactForm />
		</div>
	);
}
