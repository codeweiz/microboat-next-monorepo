import { ArrowUpRight } from "lucide-react";

import { Badge } from "@microboat/web/components/ui/badge";
import { Button } from "@microboat/web/components/ui/button";

export type ChangelogEntry = {
	version: string;
	date: string;
	title: string;
	description: string;
	items?: string[];
	image?: string;
	button?: {
		url: string;
		text: string;
	};
};

export interface ChangelogProps {
	title?: string;
	description?: string;
	entries?: ChangelogEntry[];
	className?: string;
}

export const Changelog = ({
	title,
	description,
	entries = [],
}: ChangelogProps) => {
	return (
		<section className="py-32 px-8 flex justify-center">
			<div className="container mx-auto max-w-6xl">
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="mx-auto mb-4 text-3xl font-bold tracking-tight md:text-4xl">
						{title}
					</h1>
					<p className="mx-auto mb-6 text-base text-muted-foreground md:text-lg">
						{description}
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
					{entries.map((entry, index) => (
						<div
							key={index}
							className="relative flex flex-col gap-4 md:flex-row md:gap-16"
						>
							<div className="top-20 flex h-min w-64 shrink-0 items-center gap-4 md:sticky">
								<Badge variant="secondary" className="text-xs">
									{entry.version}
								</Badge>
								<span className="text-xs font-medium text-muted-foreground">
									{entry.date}
								</span>
							</div>
							<div className="flex flex-col">
								<h2 className="mb-3 text-lg leading-tight font-bold text-foreground/90 md:text-2xl">
									{entry.title}
								</h2>
								<p className="text-sm text-muted-foreground md:text-base">
									{entry.description}
								</p>
								{entry.items && entry.items.length > 0 && (
									<ul className="mt-4 ml-4 space-y-1.5 text-sm text-muted-foreground md:text-base">
										{entry.items.map((item, itemIndex) => (
											<li key={itemIndex} className="list-disc">
												{item}
											</li>
										))}
									</ul>
								)}
								{entry.image && (
									<img
										src={entry.image}
										alt={`${entry.version} visual`}
										className="mt-8 w-full rounded-lg object-cover"
									/>
								)}
								{entry.button && (
									<Button variant="link" className="mt-4 self-end" asChild>
										<a href={entry.button.url} target="_blank" rel="noreferrer">
											{entry.button.text} <ArrowUpRight className="h-4 w-4" />
										</a>
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
