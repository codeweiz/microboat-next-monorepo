"use client";

import { LegalFooter } from "@microboat/web/components/shared/footer/legal-footer";
import { LocaleSwitcher } from "@microboat/web/components/shared/footer/locale-switcher";
import { NewsletterSubscriberForm } from "@microboat/web/components/shared/footer/newsletter-subscriber-form";
import { SocialButton } from "@microboat/web/components/shared/footer/social-button";
import { ThemeSwitcher } from "@microboat/web/components/shared/footer/theme-switcher";
import { useConfig } from "@microboat/common";
import { getFooterData } from "@microboat/web/config/footer";

function Footer() {
	const config = useConfig();
	const footerData = getFooterData();

	return (
		<footer className="relative text-foreground transition-colors duration-300 bg-muted/70">
			<div className="container mx-auto max-w-7xl py-12 px-8 md:px-16 lg:px-8">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
					<NewsletterSubscriberForm
						title={footerData.newsletter.title}
						description={footerData.newsletter.description}
						inputPlaceholder={footerData.newsletter.inputPlaceholder}
						submitAriaLabel={footerData.newsletter.submitAriaLabel}
					/>
					<div>
						<h3 className="mb-4 text-lg font-semibold">
							{footerData.quickLinks.title}
						</h3>
						<nav className="space-y-2 text-md">
							{footerData.quickLinks.links.map((link, index) => (
								<a
									key={index}
									href={link.href}
									className="block transition-colors hover:text-primary"
								>
									{link.label}
								</a>
							))}
						</nav>
					</div>
					<div>
						<h3 className="mb-4 text-lg font-semibold">
							{footerData.resources.title}
						</h3>
						<nav className="space-y-2 text-md">
							{footerData.resources.links.map((link, index) => (
								<a
									key={index}
									href={link.href}
									className="block transition-colors hover:text-primary"
								>
									{link.label}
								</a>
							))}
						</nav>
					</div>
					<div className="relative">
						<SocialButton />
						{config.getUi().theme.enabled && <ThemeSwitcher />}
						{config.getI18n().enabled && (
							<div className="py-6">
								<LocaleSwitcher />
							</div>
						)}
					</div>
				</div>
				<div className="mt-12">
					<LegalFooter />
				</div>
			</div>
		</footer>
	);
}

export { Footer };
