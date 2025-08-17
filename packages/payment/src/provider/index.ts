import {appConfig} from "@microboat/web/config";
import {StripeProvider} from "@microboat/payment/provider/stripe";
import {CreemProvider} from "@microboat/payment/provider/creem";
import {PaymentProvider} from "@microboat/payment/types";

const providers = {
    stripe: StripeProvider,
    creem: CreemProvider,
} as const;

let paymentProviderInstance: PaymentProvider | null = null;

// 获取支付提供商
export function getPaymentProvider(): PaymentProvider {
    if (paymentProviderInstance) {
        return paymentProviderInstance;
    }

    const provider = appConfig.payment.provider as keyof typeof providers;
    paymentProviderInstance = new providers[provider]();
    return paymentProviderInstance;
}
