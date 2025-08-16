"use client";
import { AnimatedGroup } from "@microboat/web/components/ui/animated-group";
import { AnimatedTooltip } from "@microboat/web/components/ui/animated-tooltip";
import { Badge } from "@microboat/web/components/ui/badge";
import { Button } from "@microboat/web/components/ui/button";
import { animatedTooltipItems } from "@microboat/web/config/marketing/animated-tool-tip";
import {
	getHeroSectionConfig,
	transitionVariants,
} from "@microboat/web/config/marketing/hero-section";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export function HeroSection() {
	const t = useTranslations("hero");
	const config = getHeroSectionConfig();

	return (
		<>
			<main className="overflow-hidden">
				<div
					aria-hidden
					className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block bg-gradient-to-b from-bg via-primary/20 to-bg blur-[150px]"
				>
				</div>
				<section id="hero">
					<div className="relative pt-24 md:pt-36">
						<div
							aria-hidden
							className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
						/>
						<div className="mx-auto max-w-7xl px-6">
							<div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
								<AnimatedGroup variants={transitionVariants}>
									<Link
										href={config.links.badge}
										className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-2 rounded-full border p-1 pl-2 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
									>
										<Badge className="rounded-full">{config.badge}</Badge>
										<span className="text-foreground text-xs md:text-sm">
											{config.badgeText}
										</span>
										<span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />

										<div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
											<div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
												<span className="flex size-6">
													<ArrowRight className="m-auto size-3" />
												</span>
												<span className="flex size-6">
													<ArrowRight className="m-auto size-3" />
												</span>
											</div>
										</div>
									</Link>

									<h1 className="mt-8 max-w-4xl mx-auto text-balance text-4xl md:text-7xl xl:text-[5rem] font-semibold">
										{config.heading.split(config.highlightHeading)[0]}{" "}
										<span className="text-primary">
											{config.highlightHeading}
										</span>
										{config.heading.split(config.highlightHeading)[1]}
									</h1>
									<p className="mx-auto mt-8 max-w-2xl text-balance text-md md:text-lg">
										{config.subHeading}
									</p>
								</AnimatedGroup>

								<AnimatedGroup
									variants={{
										container: {
											visible: {
												transition: {
													staggerChildren: 0.05,
													delayChildren: 0.75,
												},
											},
										},
										...transitionVariants,
									}}
									className="mt-8 md:mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
								>
									<div
										key={1}
										className="bg-foreground/10 rounded-[14px] border p-0.5"
									>
										<Button
											asChild
											size="lg"
											className="rounded-xl px-5 text-base"
										>
											<Link href={config.links.getStarted}>
												<span className="text-nowrap">
													{config.buttons.getStarted}
												</span>
											</Link>
										</Button>
									</div>
									<Button
										key={2}
										asChild
										size="lg"
										variant="secondary"
										className="h-10.5 rounded-xl px-5"
									>
										<Link href={config.links.seeDemo}>
											<span className="text-nowrap">
												{config.buttons.seeDemo}
											</span>
										</Link>
									</Button>
								</AnimatedGroup>
							</div>
						</div>

						<AnimatedGroup
							variants={{
								container: {
									visible: {
										transition: {
											staggerChildren: 0.05,
											delayChildren: 0.75,
										},
									},
								},
								...transitionVariants,
							}}
						>
							<div className="flex flex-col items-center justify-center gap-8 mt-12 mb-10 w-full">
								<div className="text-muted-foreground text-sm">
									{config.animatedTooltipTitle}
								</div>
								<AnimatedTooltip items={animatedTooltipItems} />
							</div>
						</AnimatedGroup>

						<AnimatedGroup
							variants={{
								container: {
									visible: {
										transition: {
											staggerChildren: 0.05,
											delayChildren: 0.75,
										},
									},
								},
								...transitionVariants,
							}}
						>
							<div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
								<div
									aria-hidden
									className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
								/>
								<div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-7xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
									<img
										className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
										src={config.images.dark.src}
										alt={config.images.dark.alt}
										width={config.images.dark.width}
										height={config.images.dark.height}
									/>
									<img
										className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
										src={config.images.light.src}
										alt={config.images.light.alt}
										width={config.images.light.width}
										height={config.images.light.height}
									/>
								</div>
							</div>
						</AnimatedGroup>
					</div>
				</section>
			</main>
		</>
	);
}
