"use client";

import { motion } from "framer-motion";
import * as React from "react";

import { Badge } from "@microboat/web/components/ui/badge";
import { cn } from "@microboat/web/lib/utils";

interface TabProps {
	text: string;
	selected: boolean;
	setSelected: (text: string) => void;
	discount?: boolean;
	discountValue: number;
}

export function Tab({
	text,
	selected,
	setSelected,
	discount = false,
	discountValue,
}: TabProps) {
	return (
		<button
			onClick={() => setSelected(text)}
			type="button"
			className={cn(
				"relative w-fit px-4 py-2 text-sm font-semibold capitalize cursor-pointer",
				"text-foreground transition-colors",
				discount && "flex items-center justify-center gap-2.5",
			)}
		>
			<span className="relative z-10">{text}</span>
			{selected && (
				<motion.span
					layoutId="tab"
					transition={{ type: "spring", duration: 0.4 }}
					className="absolute inset-0 z-0 rounded-full bg-background shadow-sm"
				/>
			)}
			{discount && (
				<Badge
					variant="secondary"
					className={cn(
						"relative z-10 whitespace-nowrap shadow-none",
						selected && "bg-muted",
					)}
				>
					Save {discountValue}%
				</Badge>
			)}
		</button>
	);
}
