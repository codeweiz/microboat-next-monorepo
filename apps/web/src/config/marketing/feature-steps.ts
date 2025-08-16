import { useTranslations } from "next-intl";

export function getFeatureStepsConfig(): FeatureStepsConfig {
	const t = useTranslations("featureSection.steps");

	const featureSteps: FeatureStepItem[] = [
		{
			step: t("items.step-1.step"),
			title: t("items.step-1.title"),
			content: t("items.step-1.content"),
			image: "/marketing/github-clone.png",
		},
		{
			step: t("items.step-2.step"),
			title: t("items.step-2.title"),
			content: t("items.step-2.content"),
			image: "/marketing/nextdevkit-configuration.png",
		},
		{
			step: t("items.step-3.step"),
			title: t("items.step-3.title"),
			content: t("items.step-3.content"),
			image: "/marketing/cloudflare-worker-bingding.png",
		},
	];

	return {
		title: t("title"),
		steps: featureSteps,
	};
}

export interface FeatureStepItem {
	step: string;
	title: string;
	content: string;
	image: string;
}

export interface FeatureStepsConfig {
	title: string;
	steps: FeatureStepItem[];
}
