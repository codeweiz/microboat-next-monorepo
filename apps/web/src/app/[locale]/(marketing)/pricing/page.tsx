import { Faq } from "@microboat/web/components/marketing/faq";
import { Pricing } from "@microboat/web/components/marketing/pricing";
import { Testimonials } from "@microboat/web/components/marketing/testimonials";
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
	const t = await getTranslations({ locale, namespace: "pricing" });

	return metadata({
		title: t("title"),
		description: t("subtitle"),
	});
}

export default function PricingPage() {
	return (
		<div className="overflow-x-hidden">
			<Pricing />
			<Testimonials />
			<Faq />
		</div>
	);
}
