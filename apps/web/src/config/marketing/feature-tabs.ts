import { Layout, Pointer, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function getFeatureTabsConfig(): FeatureTabsConfig {
	const t = useTranslations("featureSection.tabs");

	const featureTabs: FeatureTabItem[] = [
		{
			value: "tab-1",
			label: t("items.tab-1.label"),
			icon: Zap,
			content: {
				badge: t("items.tab-1.content.badge"),
				title: t("items.tab-1.content.title"),
				description: t("items.tab-1.content.description"),
				buttonText: t("items.tab-1.content.buttonText"),
				imageSrc: "/marketing/feature-themes.png",
				imageAlt: "Customize themes with minimal code changes",
				link: "/docs/themes",
			},
		},
		{
			value: "tab-2",
			label: t("items.tab-2.label"),
			icon: Pointer,
			content: {
				badge: t("items.tab-2.content.badge"),
				title: t("items.tab-2.content.title"),
				description: t("items.tab-2.content.description"),
				buttonText: t("items.tab-2.content.buttonText"),
				imageSrc: "/marketing/feature-deploy.webp",
				imageAlt: "Deploy to any platform vercel, cloudflare, aws, natively",
				link: "/docs/deployments",
			},
		},
		{
			value: "tab-3",
			label: t("items.tab-3.label"),
			icon: Layout,
			content: {
				badge: t("items.tab-3.content.badge"),
				title: t("items.tab-3.content.title"),
				description: t("items.tab-3.content.description"),
				buttonText: t("items.tab-3.content.buttonText"),
				imageSrc: "/marketing/feature-techstacks.png",
				imageAlt: "Built with modern Next.js stack, shadcn ui, drizzle orm",
				link: "/docs/tech-stack",
			},
		},
	];

	return {
		heading: t("heading"),
		description: t("description"),
		tabs: featureTabs,
	};
}

export interface FeatureTabItem {
	value: string;
	label: string;
	icon: LucideIcon;
	content: {
		badge: string;
		title: string;
		description: string;
		buttonText: string;
		imageSrc: string;
		imageAlt: string; 
		link: string;
	};
}

export interface FeatureTabsConfig {
	heading: string;
	description: string;
	tabs: FeatureTabItem[];
}
