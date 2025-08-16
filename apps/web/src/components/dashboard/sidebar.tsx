"use client";

import { DashboardSidebarMenu } from "@microboat/web/components/dashboard/dashboard-sidebar-menu";
import { SidebarUser } from "@microboat/web/components/dashboard/dashboard-sidebar-user";
import { Logo } from "@microboat/web/components/icons/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@microboat/web/components/ui/sidebar";
import { getSidebarLinks } from "@microboat/web/config/sidebar";
import { Link } from "@microboat/web/i18n/navigation";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { useTranslations } from "next-intl";
import type * as React from "react";

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const t = useTranslations();
	const { user } = useSession();
	const allSidebarLinks = getSidebarLinks();

	const sidebarLinks = allSidebarLinks.filter(
		(item) => item.id !== "admin" || user?.role === "admin"
	);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="pt-4 md:pt-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/">
								<Logo className="size-6" />
								<span className="truncate font-extrabold text-xl">
									{t("app.name")}
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="py-2 mt-2">
				<DashboardSidebarMenu items={sidebarLinks} />
			</SidebarContent>

			<SidebarFooter className="flex flex-col gap-4">
				<SidebarUser showUserName={true} />
			</SidebarFooter>
		</Sidebar>
	);
}
