import {
	Box,
	Cpu,
	Eye,
	Globe,
	Palette,
	Rocket,
	Search,
	Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function getNavItems(): NavItem[] {
	const t = useTranslations("navigation");

	return [
		{
			id: 1,
			label: t("products.label"),
			subMenus: [
				{
					title: t("products.dxPlatform.title"),
					items: [
						{
							label: t("products.dxPlatform.previews.label"),
							description: t("products.dxPlatform.previews.description"),
							icon: Cpu,
							link: "/products/previews",
						},
						{
							label: t("products.dxPlatform.ai.label"),
							description: t("products.dxPlatform.ai.description"),
							icon: Search,
							link: "/products/ai",
						},
					],
				},
				{
					title: t("products.infrastructure.title"),
					items: [
						{
							label: t("products.infrastructure.rendering.label"),
							description: t("products.infrastructure.rendering.description"),
							icon: Globe,
							link: "/products/rendering",
						},
						{
							label: t("products.infrastructure.observability.label"),
							description: t(
								"products.infrastructure.observability.description",
							),
							icon: Eye,
							link: "/products/observability",
						},
						{
							label: t("products.infrastructure.security.label"),
							description: t("products.infrastructure.security.description"),
							icon: Shield,
							link: "/products/security",
						},
					],
				},
				{
					title: t("products.openSource.title"),
					items: [
						{
							label: t("products.openSource.nextjs.label"),
							description: t("products.openSource.nextjs.description"),
							icon: Rocket,
							link: "/products/nextjs",
						},
						{
							label: t("products.openSource.turborepo.label"),
							description: t("products.openSource.turborepo.description"),
							icon: Box,
							link: "/products/turborepo",
						},
						{
							label: t("products.openSource.aiSdk.label"),
							description: t("products.openSource.aiSdk.description"),
							icon: Palette,
							link: "/products/ai-sdk",
						},
					],
				},
			],
		},
		{
			id: 2,
			label: t("solutions.label"),
			subMenus: [
				{
					title: t("solutions.useCases.title"),
					items: [
						{
							label: t("solutions.useCases.aiApps.label"),
							description: t("solutions.useCases.aiApps.description"),
							icon: Cpu,
							link: "/solutions/ai-apps",
						},
						{
							label: t("solutions.useCases.commerce.label"),
							description: t("solutions.useCases.commerce.description"),
							icon: Box,
							link: "/solutions/commerce",
						},
						{
							label: t("solutions.useCases.marketing.label"),
							description: t("solutions.useCases.marketing.description"),
							icon: Rocket,
							link: "/solutions/marketing",
						},
						{
							label: t("solutions.useCases.multiTenant.label"),
							description: t("solutions.useCases.multiTenant.description"),
							icon: Globe,
							link: "/solutions/multi-tenant",
						},
						{
							label: t("solutions.useCases.webApps.label"),
							description: t("solutions.useCases.webApps.description"),
							icon: Search,
							link: "/solutions/web-apps",
						},
					],
				},
				{
					title: t("solutions.users.title"),
					items: [
						{
							label: t("solutions.users.platformEngineers.label"),
							description: t("solutions.users.platformEngineers.description"),
							icon: Cpu,
							link: "/solutions/platform-engineers",
						},
						{
							label: t("solutions.users.designEngineers.label"),
							description: t("solutions.users.designEngineers.description"),
							icon: Palette,
							link: "/solutions/design-engineers",
						},
					],
				},
			],
		},
		{
			id: 3,
			label: t("blog.label"),
			link: "/blog",
		},
		{
			id: 4,
			label: t("docs.label"),
			link: "/docs",
		},
		{
			id: 5,
			label: t("pricing.label"),
			link: "/#pricing",
		},
	];
}

export interface NavSubItem {
	label: string;
	description: string;
	icon: React.ElementType;
	link: string;
}

export interface NavSubMenu {
	title: string;
	items: NavSubItem[];
}

export interface NavItem {
	id: number;
	label: string;
	link?: string;
	subMenus?: NavSubMenu[];
}
