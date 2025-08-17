import GitHub from "@microboat/web/components/icons/social-media/github";
import Google from "@microboat/web/components/icons/social-media/google";
import { createOAuthProviders, type OAuthProviderKey } from "@microboat/config";

export const oAuthProviders = createOAuthProviders({
	google: {
		id: "google",
		name: "Google",
		displayName: "Google",
		icon: Google,
		enabled: true,
	},
	github: {
		id: "github",
		name: "GitHub",
		displayName: "GitHub",
		icon: GitHub,
		enabled: true,
	},
});

export type OAuthProviderKeyType = OAuthProviderKey<typeof oAuthProviders>;
