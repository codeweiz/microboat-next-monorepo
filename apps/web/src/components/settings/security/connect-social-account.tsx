"use client";

import { Button } from "@microboat/web/components/ui/button";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import { type OAuthProviderKeyType, oAuthProviders } from "@microboat/web/config/oauth-provider";
import { authClient } from "@microboat/web/lib/auth/client";
import { CheckCircle2Icon, LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConnectSocialAccountFormProps {
	accounts: any[];
	isPending: boolean;
}

export function ConnectSocialAccountForm({
	accounts,
	isPending,
}: ConnectSocialAccountFormProps) {
	const t = useTranslations();

	const isProviderLinked = (provider: OAuthProviderKeyType) =>
		accounts?.some((account) => account.provider === provider);

	const linkProvider = (provider: OAuthProviderKeyType) => {
		const callbackURL = window.location.href;
		if (!isProviderLinked(provider)) {
			authClient.linkSocial({
				provider,
				callbackURL,
			});
		}
	};

	return (
		<div className="space-y-8">
			<div>
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-xl font-semibold">
							{t("settings.security.connectedAccounts.title")}
						</h2>
						<p className="text-sm text-muted-foreground mt-2">
							{t("settings.security.connectedAccounts.description")}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1">
					{Object.entries(oAuthProviders).map(([provider, providerData]) => {
						const isLinked = isProviderLinked(provider as OAuthProviderKeyType);

						return (
							<div
								key={provider}
								className="flex h-14 items-center justify-between gap-2 py-2"
							>
								<div className="flex items-center gap-2">
									<providerData.icon className="size-4 text-primary/50" />
									<span className="text-sm">{providerData.displayName}</span>
								</div>
								{isPending ? (
									<Skeleton className="h-10 w-28" />
								) : isLinked ? (
									<CheckCircle2Icon className="size-8 text-primary" />
								) : (
									<Button
										variant="ghost"
										onClick={() => linkProvider(provider as OAuthProviderKeyType)}
										className="font-bold cursor-pointer"
									>
										<LinkIcon className="mr-1.5 size-4" />
										<span>
											{t("settings.security.connectedAccounts.connect")}
										</span>
									</Button>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
