"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@microboat/web/components/ui/select";
import { appConfig } from "@microboat/web/config";
import { switchLocale } from "@microboat/web/i18n/lib/update-locale";
import { usePathname } from "@microboat/web/i18n/navigation";
import { useMounted } from "@microboat/web/lib/hooks/use-mounted";
import { useLocaleStore } from "@microboat/web/lib/stores/use-locale-store";
import { Languages } from "lucide-react";
import { type Locale, useLocale } from "next-intl";
import { useEffect, useId, useTransition } from "react";

function LocaleSwitcher() {
	const id = useId();
	const isEnabled = appConfig.i18n.enabled;
	const mounted = useMounted();

	if (!isEnabled) {
		return null;
	}

	const pathname = usePathname();
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();
	const { currentLocale, setCurrentLocale } = useLocaleStore();

	useEffect(() => {
		if (locale !== currentLocale) {
			setCurrentLocale(locale);
		}
	}, [locale, currentLocale, setCurrentLocale]);

	const handleLocaleChange = async (newLocale: Locale) => {
		if (newLocale === currentLocale) {
			return;
		}

		startTransition(async () => {
			try {
				// Update the store immediately for UI feedback
				setCurrentLocale(newLocale);

				// Use server action to set cookie and redirect
				await switchLocale(newLocale, pathname);
			} catch (error) {
				console.error("Failed to update locale:", error);
				// Revert the store state if server action fails
				setCurrentLocale(currentLocale);
			}
		});
	};

	// Prevent hydration mismatch by not rendering locale-dependent content until mounted
	if (!mounted) {
		return (
			<div className="">
				<Select disabled>
					<SelectTrigger
						id={id}
						className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 cursor-pointer"
					>
						<SelectValue placeholder="Select language">
							<span className="flex items-center gap-2">
								<Languages />
								<span className="truncate">Loading...</span>
							</span>
						</SelectValue>
					</SelectTrigger>
				</Select>
			</div>
		);
	}

	return (
		<div className="">
			<Select
				value={currentLocale}
				onValueChange={(value) => handleLocaleChange(value as Locale)}
				disabled={isPending}
			>
				<SelectTrigger id={id} className="cursor-pointer">
					<SelectValue
						placeholder="Select language"
						aria-label="Select language"
					>
						<span className="flex items-center gap-2">
							<Languages />
							<span className="truncate">
								{appConfig.i18n.locales[currentLocale]?.name}
							</span>
						</span>
					</SelectValue>
				</SelectTrigger>
				<SelectContent className="cursor-pointer">
					{Object.entries(appConfig.i18n.locales).map(
						([localeKey, { name }]) => (
							<SelectItem key={localeKey} value={localeKey}>
								<span className="flex items-center gap-2">
									<span className="truncate">{name}</span>
								</span>
							</SelectItem>
						),
					)}
				</SelectContent>
			</Select>
		</div>
	);
}

export { LocaleSwitcher };
