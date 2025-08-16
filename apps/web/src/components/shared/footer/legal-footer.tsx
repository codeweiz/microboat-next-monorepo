"use client";

import { getFooterData } from "@microboat/web/config/footer";
import { useTranslations } from "use-intl";
import * as CookieConsent from "vanilla-cookieconsent";

interface LegalFooterProps {
	className?: string;
	showBorder?: boolean;
}

function LegalFooter({ className = "", showBorder = true }: LegalFooterProps) {
	const footerData = getFooterData();
	const t = useTranslations();

	return (
		<div
			className={`flex flex-col items-center justify-between gap-4 pt-8 text-center md:flex-row ${showBorder ? "border-t" : ""} ${className}`}
		>
			<p className="text-sm text-muted-foreground">{footerData.copyright}</p>
			<nav className="flex gap-4 text-sm">
				{footerData.legalLinks.map((link, index) => (
					<a
						key={index}
						href={link.href}
						className="transition-colors text-muted-foreground hover:text-primary"
					>
						{link.label}
					</a>
				))}
				<button
					className="transition-colors text-muted-foreground hover:text-primary"
					type="button"
					onClick={CookieConsent.showPreferences}
				>
					{t("footer.legal.cookies")}
				</button>
			</nav>
		</div>
	);
}

export { LegalFooter };
