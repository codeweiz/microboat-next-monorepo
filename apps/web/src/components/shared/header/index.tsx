"use client";
import { Logo } from "@microboat/web/components/icons/logo";
import { DropdownNavigation } from "@microboat/web/components/shared/header/dorpdown-navigation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@microboat/web/components/ui/accordion";
import { Button } from "@microboat/web/components/ui/button";
import { useConfig } from "@microboat/common";
import { getNavItems } from "@microboat/web/config/navigation";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { cn } from "@microboat/web/lib/utils";
import { Menu, X } from "lucide-react";
import {} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export const Header = () => {
	const [menuState, setMenuState] = React.useState(false);
	const config = useConfig();
	const t = useTranslations();
	const navItems = getNavItems();
	const { user } = useSession();

	const handleMenuItemClick = () => {
		// Close the mobile menu when a link is clicked
		setMenuState(false);
	};

	return (
		<header>
			<nav
				data-state={menuState && "active"}
				className={cn("fixed z-20 w-full bg-background")}
			>
				<div className="mx-auto max-w-7xl px-6 transition-all duration-300">
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
						<div className="flex w-full items-center justify-between gap-12 lg:w-auto">
							<Link
								href="/"
								aria-label="home"
								className="flex items-center space-x-2 gap-4 font-extrabold text-xl"
							>
								<Logo />
								{config.getMetadata().name}
							</Link>

							<button
								type="button"
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState ? "Close Menu" : "Open Menu"}
								className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
								<X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
							</button>

							<div className="hidden lg:block">
								<DropdownNavigation navItems={navItems} />
							</div>
						</div>

						<div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="lg:hidden">
								<Accordion type="single" collapsible className="w-full">
									{navItems.map((item) => (
										<React.Fragment key={item.id}>
											{item.link ? (
												<div className="py-4">
													<Link
														href={item.link}
														className="text-muted-foreground hover:text-accent-foreground block text-base duration-150"
														onClick={handleMenuItemClick}
													>
														{item.label}
													</Link>
												</div>
											) : (
												<AccordionItem
													value={`item-${item.id}`}
													className="border-none"
												>
													<AccordionTrigger className="py-4 hover:no-underline">
														<span className="text-base">{item.label}</span>
													</AccordionTrigger>
													<AccordionContent>
														<div className="space-y-6 pl-4">
															{item.subMenus?.map((subMenu) => (
																<div key={subMenu.title} className="mb-4">
																	<h3 className="mb-3 text-sm font-medium text-muted-foreground">
																		{subMenu.title}
																	</h3>
																	<ul className="space-y-3">
																		{subMenu.items.map((subItem) => {
																			const Icon = subItem.icon;
																			return (
																				<li key={subItem.label}>
																					<Link
																						href={subItem.link || "#"}
																						className="flex items-start space-x-3 group"
																						onClick={handleMenuItemClick}
																					>
																						<div className="border border-border text-foreground rounded-md flex items-center justify-center size-8 shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
																							<Icon className="h-4 w-4 flex-none" />
																						</div>
																						<div className="leading-tight">
																							<p className="text-sm font-medium text-foreground">
																								{subItem.label}
																							</p>
																							<p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
																								{subItem.description}
																							</p>
																						</div>
																					</Link>
																				</li>
																			);
																		})}
																	</ul>
																</div>
															))}
														</div>
													</AccordionContent>
												</AccordionItem>
											)}
										</React.Fragment>
									))}
								</Accordion>
							</div>
							<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
								{user ? (
									<Button asChild variant="outline" size="sm">
										<Link href="/app/dashboard" onClick={handleMenuItemClick}>
											<span>{t("navigation.dashboard")}</span>
										</Link>
									</Button>
								) : (
									<Button asChild variant="outline" size="sm">
										<Link href="/auth/login" onClick={handleMenuItemClick}>
											<span>{t("navigation.login")}</span>
										</Link>
									</Button>
								)}
								<Button asChild size="sm">
									<Link href="/#pricing" onClick={handleMenuItemClick}>
										<span>{t("navigation.getStarted")}</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
