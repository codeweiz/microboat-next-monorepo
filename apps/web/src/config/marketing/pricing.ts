import { appConfig } from "@microboat/web/config";
import { getTranslations } from "next-intl/server";
import {Price, PricePlan} from "@microboat/common";

export interface PricingConfig {
	title: string;
	subtitle: string;
	frequencies: string[];
	yearlyDiscount: number;
	plans: PricePlan[];
}

export async function getPricingConfig(): Promise<PricingConfig> {
	const t = await getTranslations("pricing");
	const priceConfig = appConfig.payment;
	const plans: PricePlan[] = [];
	const frequencies = [t("frequencies.monthly"), t("frequencies.yearly")];

	if (priceConfig.plans.free) {
		plans.push({
			...priceConfig.plans.free,
			name: t("products.free.title"),
			description: t("products.free.description"),
			features: [
				t("products.free.features.feature1"),
				t("products.free.features.feature2"),
				t("products.free.features.feature3"),
			],
		});
	}

	if (priceConfig.plans.pro) {
		plans.push({
			...priceConfig.plans.pro,
			name: t("products.pro.title"),
			description: t("products.pro.description"),
			features: [
				t("products.pro.features.feature1"),
				t("products.pro.features.feature2"),
				t("products.pro.features.feature3"),
				t("products.pro.features.feature4"),
			],
		});
	}

	if (priceConfig.plans.lifetime) {
		plans.push({
			...priceConfig.plans.lifetime,
			name: t("products.lifetime.title"),
			description: t("products.lifetime.description"),
			features: [
				t("products.lifetime.features.feature1"),
				t("products.lifetime.features.feature2"),
				t("products.lifetime.features.feature3"),
			],
		});
	}

	if (priceConfig.plans.enterprise) {
		plans.push({
			...priceConfig.plans.enterprise,
			name: t("products.enterprise.title"),
			description: t("products.enterprise.description"),
			features: [
				t("products.enterprise.features.feature1"),
				t("products.enterprise.features.feature2"),
				t("products.enterprise.features.feature3"),
				t("products.enterprise.features.feature4"),
				t("products.enterprise.features.feature5"),
			],
		});
	}

	return {
		title: t("title"),
		subtitle: t("subtitle"),
		frequencies,
		yearlyDiscount: priceConfig.yearlyDiscount,
		plans,
	};
}

export function getPriceByPriceId(priceId: string): Price | null {
	for (const planKey in appConfig.payment.plans) {
		const plan = appConfig.payment.plans[planKey];

		if (plan.prices && Array.isArray(plan.prices)) {
			const foundPrice = plan.prices.find((price) => price.priceId === priceId);
			if (foundPrice) {
				return foundPrice;
			}
		}
	}
	return null;
}

export async function getPricePlanByPriceId(
	priceId: string,
): Promise<PricePlan | null> {
	const { plans } = await getPricingConfig();
	for (const plan of plans) {
		if (plan.prices && Array.isArray(plan.prices)) {
			const foundPrice = plan.prices.find((price) => price.priceId === priceId);
			if (foundPrice) {
				return plan;
			}
		}
	}
	return null;
}
