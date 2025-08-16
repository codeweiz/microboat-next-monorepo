import type { NavItem } from "@microboat/web/config/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useRef, useEffect } from "react";

export function DropdownNavigation({ navItems }: { navItems: NavItem[] }) {
	const [openMenu, setOpenMenu] = React.useState<string | null>(null);
	const [isHover, setIsHover] = React.useState<number | null>(null);
	const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const handleMouseEnter = (menuLabel: string) => {
		if (menuTimeoutRef.current) {
			clearTimeout(menuTimeoutRef.current);
		}
		setOpenMenu(menuLabel);
	};

	const handleMouseLeave = () => {
		menuTimeoutRef.current = setTimeout(() => {
			setOpenMenu(null);
		}, 100);
	};

	useEffect(() => {
		return () => {
			if (menuTimeoutRef.current) {
				clearTimeout(menuTimeoutRef.current);
			}
		};
	}, []);

	return (
		<div ref={menuRef}>
			<ul className="relative flex items-center space-x-0">
				{navItems.map((navItem) => (
					<li
						key={navItem.label}
						className="relative"
						onMouseEnter={() => handleMouseEnter(navItem.label)}
						onMouseLeave={handleMouseLeave}
					>
						{navItem.link ? (
							<Link
								href={navItem.link}
								className="text-sm py-1.5 px-4 flex cursor-pointer group items-center justify-center gap-1 relative"
								onMouseEnter={() => setIsHover(navItem.id)}
								onMouseLeave={() => setIsHover(null)}
							>
								<span>{navItem.label}</span>
								{(isHover === navItem.id || openMenu === navItem.label) && (
									<motion.div
										layoutId="hover-bg"
										className="absolute inset-0 size-full bg-primary/10"
										style={{ borderRadius: 99 }}
									/>
								)}
							</Link>
						) : (
							<button
								type="button"
								className="text-sm py-1.5 px-4 flex cursor-pointer group items-center justify-center gap-1 relative"
								onMouseEnter={() => setIsHover(navItem.id)}
								onMouseLeave={() => setIsHover(null)}
							>
								<span>{navItem.label}</span>
								{navItem.subMenus && (
									<ChevronDown
										className={`h-4 w-4 group-hover:rotate-180 duration-300 transition-transform
                      ${openMenu === navItem.label ? "rotate-180" : ""}`}
									/>
								)}
								{(isHover === navItem.id || openMenu === navItem.label) && (
									<motion.div
										layoutId="hover-bg"
										className="absolute inset-0 size-full bg-primary/10"
										style={{ borderRadius: 99 }}
									/>
								)}
							</button>
						)}

						<AnimatePresence>
							{openMenu === navItem.label && navItem.subMenus && (
								<div
									className="w-auto absolute left-0 top-full pt-2"
									onMouseEnter={() => handleMouseEnter(navItem.label)}
									onMouseLeave={handleMouseLeave}
								>
									<motion.div
										className="bg-background border border-border p-4 w-max"
										style={{ borderRadius: 16 }}
										layoutId="menu"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
									>
										<div className="w-fit shrink-0 flex space-x-9 overflow-hidden">
											{navItem.subMenus.map((sub) => (
												<motion.div layout className="w-full" key={sub.title}>
													<h3 className="mb-4 text-sm font-medium capitalize text-muted-foreground">
														{sub.title}
													</h3>
													<ul className="space-y-6">
														{sub.items.map((item) => {
															const Icon = item.icon;
															return (
																<li key={item.label}>
																	<Link
																		href={item.link || "#"}
																		className="flex items-start space-x-3 group"
																	>
																		<div className="border border-border text-foreground rounded-md flex items-center justify-center size-9 shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
																			<Icon className="h-5 w-5 flex-none" />
																		</div>
																		<div className="leading-5 w-max">
																			<p className="text-sm font-medium text-foreground shrink-0">
																				{item.label}
																			</p>
																			<p className="text-xs text-muted-foreground shrink-0 group-hover:text-foreground transition-colors duration-300">
																				{item.description}
																			</p>
																		</div>
																	</Link>
																</li>
															);
														})}
													</ul>
												</motion.div>
											))}
										</div>
									</motion.div>
								</div>
							)}
						</AnimatePresence>
					</li>
				))}
			</ul>
		</div>
	);
}

// Type definitions removed as they're now imported from navigation.ts
