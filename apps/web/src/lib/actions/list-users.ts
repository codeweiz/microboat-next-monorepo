"use server";

import {getSession} from "@microboat/web/lib/auth/server";
import {asc, desc, ilike, or, sql} from "drizzle-orm";
import {redirect} from "next/navigation";
import {z} from "zod";
import {db, user} from "@microboat/database";

// Define the schema for getUsers parameters
const getUsersSchema = z.object({
    pageIndex: z.number().min(0).default(0),
    pageSize: z.number().min(1).max(100).default(10),
    search: z.string().optional().default(""),
    sorting: z
        .array(
            z.object({
                id: z.string(),
                desc: z.boolean(),
            }),
        )
        .optional()
        .default([]),
});

// Define sort field mapping
const sortFieldMap = {
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    role: user.role,
    banned: user.banned,
    customerId: user.customerId,
    banReason: user.banReason,
    banExpires: user.banExpires,
} as const;

export async function getUsersAction(input: z.infer<typeof getUsersSchema>) {
    // Check if user is authenticated and has admin role
    const session = await getSession();
    if (!session) {
        redirect("/auth/login");
    }
    if (session.user?.role !== "admin") {
        redirect("/app/dashboard");
    }

    try {
        const validatedInput = getUsersSchema.parse(input);
        const {pageIndex, pageSize, search, sorting} = validatedInput;

        const where = search
            ? or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`))
            : undefined;

        const offset = pageIndex * pageSize;

        // Get the sort configuration
        const sortConfig = sorting[0];
        const sortField = sortConfig?.id
            ? sortFieldMap[sortConfig.id as keyof typeof sortFieldMap]
            : user.createdAt;
        const sortDirection = sortConfig?.desc ? desc : asc;

        const database = await db();

        const [items, [{count}]] = await Promise.all([
            database
                .select()
                .from(user)
                .where(where)
                .orderBy(sortDirection(sortField))
                .limit(pageSize)
                .offset(offset),
            database.select({count: sql`count(*)`}).from(user).where(where),
        ]);

        return {
            success: true,
            data: {
                items,
                total: Number(count),
            },
        };
    } catch (error) {
        console.error("get users error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch users",
        };
    }
}
