"use client";

import NumberFlow from "@number-flow/react";
import { ArrowRight, BadgeCheck, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@microboat/web/components/ui/badge";
import { Button } from "@microboat/web/components/ui/button";
import { Card } from "@microboat/web/components/ui/card";
import { appConfig } from "@microboat/web/config";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { getBaseUrl } from "@microboat/web/lib/urls";
import { cn } from "@microboat/web/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {PlanInterval, PricePlan} from "@microboat/common";
import {createCheckoutLink} from "@microboat/payment";

interface PricingCardProps {
	plan: PricePlan;
	paymentFrequency: string;
}

export function PricingCard({ plan, paymentFrequency }: PricingCardProps) {
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations("pricing");
	const monthlyText = t("frequencies.monthly");
	const yearlyText = t("frequencies.yearly");
	const { user } = useSession();
	const router = useRouter();

	// @ts-expect-error - Affonso is not typed
	const referralId = typeof window !== "undefined" ? window.affonso_referral : null;

	const handleCheckout = async () => {
		try {
			setIsLoading(true);
			if (!user) {
				router.push("/auth/login?redirectTo=/pricing");
				return;
			}
			if (plan.isFree) {
				router.push("/app/dashboard");
				return;
			}

			if (plan.isEnterprise) {
				router.push("/contact");
				return;
			}

			if (user?.customerId) {
				router.push("/app/settings/billing");
				return;
			}

			const targetPrice = getPriceByInterval();

			if (!targetPrice) {
				throw new Error("No price found");
			}

			const redirectUrl = appConfig.payment.redirectAfterCheckout
				? getBaseUrl() + appConfig.payment.redirectAfterCheckout
				: window.location.href;

			console.log("checkout with referralId:", referralId);

			// Create checkout session using server action
			const result = await createCheckoutLink({
				type: targetPrice.type,
				priceId: targetPrice.priceId,
				redirectUrl,
				referralId,
			});

			if (result?.validationErrors) {
				console.error("validationErrors", result.validationErrors);
			}

			if (result?.data) {
				window.location.href = result.data;
			}
		} catch (error) {
			if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
				return;
			}

			console.error("Create checkout link error:", error);
			toast.error(t("checkout.failed"));
		} finally {
			setIsLoading(false);
		}
	};

	const getPriceByInterval = () => {
		if (plan.isLifetime) {
			return plan.prices?.[0];
		}

		const intervalMap = {
			[monthlyText]: PlanInterval.MONTH,
			[yearlyText]: PlanInterval.YEAR,
		};

		const targetInterval = intervalMap[paymentFrequency];
		return plan.prices?.find((price) => price.interval === targetInterval);
	};

	const getCurrentPrice = () => {
		if (plan.isFree) {
			return t("pricingFree");
		}
		if (plan.isEnterprise) {
			return t("pricingEnterprise");
		}
		if (plan.isLifetime) {
			return plan.prices?.[0]?.amount;
		}

		const targetPrice = getPriceByInterval();

		return targetPrice?.amount ?? plan.prices?.[0]?.amount;
	};

	const getCtaText = useCallback(() => {
		if (plan.isFree) {
			return t("ctaFree");
		}

		if (plan.isEnterprise) {
			return t("ctaContact");
		}

		if (user?.customerId) {
			return t("ctaManage");
		}

		const targetPrice = getPriceByInterval();
		if (targetPrice?.trialPeriodDays) {
			return t("ctaWithTrial", { days: targetPrice.trialPeriodDays });
		}

		return t("cta");
	}, [paymentFrequency, monthlyText, yearlyText, user]);

	const price = getCurrentPrice();
	const cta = useMemo(() => getCtaText(), [getCtaText]);
	const isHighlighted = plan.highlighted;
	const isPopular = plan.popular;
	const currency = appConfig.payment.currency;

	return (
		<Card
			className={cn(
				"relative flex flex-col gap-8 overflow-hidden p-6 md:min-w-[220px]",
				isHighlighted
					? "bg-foreground text-background"
					: "bg-background text-foreground",
				isPopular && "ring-2 ring-primary",
			)}
		>
			{isHighlighted && <HighlightedBackground />}
			{isPopular && <PopularBackground />}

			<h2 className="flex items-center gap-3 text-xl font-bold capitalize">
				{plan.name}
				{isPopular && (
					<Badge variant="secondary" className="mt-1 z-10">
						🔥 {t("popularBadge")}
					</Badge>
				)}
			</h2>

			<div className="relative h-12">
				{typeof price === "number" ? (
					<>
						<NumberFlow
							format={{
								style: "currency",
								currency: currency,
								trailingZeroDisplay: "stripIfInteger",
							}}
							value={price}
							className="text-4xl font-medium"
						/>
						{plan.description && (
							<p className="-mt-2 text-xs text-muted-foreground">
								{plan.description}
							</p>
						)}
					</>
				) : (
					<h2 className="text-4xl font-medium">{price}</h2>
				)}
			</div>

			<div className="flex-1 space-y-2">
				<h3 className="text-sm font-medium">{plan.description}</h3>
				<ul className="space-y-2">
					{plan.features?.map((feature, index) => (
						<li
							key={index}
							className={cn(
								"flex items-center gap-2 text-sm font-medium",
								isHighlighted ? "text-background" : "text-muted-foreground",
							)}
						>
							<BadgeCheck className="h-4 w-4" />
							{feature}
						</li>
					))}
				</ul>
			</div>

			<Button
				variant={isHighlighted ? "secondary" : "default"}
				className="w-full cursor-pointer font-bold"
				onClick={handleCheckout}
				disabled={isLoading}
			>
				{isLoading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<>
						{cta}
						<ArrowRight className="ml-2 h-4 w-4" />
					</>
				)}
			</Button>
		</Card>
	);
}

const HighlightedBackground = () => (
	<div className="absolute inset-0 pointer-events-none" />
);

const PopularBackground = () => (
	<div className="absolute inset-0 pointer-events-none" />
);
