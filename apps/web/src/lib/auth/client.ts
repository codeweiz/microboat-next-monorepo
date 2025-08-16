import type { auth } from "@microboat/web/lib/auth";
import { getBaseUrl } from "@microboat/web/lib/urls";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: getBaseUrl(),
	plugins: [adminClient(), inferAdditionalFields<typeof auth>()],
});

export type AuthClientErrorCodes = typeof authClient.$ERROR_CODES;
