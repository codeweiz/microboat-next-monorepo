import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";

import { Badge } from "@microboat/web/components/ui/badge";
import { Button } from "@microboat/web/components/ui/button";
import { getFeatureTabsConfig } from "@microboat/web/config/marketing/feature-tabs";
import Image from "next/image";
import Link from "next/link";

const FeatureTabs = () => {
	const { heading, description, tabs } = getFeatureTabsConfig();

	return (
		<div
			id="feature-tabs"
			className="container mx-auto w-full max-w-7xl mt-8 md:mt-20 px-4"
		>
			<div className="flex flex-col items-center gap-4 text-center">
				<h2 className="max-w-2xl font-semibold text-3xl md:text-4xl">
					{heading}
				</h2>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<Tabs defaultValue={tabs[0].value} className="mt-8">
				<TabsList className="container flex flex-col items-center justify-center gap-2 sm:flex-row md:gap-10">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<TabsTrigger
								key={`tab-trigger-${tab.value}`}
								value={tab.value}
								className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary cursor-pointer"
							>
								<Icon className="h-auto w-4 shrink-0" /> {tab.label}
							</TabsTrigger>
						);
					})}
				</TabsList>
				<div className="mx-auto mt-4 md:mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
					{tabs.map((tab) => (
						<TabsContent
							key={`tab-content-${tab.value}`}
							value={tab.value}
							className="grid place-items-center gap-5 md:gap-20 lg:grid-cols-2 lg:gap-10"
						>
							<div className="flex flex-col gap-1 md:gap-5">
								<Badge variant="outline" className="w-fit bg-background">
									{tab.content.badge}
								</Badge>
								<h3 className="text-3xl font-semibold lg:text-5xl">
									{tab.content.title}
								</h3>
								<p className="text-muted-foreground lg:text-lg">
									{tab.content.description}
								</p>
								<Button
									className="mt-2.5 w-fit gap-2 cursor-pointer font-bold"
									size="lg"
									asChild
								>
									<Link href={tab.content.link}>
										{tab.content.buttonText}
									</Link>
								</Button>
							</div>
							<Image
								src={tab.content.imageSrc}
								alt={tab.content.imageAlt}
								className="rounded-xl w-full h-full object-cover"
								width={600}
								height={300}
							/>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
};

export { FeatureTabs };
