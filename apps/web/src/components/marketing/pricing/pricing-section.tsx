"use client";

import { PricingCard } from "@microboat/web/components/marketing/pricing/pricing-card";
import { Tab } from "@microboat/web/components/marketing/pricing/pricing-tab";
import { useTranslations } from "next-intl";
import * as React from "react";
import {PricePlan} from "@microboat/common";

interface PricingSectionProps {
	title: string;
	subtitle: string;
	plans: PricePlan[];
	frequencies: string[];
	yearlyDiscount: number;
}

export function PricingSection({
	title,
	subtitle,
	plans,
	frequencies,
	yearlyDiscount,
}: PricingSectionProps) {
	const t = useTranslations("pricing");
	const [selectedFrequency, setSelectedFrequency] = React.useState(
		frequencies[0],
	);

	const yearlyText = t("frequencies.yearly");

	return (
		<section className="flex flex-col items-center gap-10 my-16 md:my-0">
			<div className="space-y-7 text-center">
				<div className="space-y-4">
					<h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
					<p className="text-muted-foreground">{subtitle}</p>
				</div>
				<div className="mx-auto flex w-fit rounded-full bg-muted p-1">
					{frequencies.map((freq) => (
						<Tab
							key={freq}
							text={freq}
							selected={selectedFrequency === freq}
							setSelected={setSelectedFrequency}
							discount={freq === yearlyText}
							discountValue={yearlyDiscount}
						/>
					))}
				</div>
			</div>

			<div className="grid w-full max-w-6xl gap-6 px-4 md:px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
				{plans.map((plan, index) => (
					<PricingCard
						key={`${plan.id}-${index}`}
						plan={plan}
						paymentFrequency={selectedFrequency}
					/>
				))}
			</div>
		</section>
	);
}
