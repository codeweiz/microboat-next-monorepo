import { PricingSection } from "@microboat/web/components/marketing/pricing/pricing-section";
import { getPricingConfig } from "@microboat/web/config/marketing/pricing";

export async function Pricing() {
	const { title, subtitle, frequencies, plans, yearlyDiscount } =
		await getPricingConfig();

	return (
		<div
			id="pricing"
			className="relative flex justify-center items-center w-full max-w-7xl mx-auto scale-110"
		>
			<PricingSection
				title={title}
				subtitle={subtitle}
				frequencies={frequencies}
				plans={plans}
				yearlyDiscount={yearlyDiscount}
			/>
		</div>
	);
}
