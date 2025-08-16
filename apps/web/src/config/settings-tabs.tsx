import { Bell, CreditCard, Lock, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function getSettingsTabsConfig(): SettingsTabsConfig {
	const t = useTranslations("settings.tabs");

	const settingsTabs: SettingsTabItem[] = [
		{
			value: "account",
			label: t("account"),
			icon: User,
			href: "/app/settings/account",
		},
		{
			value: "security",
			label: t("security"),
			icon: Lock,
			href: "/app/settings/security",
		},
		{
			value: "billing",
			label: t("billing"),
			icon: CreditCard,
			href: "/app/settings/billing",
		},
		{
			value: "notification",
			label: t("notification"),
			icon: Bell,
			href: "/app/settings/notification",
		},
	];

	return {
		heading: t("heading"),
		description: t("description"),
		tabs: settingsTabs,
	};
}

export interface SettingsTabItem {
	value: string;
	label: string;
	icon: LucideIcon;
	href: string;
}

export interface SettingsTabsConfig {
	heading: string;
	description: string;
	tabs: SettingsTabItem[];
}
