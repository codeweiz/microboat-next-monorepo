"use client";

import { SidebarUser } from "@microboat/web/components/dashboard/dashboard-sidebar-user";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@microboat/web/components/ui/breadcrumb";
import { Separator } from "@microboat/web/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@microboat/web/components/ui/sidebar";
import React from "react";

interface DashboardBreadcrumbItem {
	label: string;
	isCurrentPage?: boolean;
}

interface DashboardHeaderProps {
	breadcrumbs: DashboardBreadcrumbItem[];
}

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
	const { isMobile } = useSidebar();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
				{isMobile ? (
					<>
						<SidebarTrigger className="-ml-1 cursor-pointer" />

						<div className="flex items-center justify-end md:hidden">
							<SidebarUser showUserName={false} />
						</div>
					</>
				) : (
					<>
						<div className="flex items-center gap-1">
							<SidebarTrigger className="-ml-1 cursor-pointer" />
							<Separator
								orientation="vertical"
								className="mx-2 data-[orientation=vertical]:h-4"
							/>

							<Breadcrumb>
								<BreadcrumbList className="text-base">
									{breadcrumbs.map((item, index) => (
										<React.Fragment key={`breadcrumb-${index}`}>
											{index > 0 && (
												<BreadcrumbSeparator
													key={`sep-${index}`}
													className="hidden md:block"
												/>
											)}
											<BreadcrumbItem
												key={`item-${index}`}
												className={
													index < breadcrumbs.length - 1
														? "hidden md:block"
														: ""
												}
											>
												{item.isCurrentPage ? (
													<BreadcrumbPage>{item.label}</BreadcrumbPage>
												) : (
													item.label
												)}
											</BreadcrumbItem>
										</React.Fragment>
									))}
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</>
				)}
			</div>
		</header>
	);
}
