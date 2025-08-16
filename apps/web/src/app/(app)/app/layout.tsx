import { DashboardSidebar } from "@microboat/web/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider } from "@microboat/web/components/ui/sidebar";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 64)",
					"--header-height": "calc(var(--spacing) * 16)",
				} as React.CSSProperties
			}
		>
			<DashboardSidebar variant="inset" />

			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
