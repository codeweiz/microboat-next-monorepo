import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";

let dbInstance: DrizzleD1Database<typeof schema> | null = null;

const getDB = async () => {
	if (dbInstance) {
		return dbInstance;
	}

	const { env } = await getCloudflareContext({ async: true });

	if (!env.NEXT_TAG_CACHE_D1) {
		throw new Error("D1 database not found");
	}

	dbInstance = drizzle(env.NEXT_TAG_CACHE_D1, { schema, logger: true });

	return dbInstance;
};

export { getDB as db };
