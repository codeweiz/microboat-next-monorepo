import { FeatureSteps } from "@microboat/web/components/marketing/feature-section/feature-steps";
import { FeatureTabs } from "@microboat/web/components/marketing/feature-section/feature-tabs";

export function FeatureSection() {
	return (
		<section className="bg-background mb-16 pt-16 md:mb-32">
			<div className="px-2">
				<FeatureTabs />
				<FeatureSteps />
			</div>
		</section>
	);
}
