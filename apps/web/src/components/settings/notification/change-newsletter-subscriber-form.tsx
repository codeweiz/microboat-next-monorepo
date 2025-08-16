"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { Label } from "@microboat/web/components/ui/label";
import { Switch } from "@microboat/web/components/ui/switch";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import {
	isSubscribedToNewsletter,
	subscribeToNewsletter,
	unsubscribeFromNewsletter,
} from "@microboat/web/mail/actions";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ChangeNewsletterSubscriberForm() {
	const { user } = useSession();
	const t = useTranslations("settings.notification");

	const [isSubscribed, setIsSubscribed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		const checkSubscriptionStatus = async () => {
			if (!user?.email) {
				setIsLoading(false);
				return;
			}

			try {
				const result = await isSubscribedToNewsletter({ email: user.email });
				if (result?.data !== undefined) {
					setIsSubscribed(result.data);
				} else if (result?.serverError) {
					console.error(
						"Server error checking subscription:",
						result.serverError,
					);
					setError("Failed to check subscription status");
				}
			} catch (err) {
				console.error("Error checking subscription status:", err);
				setError("Failed to check subscription status");
			} finally {
				setIsLoading(false);
			}
		};

		checkSubscriptionStatus();
	}, [user?.email]);

	const handleSubscriptionChange = async (checked: boolean) => {
		if (!user?.email) {
			setError("User email not found");
			return;
		}

		try {
			setError(null);
			setSuccess(null);
			setIsUpdating(true);

			if (checked) {
				const result = await subscribeToNewsletter({ email: user.email });
				if (result?.serverError) {
					throw new Error(result.serverError);
				}
				setSuccess(t("newsletter.subscribeSuccess"));
			} else {
				const result = await unsubscribeFromNewsletter({ email: user.email });
				if (result?.serverError) {
					throw new Error(result.serverError);
				}
				setSuccess(t("newsletter.unsubscribeSuccess"));
			}

			setIsSubscribed(checked);
		} catch (err) {
			console.error("Error updating subscription:", err);
			setError(
				checked
					? t("newsletter.subscribeError")
					: t("newsletter.unsubscribeError"),
			);
			// Revert the UI state on error
			setIsSubscribed(!checked);
		} finally {
			setIsUpdating(false);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-xl font-semibold">{t("newsletter.title")}</h2>
				<p className="text-sm text-muted-foreground">
					{t("newsletter.description")}
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="space-y-0.5">
					<Label htmlFor="newsletter" className="text-sm font-medium">
						{t("newsletter.subscribe")}
					</Label>
					<p className="text-xs text-muted-foreground">
						{t("newsletter.subscribeDescription")}
					</p>
				</div>
				<Switch
					id="newsletter"
					checked={isSubscribed}
					onCheckedChange={handleSubscriptionChange}
					disabled={isLoading || isUpdating}
				/>
			</div>

			<CustomFormMessage success={success} error={error} />
		</div>
	);
}
