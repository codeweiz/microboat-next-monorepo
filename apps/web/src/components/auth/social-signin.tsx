"use client";

import { Button } from "@microboat/web/components/ui/button";
import { useConfig } from "@microboat/common";
import { type OAuthProviderKeyType, oAuthProviders } from "@microboat/web/config/oauth-provider";
import { authClient } from "@microboat/web/lib/auth/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function SocialSignin() {
	const config = useConfig();
	const [isLoading, setIsLoading] = useState<OAuthProviderKeyType | null>(null);

	const handleOAuthSignin = async (provider: OAuthProviderKeyType) => {
		try {
			setIsLoading(provider);

			await authClient.signIn.social({
				provider,
				callbackURL: `${window.location.origin}${config.getAuth().redirectAfterSignIn}`,
			});
		} catch (error) {
			console.error(`Error signing in with ${provider}:`, error);
		} finally {
			setIsLoading(null);
		}
	};

	if (!config.getAuth().enableSocialLogin) {
		return null;
	}

	return (
		<div className="space-y-4">
			{Object.entries(oAuthProviders).map(([providerId, providerData]) => {
				const provider = providerId as OAuthProviderKeyType;
				const IconComponent = providerData.icon;
				const isCurrentLoading = isLoading === provider;

				return (
					<Button
						key={provider}
						variant="outline"
						className="w-full h-12 text-base font-bold bg-muted/10 hover:bg-muted/90 cursor-pointer"
						onClick={() => handleOAuthSignin(provider)}
						disabled={isLoading !== null}
					>
						{isCurrentLoading ? (
							<Loader2 className="mr-3 size-4 animate-spin" />
						) : (
							<IconComponent className="mr-3" />
						)}
						{providerData.displayName}
					</Button>
				);
			})}
		</div>
	);
}
