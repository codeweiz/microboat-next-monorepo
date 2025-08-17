"use client";

import {
	ImageIcon,
	LayoutDashboardIcon,
	MessagesSquare,
	Mic,
	Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {SidebarNestedNavItem} from "@microboat/common";

export function getSidebarLinks(): SidebarNestedNavItem[] {
	const t = useTranslations("menu");

	return [
		{
			id: "application",
			title: t("application.title"),
			items: [
				{
					id: "dashboard",
					title: t("application.dashboard.title"),
					icon: <LayoutDashboardIcon className="size-4 shrink-0" />,
					href: "/app/dashboard",
				},
			],
		},
		{
			id: "ai",
			title: t("ai.title"),
			items: [
				{
					id: "chat",
					title: t("ai.chat.title"),
					icon: <MessagesSquare className="size-4 shrink-0" />,
					href: "/app/ai/chat",
				},
				{
					id: "voice",
					title: t("ai.voice.title"),
					icon: <Mic className="size-4 shrink-0" />,
					href: "/app/ai/voice",
				},
				{
					id: "image",
					title: t("ai.media.title"),
					icon: <ImageIcon className="size-4 shrink-0" />,
					href: "/app/ai/image",
				},
			],
		},
		{
			id: "admin",
			title: t("admin.title"),
			items: [
				{
					id: "users",
					title: t("admin.users.title"),
					icon: <Users className="size-4 shrink-0" />,
					href: "/app/admin/users",
				},
			],
		},
	];
}
