import type {ReactNode} from "react";

// 侧边栏导航项
export type SidebarNavItem = {
    id: string;
    title: string;
    icon?: ReactNode;
    href?: string;
};

// 嵌套的侧边栏导航项
export type SidebarNestedNavItem = SidebarNavItem & {
    items?: SidebarNavItem[];
};