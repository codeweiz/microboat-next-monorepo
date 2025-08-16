import { Faq } from "@microboat/web/components/marketing/faq";
import { FeatureSection } from "@microboat/web/components/marketing/feature-section";
import { HeroSection } from "@microboat/web/components/marketing/hero-section";
import { Pricing } from "@microboat/web/components/marketing/pricing";
import { Testimonials } from "@microboat/web/components/marketing/testimonials";

export default function Home() {
	return (
		<div className="overflow-x-hidden">
			<HeroSection />
			<FeatureSection />
			<Pricing />
			<Testimonials />
			<Faq />
		</div>
	);
}
