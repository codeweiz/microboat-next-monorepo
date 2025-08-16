import { useTranslations } from "next-intl";

export interface TestimonialAuthor {
	name: string;
	handle: string;
	avatar: string;
}

export interface TestimonialItem {
	author: TestimonialAuthor;
	text: string;
	href?: string;
}

export interface TestimonialsConfig {
	title: string;
	description: string;
	testimonials: TestimonialItem[];
}

export function getTestimonialsConfig(): TestimonialsConfig {
	const t = useTranslations("testimonials");

	const testimonials: TestimonialItem[] = [
		{
			author: {
				name: t("items.testimonial-1.author.name"),
				handle: t("items.testimonial-1.author.handle"),
				avatar:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
			},
			text: t("items.testimonial-1.text"),
			href: "https://twitter.com/emmaai",
		},
		{
			author: {
				name: t("items.testimonial-2.author.name"),
				handle: t("items.testimonial-2.author.handle"),
				avatar:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			},
			text: t("items.testimonial-2.text"),
			href: "https://twitter.com/davidtech",
		},
		{
			author: {
				name: t("items.testimonial-3.author.name"),
				handle: t("items.testimonial-3.author.handle"),
				avatar:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
			},
			text: t("items.testimonial-3.text"),
		},
	];

	return {
		title: t("title"),
		description: t("description"),
		testimonials,
	};
}
