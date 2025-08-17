import {eq} from "drizzle-orm";
import {Stripe} from "stripe";
import {v4 as uuidv4} from "uuid";
import {CreateCheckoutLinkParams, CreatePortalLinkParams, PaymentProvider} from "../types";
import {PaymentType, PlanInterval} from "@microboat/common";
import {db, purchase, user} from "@microboat/database";

// Stripe 支付提供商
export class StripeProvider implements PaymentProvider {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor() {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            throw new Error("STRIPE_SECRET_KEY environment variable is required");
        }

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
        }

        this.stripe = new Stripe(apiKey, {
            httpClient: Stripe.createFetchHttpClient(),
        });
        this.webhookSecret = webhookSecret;
    }

    public async createCheckoutLink(
        params: CreateCheckoutLinkParams,
    ): Promise<string> {
        const {
            type,
            priceId,
            email,
            redirectUrl,
            customerId,
            userId,
            trialPeriodDays,
            referralId,
        } = params;

        const metadata = {userId} as Stripe.MetadataParam;

        if (referralId) {
            metadata.affonso_referral = referralId;
        }

        const response = await this.stripe.checkout.sessions.create({
            mode: type === PaymentType.SUBSCRIPTION ? "subscription" : "payment",
            success_url: redirectUrl ?? "",
            customer_email: email,
            line_items: [
                {
                    quantity: 1,
                    price: priceId,
                },
            ],
            customer: customerId,
            ...(type === PaymentType.ONE_TIME
                ? {
                    payment_intent_data: {
                        metadata,
                    },
                    customer_creation: "always",
                }
                : {
                    subscription_data: {
                        metadata,
                        trial_period_days: trialPeriodDays ?? undefined,
                    },
                }),
            metadata,
        });

        return response.url;
    }

    public async createCustomerPortalLink(
        params: CreatePortalLinkParams,
    ): Promise<string> {
        const {customerId, redirectUrl} = params;

        const response = await this.stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: redirectUrl ?? "",
        });

        return response.url;
    }

    public async handleWebhook(
        payload: string,
        signature: string,
    ): Promise<void> {
        try {
            const event = await this.stripe.webhooks.constructEventAsync(
                payload,
                signature,
                this.webhookSecret,
            );

            console.log(`Processing webhook: ${event.type}`);

            switch (event.type) {
                case "checkout.session.completed": {
                    const session = event.data.object as Stripe.Checkout.Session;
                    if (session.mode === "payment") {
                        await this.handleOneTimePayment(session);
                    }
                    break;
                }
                case "customer.subscription.created": {
                    const subscription = event.data.object as Stripe.Subscription;
                    await this.handleSubscriptionCreated(subscription);
                    break;
                }
                case "customer.subscription.updated": {
                    const subscription = event.data.object as Stripe.Subscription;
                    await this.handleSubscriptionUpdated(subscription);
                    break;
                }
                case "customer.subscription.deleted": {
                    const subscription = event.data.object as Stripe.Subscription;
                    await this.handleSubscriptionDeleted(subscription);
                    break;
                }
                default:
                    console.log(`Unhandled event: ${event.type}`);
            }
        } catch (error) {
            console.error("Webhook error:", error);
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

    private async handleOneTimePayment(
        session: Stripe.Checkout.Session,
    ): Promise<void> {
        const {userId} = session.metadata || {};
        if (!userId) {
            console.error("Missing required metadata for one-time payment");
            return;
        }

        const checkoutSession = await this.stripe.checkout.sessions.retrieve(
            session.id,
            {
                expand: ["line_items"],
            },
        );

        const priceId = checkoutSession.line_items?.data[0].price?.id;

        if (!priceId) {
            console.error("Missing required priceId for one-time payment");
            return;
        }

        const database = await db();
        await database.insert(purchase).values({
            id: uuidv4(),
            userId,
            customerId: session.customer as string,
            type: PaymentType.ONE_TIME,
            priceId,
            status: "completed",
            periodStart: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`One-time payment completed for user ${userId}`);

        await this.updateUserCustomerId(session.customer as string, userId);
        console.log(`User ${userId} customerId updated to ${session.customer}`);
    }

    private async handleSubscriptionCreated(
        subscription: Stripe.Subscription,
    ): Promise<void> {
        const {userId} = subscription.metadata || {};
        if (!userId) {
            console.error("Missing required metadata for subscription creation");
            return;
        }

        const priceId = subscription.items.data[0]?.price?.id;

        if (!priceId) {
            console.error("Missing required priceId for subscription creation");
            return;
        }

        const database = await db();
        await database.insert(purchase).values({
            id: uuidv4(),
            userId,
            type: PaymentType.SUBSCRIPTION,
            customerId: subscription.customer as string,
            subscriptionId: subscription.id,
            priceId,
            status: subscription.status as string,
            interval: subscription.items.data[0]?.plan.interval as PlanInterval,
            periodStart: new Date(
                subscription.items.data[0]?.current_period_start * 1000,
            ),
            periodEnd: new Date(
                subscription.items.data[0]?.current_period_end * 1000,
            ),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialStart: subscription.trial_start
                ? new Date(subscription.trial_start * 1000)
                : null,
            trialEnd: subscription.trial_end
                ? new Date(subscription.trial_end * 1000)
                : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`Subscription created for user ${userId}`);

        await this.updateUserCustomerId(subscription.customer as string, userId);
        console.log(
            `User ${userId} customerId updated to ${subscription.customer}`,
        );
    }

    private async handleSubscriptionUpdated(
        subscription: Stripe.Subscription,
    ): Promise<void> {
        const {userId} = subscription.metadata || {};
        if (!userId) {
            console.error("Missing required metadata for subscription creation");
            return;
        }

        const priceId = subscription.items.data[0]?.price?.id;

        if (!priceId) {
            console.error("Missing required priceId for subscription updated");
            return;
        }

        const database = await db();
        await database
            .update(purchase)
            .set({
                priceId,
                status: subscription.status as string,
                interval: subscription.items.data[0]?.plan.interval as string,
                periodStart: new Date(
                    subscription.items.data[0]?.current_period_start * 1000,
                ),
                periodEnd: new Date(
                    subscription.items.data[0]?.current_period_end * 1000,
                ),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                trialStart: subscription.trial_start
                    ? new Date(subscription.trial_start * 1000)
                    : null,
                trialEnd: subscription.trial_end
                    ? new Date(subscription.trial_end * 1000)
                    : null,
                updatedAt: new Date(),
            })
            .where(eq(purchase.subscriptionId, subscription.id));

        console.log(`Subscription updated for user ${subscription.id}`);

        await this.updateUserCustomerId(subscription.customer as string, userId);
        console.log(
            `User ${userId} customerId updated to ${subscription.customer}`,
        );
    }

    private async handleSubscriptionDeleted(
        subscription: Stripe.Subscription,
    ): Promise<void> {
        const database = await db();
        await database
            .update(purchase)
            .set({
                status: subscription.status as string,
                updatedAt: new Date(),
            })
            .where(eq(purchase.subscriptionId, subscription.id));

        console.log(`Subscription deleted: ${subscription.id}`);
    }
}
