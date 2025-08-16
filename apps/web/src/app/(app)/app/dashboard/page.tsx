import { DashboardHeader } from "@microboat/web/components/dashboard/dashboard-header";
import CardsDemo from "@microboat/web/components/examples/dashboard";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
	const t = useTranslations();

	const breadcrumbs = [
		{
			label: t("menu.application.dashboard.title"),
			isCurrentPage: true,
		},
	];

	return (
		<>
			<DashboardHeader breadcrumbs={breadcrumbs} />

			<div className="flex flex-1 flex-col">
				<div className="@container/main flex flex-1 flex-col gap-2">
					<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
						<CardsDemo />
					</div>
				</div>
			</div>
		</>
	);
}
