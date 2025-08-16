import { authClient } from "@microboat/web/lib/auth/client";
import { useQuery } from "@tanstack/react-query";

export const sessionQueryKey = ["user", "session"] as const;

export const useSessionQuery = () => {
	return useQuery({
		queryKey: sessionQueryKey,
		queryFn: async () => {
			const { data, error } = await authClient.getSession({
				query: {
					disableCookieCache: true,
				},
			});

			if (error) {
				throw new Error(error.message || "Failed to fetch session");
			}

			return data;
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		retry: false,
		enabled: true,
	});
};

const listAccountQueryKey = ["user", "accounts"] as const;

export const useUserAccountsQuery = () => {
	return useQuery({
		queryKey: listAccountQueryKey,
		queryFn: async () => {
			const { data, error } = await authClient.listAccounts();

			if (error) {
				throw error;
			}

			return data;
		},
	});
};