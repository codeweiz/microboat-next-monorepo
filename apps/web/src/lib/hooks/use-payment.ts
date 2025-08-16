import { useSession } from "@microboat/web/lib/hooks/use-session";
import {
	usePaymentActions,
	usePaymentQuery,
} from "@microboat/web/lib/stores/use-payment-store";

export function usePayment() {
	const { user } = useSession();
	const { data: paymentData, isLoading } = usePaymentQuery(user?.id);
	const { refetchPayment } = usePaymentActions();

	return {
		activePlan: paymentData?.activePlan ?? null,
		subscription: paymentData?.subscription ?? null,
		isLoading,
		refetch: () => {
			if (user?.id) {
				refetchPayment(user.id);
			}
		},
	};
}
