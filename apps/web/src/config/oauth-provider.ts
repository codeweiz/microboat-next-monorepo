import GitHub from "@microboat/web/components/icons/social-media/github";
import Google from "@microboat/web/components/icons/social-media/google";
import type { JSXElementConstructor } from "react";

export const oAuthProviders = {
	google: {
		name: "Google",
		icon: Google,
	},
	github: {
		name: "GitHub",
		icon: GitHub,
	},
} as const satisfies Record<
	string,
	{
		name: string;
		icon: JSXElementConstructor<React.SVGProps<SVGSVGElement>>;
	}
>;

export type OAuthProvider = keyof typeof oAuthProviders;
