// 价格计划
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

// 价格
export interface Price {
    type: PaymentType;
    priceId: string;
    amount: number;
    interval?: PlanInterval;
    trialPeriodDays?: number;
}

// 支付方式
export enum PaymentType {
    SUBSCRIPTION = "subscription",
    ONE_TIME = "one-time",
}

// 计划间隔
export enum PlanInterval {
    MONTH = "monthly",
    YEAR = "yearly",
}