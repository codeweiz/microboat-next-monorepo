import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable(
	"user",
	{
		id: text("id", { length: 255 }).primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: integer("email_verified", { mode: "boolean" })
			.notNull()
			.default(false),
		image: text("image"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
		customerId: text("customer_id"),
		role: text("role"),
		banned: integer("banned", { mode: "boolean" }),
		banReason: text("ban_reason"),
		banExpires: integer("ban_expires", { mode: "timestamp" }),
		locale: text("locale"),
	},
	(table) => {
		return {
			emailIdx: uniqueIndex("email_idx").on(table.email),
		};
	},
);

export const session = sqliteTable(
	"session",
	{
		id: text("id", { length: 255 }).primaryKey(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		token: text("token").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
		impersonatedBy: text("impersonated_by"),
	},
	(table) => {
		return {
			tokenIdx: uniqueIndex("session_token_idx").on(table.token),
		};
	},
);

export const account = sqliteTable(
	"account",
	{
		id: text("id", { length: 255 }).primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		expiresAt: integer("expires_at", { mode: "timestamp" }),
		password: text("password"),
		accessTokenExpiresAt: integer("access_token_expires_at", {
			mode: "timestamp",
		}),
		refreshTokenExpiresAt: integer("refresh_token_expires_at", {
			mode: "timestamp",
		}),
		scope: text("scope"),
		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.default(new Date()),
	},
	(table) => {
		return {
			userIdIdx: index("account_user_id_idx").on(table.userId),
			accountIdIdx: index("account_account_id_idx").on(table.accountId),
		};
	},
);

export const verification = sqliteTable("verification", {
	id: text("id", { length: 255 }).primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const passkey = sqliteTable(
	"passkey",
	{
		id: text("id", { length: 255 }).primaryKey(),
		name: text("name"),
		publicKey: text("public_key").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		credentialID: text("credential_id").notNull(),
		counter: integer("counter").notNull(),
		deviceType: text("device_type").notNull(),
		backedUp: text("backed_up").notNull(),
		transports: text("transports"),
		createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
	},
	(table) => {
		return {
			userIdIdx: index("passkey_user_id_idx").on(table.userId),
		};
	},
);

export const purchase = sqliteTable(
	"purchase",
	{
		id: text("id", { length: 255 }).primaryKey(),
		userId: text("user_id").references(() => user.id, {
			onDelete: "cascade",
		}),
		type: text("type").notNull(),
		customerId: text("customer_id").notNull(),
		subscriptionId: text("subscription_id").unique(),
		priceId: text("price_id").notNull(),
		status: text("status"),
		interval: text("interval"),
		periodStart: integer("period_start", { mode: "timestamp" }),
		periodEnd: integer("period_end", { mode: "timestamp" }),
		cancelAtPeriodEnd: integer("cancel_at_period_end", { mode: "boolean" }),
		trialStart: integer("trial_start", { mode: "timestamp" }),
		trialEnd: integer("trial_end", { mode: "timestamp" }),
		createdAt: integer("created_at", { mode: "timestamp" })
			.default(new Date())
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
	},
	(table) => {
		return {
			userIdIdx: index("purchase_user_id_idx").on(table.userId),
			subscriptionIdx: index("purchase_subscription_id_idx").on(
				table.subscriptionId,
			),
		};
	},
);
