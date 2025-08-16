import { purchase } from "@microboat/web/database/schema";
import { createSelectSchema } from "drizzle-zod";

export enum PaymentType {
	SUBSCRIPTION = "subscription",
	ONE_TIME = "one-time",
}

export enum PlanInterval {
	MONTH = "monthly",
	YEAR = "yearly",
}

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

export interface CreatePortalLinkParams {
	customerId: string;
	redirectUrl?: string;
}

export interface Price {
	type: PaymentType;
	priceId: string;
	amount: number;
	interval?: PlanInterval;
	trialPeriodDays?: number;
}

export interface PricePlan {
	id: string;
	name?: string;
	description?: string;
	features?: string[];
	prices?: Price[];
	isFree?: boolean;
	isLifetime?: boolean;
	isEnterprise?: boolean;
	popular?: boolean;
	highlighted?: boolean;
}

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

export const PurchaseSchema = createSelectSchema(purchase);

export type Purchase = typeof purchase.$inferSelect;

export interface PaymentProvider {
	createCheckoutLink(params: CreateCheckoutLinkParams): Promise<string>;

	createCustomerPortalLink(params: CreatePortalLinkParams): Promise<string>;

	handleWebhook(payload: string, signature: string): Promise<void>;
}
