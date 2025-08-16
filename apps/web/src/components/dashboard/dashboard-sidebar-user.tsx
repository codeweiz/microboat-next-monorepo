"use client";

import { UserAvatar } from "@microboat/web/components/shared/user-avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@microboat/web/components/ui/dropdown-menu";
import { Skeleton } from "@microboat/web/components/ui/skeleton";
import { appConfig } from "@microboat/web/config";
import { useRouter } from "@microboat/web/i18n/navigation";
import { authClient } from "@microboat/web/lib/auth/client";
import { useIsMobile } from "@microboat/web/lib/hooks/use-mobile";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import {
	ChevronsUpDown,
	LogOut,
	MonitorIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

interface SidebarUserProps {
	showUserName?: boolean;
}

export function SidebarUser({ showUserName = true }: SidebarUserProps) {
	const router = useRouter();
	const isMobile = useIsMobile();
	const t = useTranslations("menu");
	const { user } = useSession();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const { theme, setTheme } = useTheme();

	const handleSignOut = async () => {
		try {
			setIsSigningOut(true);
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						console.log("sign out success");
					},
					onError: (error: any) => {
						console.error("sign out error:", error);
						setIsSigningOut(false);
					},
				},
			});
			router.replace(appConfig.auth.redirectAfterLogout);
		} catch (error) {
			console.error("sign out error:", error);
			setIsSigningOut(false);
		}
	};

	if (isSigningOut) {
		return <Skeleton className="h-10 w-full" />;
	}

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex cursor-pointer w-full items-center justify-between gap-2 rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:w-[100%+1rem] md:px-2 md:py-1.5 md:hover:bg-primary/5"
					aria-label="User menu"
				>
					<UserAvatar
						name={user.name}
						image={user.image}
						className="size-8 border"
					/>
					{showUserName && (
						<>
							<div className="grid flex-1 ml-2 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				side={isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<UserAvatar
							name={user.name}
							image={user.image}
							className="size-8"
						/>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user.name}</span>
							<span className="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>

				{appConfig.ui.theme.enabled && (
					<>
						<DropdownMenuSeparator />
						<div className="px-2 py-2">
							<div className="flex items-center gap-1">
								<button
									type="button"
									onClick={() => setTheme("light")}
									className={`flex-1 h-8 w-4 px-2 rounded-md flex items-center justify-center transition-colors ${
										theme === "light"
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
									}`}
									title={t("users.mode.light")}
								>
									<SunIcon className="size-4" />
								</button>
								<button
									type="button"
									onClick={() => setTheme("dark")}
									className={`flex-1 h-8 w-8 px-2 rounded-md flex items-center justify-center transition-colors ${
										theme === "dark"
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
									}`}
									title={t("users.mode.dark")}
								>
									<MoonIcon className="size-4" />
								</button>
								<button
									type="button"
									onClick={() => setTheme("system")}
									className={`flex-1 h-8 w-8 px-2 rounded-md flex items-center justify-center transition-colors ${
										theme === "system"
											? "bg-primary text-primary-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
									}`}
									title={t("users.mode.system")}
								>
									<MonitorIcon className="size-4" />
								</button>
							</div>
						</div>
					</>
				)}

				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className="cursor-pointer">
					<Link href="/app/settings/account">
						<SettingsIcon className="mr-2 size-4" />
						{t("users.settings")}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem
					className="cursor-pointer"
					onClick={async (event) => {
						event.preventDefault();
						handleSignOut();
					}}
				>
					<LogOut className="mr-2 size-4" />
					{t("users.logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
