"use client";

import { Badge } from "@microboat/web/components/ui/badge";
import { Button } from "@microboat/web/components/ui/button";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import { usePayment } from "@microboat/web/lib/hooks/use-payment";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { createCustomerPortal } from "@microboat/web/payment/actions";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ManagePaymentForm() {
	const t = useTranslations("settings.billing");
	const { activePlan, subscription, isLoading } = usePayment();
	const { user } = useSession();
	const router = useRouter();
	const [isPortalLoading, setIsPortalLoading] = useState(false);

	const handleUpgrade = () => {
		router.push("/pricing");
	};

	const handleManageBilling = async () => {
		try {
			setIsPortalLoading(true);
			if (!user?.customerId) {
				toast.error("Customer ID not found");
				return;
			}
			const result = await createCustomerPortal({
				customerId: user.customerId,
				redirectUrl: window.location.href,
			});

			if (result?.data) {
				window.location.href = result.data;
			} else {
				toast.error("Failed to create customer portal");
			}
		} catch (error) {
			console.error("Error creating customer portal:", error);
			toast.error("Failed to create customer portal");
		} finally {
			setIsPortalLoading(false);
		}
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) {
			return "";
		}
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getPlanPrice = () => {
		if (!subscription) {
			return null;
		}

		if (activePlan?.prices) {
			const currentPrice = activePlan.prices.find(
				(price) => price.priceId === subscription.priceId,
			);
			if (currentPrice) {
				const intervalText =
					subscription.interval === "month"
						? t("manage.intervals.month")
						: t("manage.intervals.year");
				return `$${currentPrice.amount} ${t("manage.subscription.per")}${intervalText}`;
			}
		}

		return null;
	};

	const getRenewalText = () => {
		if (!subscription?.periodEnd) {
			return "";
		}

		if (subscription.cancelAtPeriodEnd) {
			return `${t("manage.subscription.expiresOn")} ${formatDate(subscription.periodEnd)}`;
		}

		return `${t("manage.subscription.renewsOn")} ${formatDate(subscription.periodEnd)}`;
	};

	if (isLoading) {
		return (
			<div className="space-y-8">
				<div>
					<div className="flex items-center justify-between mb-6">
						<div className="space-y-2">
							<Skeleton className="h-7 w-32" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-9 w-24" />
					</div>

					<div className="space-y-4">
						<div>
							<Skeleton className="h-5 w-24 mb-2" />
							<Skeleton className="h-4 w-32 mb-4" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-48" />
								<Skeleton className="h-4 w-40" />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-6 w-12" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	const isFreePlan = activePlan?.isFree || !activePlan;
	const isPaidPlan = !isFreePlan;

	return (
		<div className="space-y-8">
			<div>
				<div className="mb-6">
					<h2 className="text-xl font-semibold">{t("title")}</h2>
					<p className="text-sm text-muted-foreground mt-2">
						{t("description")}
					</p>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-lg mb-2">{activePlan?.name}</p>
							{isPaidPlan && subscription && (
								<div className="text-sm text-muted-foreground flex flex-row gap-1">
									{getPlanPrice() && <div>{getPlanPrice()}</div>}
									<span className="text-muted-foreground">•</span>
									{getRenewalText() && <div>{getRenewalText()}</div>}
								</div>
							)}
						</div>

						{isFreePlan ? (
							<Button
								onClick={handleUpgrade}
								className="font-bold cursor-pointer"
							>
								{t("currentPlan.upgrade")}
							</Button>
						) : (
							<Button
								onClick={handleManageBilling}
								disabled={isPortalLoading || !user?.customerId}
								variant="ghost"
								className="font-bold cursor-pointer"
							>
								{isPortalLoading ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									t("manage.manageBilling")
								)}
							</Button>
						)}
					</div>

					<div className="flex items-center gap-2">
						{subscription?.status === "trialing" && (
							<Badge variant="outline">{t("manage.status.trial")}</Badge>
						)}
						{subscription?.cancelAtPeriodEnd && (
							<Badge variant="destructive">{t("manage.status.canceled")}</Badge>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
