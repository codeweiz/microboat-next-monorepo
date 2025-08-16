import { appConfig } from "@microboat/web/config";
import { CreemProvider } from "@microboat/web/payment/providers/creem";
import { StripeProvider } from "@microboat/web/payment/providers/stripe";
import type { PaymentProvider } from "@microboat/web/payment/types";

const providers = {
	stripe: StripeProvider,
	creem: CreemProvider,
} as const;

let paymentProviderInstance: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
	if (paymentProviderInstance) {
		return paymentProviderInstance;
	}

	const provider = appConfig.payment.provider as keyof typeof providers;
	paymentProviderInstance = new providers[provider]();
	return paymentProviderInstance;
}
