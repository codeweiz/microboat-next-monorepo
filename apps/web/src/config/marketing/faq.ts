import { useTranslations } from "next-intl";

export interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

export interface FaqConfig {
	heading: string;
	description: string;
	items: FaqItem[];
	supportHeading: string;
	supportDescription: string;
	supportButtonText: string;
	supportButtonUrl: string;
	avatars: {
		src: string;
		alt: string;
	}[];
}

export function getFaqConfig(): FaqConfig {
	const t = useTranslations("faq");

	const faqItems: FaqItem[] = [
		{
			id: t("items.faq-1.id"),
			question: t("items.faq-1.question"),
			answer: t("items.faq-1.answer"),
		},
		{
			id: t("items.faq-2.id"),
			question: t("items.faq-2.question"),
			answer: t("items.faq-2.answer"),
		},
		{
			id: t("items.faq-3.id"),
			question: t("items.faq-3.question"),
			answer: t("items.faq-3.answer"),
		},
		{
			id: t("items.faq-4.id"),
			question: t("items.faq-4.question"),
			answer: t("items.faq-4.answer"),
		},
		{
			id: t("items.faq-5.id"),
			question: t("items.faq-5.question"),
			answer: t("items.faq-5.answer"),
		},
		{
			id: t("items.faq-6.id"),
			question: t("items.faq-6.question"),
			answer: t("items.faq-6.answer"),
		},
	];

	return {
		heading: t("heading"),
		description: t("description"),
		items: faqItems,
		avatars: [
			{
				src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
				alt: "Avatar 1",
			},
			{
				src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
				alt: "Avatar 2",
			},
			{
				src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
				alt: "Avatar 3",
			},
		],
		supportHeading: t("supportHeading"),
		supportDescription: t("supportDescription"),
		supportButtonText: t("supportButtonText"),
		supportButtonUrl: "/contact",
	};
}
