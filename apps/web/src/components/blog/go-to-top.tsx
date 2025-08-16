"use client";

import { cn } from "@microboat/web/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function GoToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 800) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			type="button"
			aria-label="Go to top"
			onClick={scrollToTop}
			className={cn(
				"rounded-full p-3 w-12",
				"bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm",
				"hover:bg-white dark:hover:bg-gray-900 transition-all duration-300 cursor-pointer",
				isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
				"md:right-16",
			)}
		>
			<ArrowUp className="text-secondary-foreground hover:text-secondary-foreground/80" />
		</button>
	);
}
