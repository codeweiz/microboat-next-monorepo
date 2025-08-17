import { useQuery, useQueryClient } from "@tanstack/react-query";
import {getUserPaymentStatus} from "@microboat/payment";

export const paymentQueryKey = (userId: string) =>
	["payment", "status", userId] as const;

export const usePaymentQuery = (userId: string | undefined) => {
	return useQuery({
		queryKey: paymentQueryKey(userId ?? ""),
		queryFn: async () => {
			if (!userId) {
				return null;
			}

			const result = await getUserPaymentStatus({ userId });
			return result?.data ?? null;
		},
		enabled: !!userId,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 1,
	});
};

export const usePaymentActions = () => {
	const queryClient = useQueryClient();

	return {
		refetchPayment: (userId: string) => {
			queryClient.invalidateQueries({
				queryKey: paymentQueryKey(userId),
			});
		},
		resetPaymentState: (userId: string) => {
			queryClient.setQueryData(paymentQueryKey(userId), null);
		},
	};
};
