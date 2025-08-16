import { CardsActivityGoal } from "@microboat/web/components/examples/dashboard/activity-goal";
import { CardsCookieSettings } from "@microboat/web/components/examples/dashboard/cookie-settings";
import { CardsCreateAccount } from "@microboat/web/components/examples/dashboard/create-account";
import { CardsExerciseMinutes } from "@microboat/web/components/examples/dashboard/exercise-minutes";
import { CardsForms } from "@microboat/web/components/examples/dashboard/forms";
import { GithubCard } from "@microboat/web/components/examples/dashboard/github-card";
import { CardsReportIssue } from "@microboat/web/components/examples/dashboard/report-issue";
import { CardsShare } from "@microboat/web/components/examples/dashboard/share";
import { CardsStats } from "@microboat/web/components/examples/dashboard/stats";

export default function CardsDemo() {
	return (
		<div className="@3xl:grids-col-2 grid p-2 **:data-[slot=card]:shadow-none md:p-4 @3xl:gap-4 @5xl:grid-cols-10 @7xl:grid-cols-11">
			<div className="grid gap-4 @5xl:col-span-3 @7xl:col-span-6">
				<CardsStats />
				<div className="grid gap-1 @2xl:grid-cols-[auto_1fr] @3xl:hidden">
					<div className="@2xl:pt-0 @2xl:pl-3 @7xl:pl-4">
						<CardsExerciseMinutes />
					</div>
					<div className="pt-3 @7xl:pt-4">
						<CardsActivityGoal />
					</div>
				</div>
				<div className="grid gap-4 @3xl:grid-cols-2 @5xl:grid-cols-1 @7xl:grid-cols-2">
					<div className="flex flex-col gap-4">
						<CardsForms />
						<CardsCookieSettings />
					</div>
					<div className="flex flex-col gap-4 pb-4">
						<CardsCreateAccount />
						<GithubCard />

						<div className="hidden @7xl:block">
							<CardsReportIssue />
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-4 @5xl:col-span-6 @7xl:col-span-5">
				<div className="hidden gap-1 @2xl:grid-cols-[auto_1fr] @3xl:grid">
					<div className="pt-3 @2xl:pt-0 @2xl:col-span-2 @2xl:pl-3 @7xl:pl-4">
						<CardsActivityGoal />
					</div>
					<div className="pt-3 @2xl:col-span-2 @7xl:pt-3">
						<CardsExerciseMinutes />
					</div>
				</div>
				<CardsShare />
				<div className="@7xl:hidden">
					<CardsReportIssue />
				</div>
			</div>
		</div>
	);
}
