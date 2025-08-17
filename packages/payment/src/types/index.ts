import {createSelectSchema} from "drizzle-zod";
import {purchase} from "@microboat/database";
import {PaymentType} from "@microboat/common";

// 创建结账链接参数
export interface CreateCheckoutLinkParams {
    type: PaymentType;
    priceId: string;
    email?: string;
    name?: string;
    redirectUrl?: string;
    customerId?: string;
    userId: string;
    trialPeriodDays?: number;
    referralId?: string;
}

// 创建客户门户链接参数
export interface CreatePortalLinkParams {
    customerId: string;
    redirectUrl?: string;
}

// 订阅
export interface Subscription {
    id?: string;
    priceId: string;
    status: string;
    interval?: string;
    periodStart?: Date;
    periodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    trialStart?: Date;
    trialEnd?: Date;
}

// 购买 schema
export const PurchaseSchema = createSelectSchema(purchase);

// 购买
export type Purchase = typeof purchase.$inferSelect;

// 支付提供商
export interface PaymentProvider {
    createCheckoutLink(params: CreateCheckoutLinkParams): Promise<string>;

    createCustomerPortalLink(params: CreatePortalLinkParams): Promise<string>;

    handleWebhook(payload: string, signature: string): Promise<void>;
}
