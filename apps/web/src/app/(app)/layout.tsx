import { AppProviders } from "@microboat/web/components/shared/providers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<AppProviders locale={locale}>
			<NextIntlClientProvider messages={messages}>
				{children}
			</NextIntlClientProvider>
		</AppProviders>
	);
}
