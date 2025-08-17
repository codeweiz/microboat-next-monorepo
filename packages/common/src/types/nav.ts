// 导航子项
export interface NavSubItem {
    label: string;
    description: string;
    icon: React.ElementType;
    link: string;
}

// 导航子菜单
export interface NavSubMenu {
    title: string;
    items: NavSubItem[];
}

// 导航项
export interface NavItem {
    id: number;
    label: string;
    link?: string;
    subMenus?: NavSubMenu[];
}