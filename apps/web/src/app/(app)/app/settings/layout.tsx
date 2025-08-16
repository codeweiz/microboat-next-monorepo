"use client";

import { DashboardHeader } from "@microboat/web/components/dashboard/dashboard-header";
import { Separator } from "@microboat/web/components/ui/separator";
import { getSettingsTabsConfig } from "@microboat/web/config/settings-tabs";
import { cn } from "@microboat/web/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const config = getSettingsTabsConfig();

	const breadcrumbs = [
		{
			label: config.heading,
			isCurrentPage: true,
		},
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />
			<div className="flex flex-col mx-auto py-8 px-4">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold">{config.heading}</h1>
					<p className="text-muted-foreground mt-2">{config.description}</p>
				</div>

				{/* Tab Navigation */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
					{config.tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive =
							pathname === tab.href ||
							(pathname === "/settings" && tab.value === "account");

						return (
							<Link
								key={tab.value}
								href={tab.href}
								className={cn(
									"flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
									"border border-transparent",
									isActive
										? "bg-primary text-primary-foreground border-primary"
										: "border-secondary hover:bg-accent",
								)}
							>
								<Icon className="h-4 w-4" />
								{tab.label}
							</Link>
						);
					})}
				</div>

				<Separator className="mt-2 text-muted-foreground" />

				{/* Content Area */}
				<div className="max-w-4xl mt-16">{children}</div>
			</div>
		</>
	);
}
