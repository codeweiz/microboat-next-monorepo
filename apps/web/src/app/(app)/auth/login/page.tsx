import { LoginForm } from "@microboat/web/components/auth/login-form";
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
	const t = await getTranslations({
		locale,
		namespace: "auth.login",
	});

	return metadata({
		title: t("title"),
		description: t("subtitle"),
	});
}

export default function SignInPage() {
	return <LoginForm />;
}
