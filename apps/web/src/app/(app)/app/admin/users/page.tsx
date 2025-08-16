import { UsersTable } from "@microboat/web/components/admin/users-table";
import { DashboardHeader } from "@microboat/web/components/dashboard/dashboard-header";

export default function AdminUsersPage() {
	return (
		<>
			<DashboardHeader
				breadcrumbs={[
					{ label: "Admin" },
					{ label: "Users", isCurrentPage: true },
				]}
			/>
			<div className="flex flex-1 flex-col p-4 pt-16">
				<UsersTable />
			</div>
		</>
	);
}
