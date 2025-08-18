import AffonsoScript from "@microboat/web/components/marketing/affiliate/affonso";
import { ApiClientProvider } from "@microboat/web/components/shared/api-client-provider";
import CookieConsentComponent from "@microboat/web/components/shared/cookie/cookie-consent";
import { SessionProvider } from "@microboat/web/components/shared/session-provider";
import { Toaster } from "@microboat/web/components/ui/sonner";
import { ConfigProvider } from "@microboat/common";
import { appConfig } from "@microboat/web/config";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function AppProviders({
	children,
	locale,
}: PropsWithChildren<{ locale: string }>) {
	const defaultMode = appConfig.ui.theme.defaultMode;

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen overflow-x-hidden`}
			>
				<ConfigProvider config={appConfig}>
					<AffonsoScript />
					<ThemeProvider
						defaultTheme={defaultMode}
						attribute="class"
						enableSystem
						disableTransitionOnChange
					>
						<ApiClientProvider>
							<SessionProvider>{children}</SessionProvider>
						</ApiClientProvider>
						<Toaster richColors position="top-right" offset={64} />
					</ThemeProvider>
				</ConfigProvider>
			</body>
			<CookieConsentComponent />
		</html>
	);
}
