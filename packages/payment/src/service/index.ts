"use server";

import {
    getPriceByPriceId,
    getPricePlanByPriceId,
    getPricingConfig,
} from "@microboat/web/config/marketing/pricing";
import {getSession} from "@microboat/web/lib/auth/server";
import {actionClient} from "@microboat/web/lib/safe-action";
import {desc, eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import {z} from "zod";
import {PaymentType, PricePlan} from "@microboat/common";
import {db, purchase, user} from "@microboat/database";
import {getPaymentProvider} from "@microboat/payment/provider";
import {Purchase, PurchaseSchema, Subscription} from "@microboat/payment/types";

const createCheckoutLinkSchema = z.object({
    type: z.nativeEnum(PaymentType),
    priceId: z.string(),
    redirectUrl: z.string().url().optional(),
    referralId: z.string().optional(),
});

export const createCheckoutLink = actionClient
    .inputSchema(createCheckoutLinkSchema)
    .outputSchema(z.string())
    .action(async ({parsedInput}) => {
        const {type, priceId, redirectUrl, referralId} = parsedInput;
        const session = await getSession();

        if (!session?.user?.id) {
            return redirect("/auth/login?redirectTo=/pricing");
        }

        const database = await db();
        const userData = await database
            .select()
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);

        if (userData.length === 0) {
            console.error("User not found, cannot create checkout link");
            throw new Error("User not found");
        }

        const plan = getPriceByPriceId(priceId);
        const trialPeriodDays = plan?.trialPeriodDays || 0;

        console.log("createCheckoutLink with params:", {
            type,
            priceId,
            email: userData[0].email,
            name: userData[0].name,
            redirectUrl,
            trialPeriodDays,
            referralId,
        });

        const paymentProvider = getPaymentProvider();
        return await paymentProvider.createCheckoutLink({
            type,
            priceId,
            email: userData[0].email,
            name: userData[0].name,
            redirectUrl,
            customerId: userData[0].customerId ?? undefined,
            userId: session.user.id,
            trialPeriodDays,
            referralId,
        });
    });

const createPortalSchema = z.object({
    customerId: z.string(),
    redirectUrl: z.string().url().optional(),
});

export const createCustomerPortal = actionClient
    .inputSchema(createPortalSchema)
    .outputSchema(z.string())
    .action(async ({parsedInput}) => {
        const {customerId, redirectUrl} = parsedInput;
        const paymentProvider = getPaymentProvider();
        return await paymentProvider.createCustomerPortalLink({
            customerId,
            redirectUrl,
        });
    });

const getPurchasesSchema = z.object({
    userId: z.string(),
});

export const getPurchases = actionClient
    .inputSchema(getPurchasesSchema)
    .outputSchema(z.array(PurchaseSchema))
    .action(async ({parsedInput: {userId}}) => {
        const database = await db();
        const purchases = await database
            .select()
            .from(purchase)
            .where(eq(purchase.userId, userId))
            .orderBy(desc(purchase.createdAt));

        return purchases.map((purchase) => PurchaseSchema.parse(purchase));
    });

const getUserPaymentStatusSchema = z.object({
    userId: z.string(),
});

const PaymentStatusSchema = z.object({
    activePlan: z.custom<PricePlan>().nullable(),
    subscription: z.custom<Subscription>().nullable(),
});

export const getUserPaymentStatus = actionClient
    .inputSchema(getUserPaymentStatusSchema)
    .outputSchema(PaymentStatusSchema)
    .action(async ({parsedInput: {userId}}) => {
        const {plans} = await getPricingConfig();
        const freePlan = plans.find((plan) => plan.isFree);
        const lifetimePlan = plans.find((plan) => plan.isLifetime);

        const database = await db();
        const purchases = (await database
            .select()
            .from(purchase)
            .where(eq(purchase.userId, userId))
            .orderBy(desc(purchase.createdAt))) as Purchase[];

        const activeSubscription = purchases.find(
            (purchase) =>
                purchase.type === PaymentType.SUBSCRIPTION &&
                (purchase.status === "active" || purchase.status === "trialing"),
        );

        const activeOneTimePurchase = purchases.find(
            (purchase) =>
                purchase.type === PaymentType.ONE_TIME &&
                purchase.status === "completed",
        );

        if (activeOneTimePurchase) {
            return {
                activePlan: lifetimePlan || null,
                subscription: null,
            };
        }

        if (activeSubscription) {
            const pricePlan = await getPricePlanByPriceId(activeSubscription.priceId);
            return {
                activePlan: pricePlan,
                subscription: {
                    id: activeSubscription?.subscriptionId,
                    priceId: activeSubscription.priceId,
                    status: activeSubscription.status || "unknown",
                    interval: activeSubscription?.interval,
                    periodStart: activeSubscription?.periodStart,
                    periodEnd: activeSubscription?.periodEnd,
                    cancelAtPeriodEnd: activeSubscription?.cancelAtPeriodEnd,
                    trialStart: activeSubscription?.trialStart,
                    trialEnd: activeSubscription?.trialEnd,
                },
            };
        }

        return {
            activePlan: freePlan || null,
            subscription: null,
        };
    });
