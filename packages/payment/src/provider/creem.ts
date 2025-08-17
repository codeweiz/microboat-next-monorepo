import {createHmac} from "crypto";
import {getPriceByPriceId} from "@microboat/web/config/marketing/pricing";
import {eq} from "drizzle-orm";
import {joinURL} from "ufo";
import {v4 as uuidv4} from "uuid";
import {CreateCheckoutLinkParams, CreatePortalLinkParams, PaymentProvider} from "../types";
import {db, purchase, user} from "@microboat/database";
import {PaymentType, PlanInterval} from "@microboat/common";

// Creem 支付提供商
export class CreemProvider implements PaymentProvider {
    private webhookSecret: string;
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        const apiKey = process.env.CREEM_API_KEY;
        if (!apiKey) {
            throw new Error("CREEM_API_KEY environment variable is required");
        }

        const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("CREEM_WEBHOOK_SECRET environment variable is required");
        }

        this.apiKey = apiKey;
        this.webhookSecret = webhookSecret;
        this.baseUrl = this.apiKey.includes("test")
            ? "https://test-api.creem.io/v1"
            : "https://api.creem.io/v1";
    }

    private async creemFetch(
        path: string,
        init?: RequestInit,
    ): Promise<Response> {
        const requestUrl = joinURL(this.baseUrl, path);

        return fetch(requestUrl, {
            ...init,
            headers: {
                "x-api-key": this.apiKey,
                "Content-Type": "application/json",
                ...init?.headers,
            },
        });
    }

    public async createCheckoutLink(
        params: CreateCheckoutLinkParams,
    ): Promise<string> {
        const {priceId, email, redirectUrl, userId, referralId} = params;

        const metadata: Record<string, string | null> = {
            user_id: userId,
        };

        if (referralId) {
            metadata.affonso_referral = referralId;
        }

        const response = await this.creemFetch("/checkouts", {
            method: "POST",
            body: JSON.stringify({
                product_id: priceId, // In Creem, priceId is actually productId
                units: 1,
                success_url: redirectUrl ?? undefined,
                metadata,
                customer: {
                    email,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to create checkout link", errorData);
            throw new Error("Failed to create checkout link");
        }

        const {checkout_url} = (await response.json()) as {
            checkout_url: string;
        };
        return checkout_url;
    }

    public async createCustomerPortalLink(
        params: CreatePortalLinkParams,
    ): Promise<string> {
        const {customerId} = params;

        const response = await this.creemFetch("/customers/billing", {
            method: "POST",
            body: JSON.stringify({
                customer_id: customerId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to create customer portal link", errorData);
            throw new Error("Failed to create customer portal link");
        }

        const {customer_portal_link} = (await response.json()) as {
            customer_portal_link: string;
        };
        return customer_portal_link;
    }

    public async handleWebhook(
        payload: string,
        signature: string,
    ): Promise<void> {
        // Verify webhook signature
        const computedSignature = createHmac("sha256", this.webhookSecret)
            .update(payload)
            .digest("hex");

        if (computedSignature !== signature) {
            throw new Error("Invalid webhook signature");
        }

        const event = JSON.parse(payload);
        console.log(`Processing Creem webhook: ${event.eventType}`);

        try {
            switch (event.eventType) {
                case "checkout.completed": {
                    await this.handleOneTimePayment(event);
                    break;
                }
                case "subscription.active": {
                    await this.handleSubscriptionActive(event);
                    break;
                }
                case "subscription.trialing": {
                    await this.handleSubscriptionTrialing(event);
                    break;
                }
                case "subscription.canceled":
                case "subscription.expired": {
                    await this.handleSubscriptionCanceled(event);
                    break;
                }
                default:
                    console.log(`Unhandled Creem event: ${event.eventType}`);
            }
        } catch (error) {
            console.error("Creem webhook error:", error);
            throw error;
        }
    }

    private async updateUserCustomerId(
        customerId: string,
        userId: string,
    ): Promise<void> {
        const database = await db();
        await database
            .update(user)
            .set({
                customerId,
            })
            .where(eq(user.id, userId));
    }

    private async handleOneTimePayment(event: any): Promise<void> {
        const {product, metadata, object, customer, subscription} = event.object;

        if (!product?.id) {
            console.error("Missing product ID in checkout.completed");
            return;
        }

        // Skip if this is a subscription checkout
        if (object !== "checkout" || subscription?.id) {
            return;
        }

        const productId = product.id;
        const customerId = customer.id;
        const userId = metadata?.user_id;

        if (!userId) {
            console.error(
                "Missing userId for one-time payment and could not find user by email",
            );
            return;
        }

        const database = await db();
        await database.insert(purchase).values({
            id: uuidv4(),
            userId,
            customerId,
            type: PaymentType.ONE_TIME,
            priceId: productId,
            status: "completed",
            periodStart: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`Creem one-time payment completed for user ${userId}`);

        await this.updateUserCustomerId(customerId, userId);
        console.log(`User ${userId} customerId updated to ${customerId}`);
    }

    private async handleSubscriptionActive(event: any): Promise<void> {
        const {
            id,
            customer,
            product,
            metadata,
            status,
            current_period_start_date,
            current_period_end_date,
        } = event.object;

        const subscriptionId = id;
        const customerId = customer.id;
        const productId = product.id;
        const userId = metadata?.user_id;
        const periodStart = new Date(current_period_start_date);
        const periodEnd = new Date(current_period_end_date);
        const interval =
            getPriceByPriceId(productId)?.interval === PlanInterval.MONTH
                ? "month"
                : "year";

        if (!userId) {
            console.error(
                "Missing userId for subscription.active and could not find user by email",
            );
            return;
        }

        // Check if purchase already exists
        const database = await db();
        const existingPurchase = await database
            .select()
            .from(purchase)
            .where(eq(purchase.subscriptionId, subscriptionId))
            .limit(1);

        if (existingPurchase.length > 0) {
            // Update existing purchase
            await database
                .update(purchase)
                .set({
                    status,
                    priceId: productId,
                    periodStart,
                    periodEnd,
                    updatedAt: new Date(),
                })
                .where(eq(purchase.subscriptionId, subscriptionId));

            console.log(`Creem subscription updated: ${subscriptionId}`);
        } else {
            // Create new purchase
            await database.insert(purchase).values({
                id: uuidv4(),
                userId,
                type: PaymentType.SUBSCRIPTION,
                customerId,
                subscriptionId,
                priceId: productId,
                status,
                interval,
                periodStart,
                periodEnd,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`Creem subscription created for user ${userId}`);
        }

        await this.updateUserCustomerId(customerId, userId);
        console.log(`User ${userId} customerId updated to ${customerId}`);
    }

    private async handleSubscriptionTrialing(event: any): Promise<void> {
        const subscriptionData = event.object;

        const subscriptionId = subscriptionData.id;
        const customerId = subscriptionData.customer.id;
        const productId = subscriptionData.product.id;
        const status = subscriptionData.status;
        const trialStart = new Date(subscriptionData.current_period_start_date);
        const trialEnd = new Date(subscriptionData.current_period_end_date);
        const userId = subscriptionData.metadata?.user_id;
        const interval =
            getPriceByPriceId(productId)?.interval === PlanInterval.MONTH
                ? "month"
                : "year";

        if (!userId) {
            console.error(
                "Missing userId for subscription.trialing and could not find user by email",
            );
            return;
        }

        // Check if purchase already exists
        const database = await db();
        const existingPurchase = await database
            .select()
            .from(purchase)
            .where(eq(purchase.subscriptionId, subscriptionId))
            .limit(1);

        if (existingPurchase.length > 0) {
            // Update existing purchase to trialing status
            await database
                .update(purchase)
                .set({
                    status,
                    priceId: productId,
                    trialStart,
                    trialEnd,
                    interval,
                    periodStart: trialStart,
                    periodEnd: trialEnd,
                    updatedAt: new Date(),
                })
                .where(eq(purchase.subscriptionId, subscriptionId));

            console.log(`Creem subscription trial updated: ${subscriptionId}`);
        } else {
            // Create new purchase in trialing status
            await database.insert(purchase).values({
                id: uuidv4(),
                userId,
                type: PaymentType.SUBSCRIPTION,
                customerId,
                subscriptionId,
                priceId: productId,
                status,
                interval,
                trialStart,
                trialEnd,
                periodStart: trialStart,
                periodEnd: trialEnd,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`Creem subscription trial created for user ${userId}`);
        }

        await this.updateUserCustomerId(customerId, userId);
        console.log(`User ${userId} customerId updated to ${customerId}`);
    }

    private async handleSubscriptionCanceled(event: any): Promise<void> {
        const subscriptionId = event.object.id;

        const database = await db();
        await database
            .update(purchase)
            .set({
                status: "canceled",
                periodEnd: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(purchase.subscriptionId, subscriptionId));

        console.log(`Creem subscription canceled: ${subscriptionId}`);
    }
}
