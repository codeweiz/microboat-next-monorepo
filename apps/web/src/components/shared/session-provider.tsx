"use client";

import { sessionQueryKey, useSessionQuery } from "@microboat/web/lib/auth/api";
import { authClient } from "@microboat/web/lib/auth/client";
import { SessionContext } from "@microboat/web/lib/auth/session-context";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

export function SessionProvider({
	children,
}: {
	children: ReactNode;
}) {
	const queryClient = useQueryClient();

	const { data: session } = useSessionQuery();
	const [loaded, setLoaded] = useState(!!session);

	useEffect(() => {
		if (session && !loaded) {
			setLoaded(true);
		}
	}, [session]);

	return (
		<SessionContext.Provider
			value={{
				loaded,
				session: session?.session ?? null,
				user: session?.user ?? null,
				reloadSession: async () => {
					const { data: newSession, error } = await authClient.getSession({
						query: {
							disableCookieCache: true,
						},
					});

					if (error) {
						throw new Error(error.message || "Failed to fetch session");
					}

					queryClient.setQueryData(sessionQueryKey, () => newSession);
				},
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}
