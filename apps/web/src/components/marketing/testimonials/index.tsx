import { TestimonialsSection } from "@microboat/web/components/marketing/testimonials/testimonials-with-marquee";
import { getTestimonialsConfig } from "@microboat/web/config/marketing/testimonials";

export function Testimonials() {
	const { title, description, testimonials } = getTestimonialsConfig();

	return (
		<TestimonialsSection
			id="testimonials"
			title={title}
			description={description}
			testimonials={testimonials}
		/>
	);
}
