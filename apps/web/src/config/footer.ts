import {useTranslations} from "next-intl";
import {getSocialMediaData} from "./social-media";
import {FooterData} from "@microboat/common";

export function getFooterData(): FooterData {
    const t = useTranslations("footer");
    const socialData = getSocialMediaData();

    return {
        newsletter: {
            title: t("newsletter.title"),
            description: t("newsletter.description"),
            inputPlaceholder: t("newsletter.inputPlaceholder"),
            submitAriaLabel: t("newsletter.submitAriaLabel"),
        },
        quickLinks: {
            title: t("quickLinks.title"),
            links: [
                {label: t("quickLinks.home"), href: "/#hero"},
                {label: t("quickLinks.features"), href: "/#feature-tabs"},
                {label: t("quickLinks.pricing"), href: "/pricing"},
                {label: t("quickLinks.testimonials"), href: "/#testimonials"},
                {label: t("quickLinks.faq"), href: "/#faq"},
            ],
        },
        resources: {
            title: t("resources.title"),
            links: [
                {label: t("resources.gettingStarted"), href: "/docs"},
                {label: t("resources.blog"), href: "/blog"},
                {label: t("resources.docs"), href: "/docs"},
                {label: t("resources.contact"), href: "/contact"},
                {label: t("resources.changelog"), href: "/changelog"},
            ],
        },
        social: socialData,
        copyright: t("copyright"),
        legalLinks: [
            {label: t("legal.privacy"), href: "/legal/privacy-policy"},
            {label: t("legal.terms"), href: "/legal/terms-of-service"},
        ],
    };
}
