"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@microboat/web/components/ui/sidebar";
import type { SidebarNestedNavItem } from "@microboat/web/config/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebarMenu({
	items,
}: { items: SidebarNestedNavItem[] }) {
	const pathname = usePathname();

	const isActive = (href: string | undefined): boolean => {
		if (!href) {
			return false;
		}
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	return (
		<>
			{items.map((item) =>
				item.items && item.items.length > 0 ? (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent className="flex flex-col gap-2">
							<SidebarMenu>
								{item.items.map((subItem) => (
									<SidebarMenuItem key={subItem.title}>
										<SidebarMenuButton
											asChild
											isActive={isActive(subItem.href)}
											className={
												isActive(subItem.href)
													? "border-primary font-bold"
													: "border-transparent"
											}
										>
											<Link href={subItem.href || ""}>
												{subItem.icon ? subItem.icon : null}
												<span
													className={`truncate text-md md:text-md ${
														isActive(subItem.href) ? "font-bold" : "font-medium"
													}`}
												>
													{subItem.title}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : (
					<SidebarGroup key={item.title}>
						<SidebarGroupContent className="flex flex-col gap-2">
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={isActive(item.href)}
										className={
											isActive(item.href)
												? "border-primary font-bold"
												: "border-transparent"
										}
									>
										<Link href={item.href || ""}>
											{item.icon ? item.icon : null}
											<span
												className={`truncate text-md ${
													isActive(item.href) ? "font-bold" : "font-medium"
												}`}
											>
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				),
			)}
		</>
	);
}
