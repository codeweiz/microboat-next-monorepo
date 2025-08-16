import { useTranslations } from "next-intl";

export interface HeroSectionConfig {
	badge: string;
	badgeText: string;
	heading: string;
	highlightHeading: string;
	subHeading: string;
	animatedTooltipTitle: string;
	buttons: {
		getStarted: string;
		seeDemo: string;
	};
	images: {
		dark: {
			src: string;
			alt: string;
			width: number;
			height: number;
		};
		light: {
			src: string;
			alt: string;
			width: number;
			height: number;
		};
	};
	links: {
		badge: string;
		getStarted: string;
		seeDemo: string;
	};
}

export function getHeroSectionConfig(): HeroSectionConfig {
	const t = useTranslations("hero");

	return {
		badge: t("badge"),
		badgeText: t("badgeText"),
		heading: t("heading"),
		highlightHeading: t("highlightHeading"),
		subHeading: t("subHeading"),
		animatedTooltipTitle: t("AnimatedTooltipTitle"),
		buttons: {
			getStarted: t("buttons.getStarted"),
			seeDemo: t("buttons.seeDemo"),
		},
		images: {
			dark: {
				src: "/marketing/hero-section-dark.webp",
				alt: "app screen",
				width: 3812,
				height: 1842,
			},
			light: {
				src: "/marketing/hero-section-light.webp",
				alt: "app screen",
				width: 3812,
				height: 1842,
			},
		},
		links: {
			badge: "/blog",
			getStarted: "/#pricing",
			seeDemo: "/",
		},
	};
}

export const transitionVariants = {
	item: {
		hidden: {
			opacity: 0,
			filter: "blur(12px)",
			y: 12,
		},
		visible: {
			opacity: 1,
			filter: "blur(0px)",
			y: 0,
			transition: {
				type: "spring" as const,
				bounce: 0.3,
				duration: 1.5,
			},
		},
	},
};
