import {SocialMedia} from "@microboat/common/types";

// 快捷链接
export interface QuickLink {
    label: string;
    href: string;
}

// 资源链接
export interface Resource {
    label: string;
    href: string;
}

// 法规链接
export interface LegalLink {
    label: string;
    href: string;
}

// 页脚数据
export interface FooterData {
    newsletter: {
        title: string;
        description: string;
        inputPlaceholder: string;
        submitAriaLabel: string;
    };
    quickLinks: {
        title: string;
        links: QuickLink[];
    };
    resources: {
        title: string;
        links: Resource[];
    };
    social: {
        title: string;
        media: SocialMedia[];
    };
    copyright: string;
    legalLinks: LegalLink[];
}