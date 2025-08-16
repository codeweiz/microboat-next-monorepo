"use client";

import { appConfig } from "@microboat/web/config";
import { cn } from "@microboat/web/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const Logo = ({ className }: { className?: string }) => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const logoLight = appConfig.metadata.images?.logoLight ?? "/logo.png";
	const logoDark = appConfig.metadata.images?.logoDark ?? logoLight;

	const logo = mounted && resolvedTheme === "dark" ? logoDark : logoLight;

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Image
			src={logo}
			alt="Logo"
			title="Logo"
			width={96}
			height={96}
			className={cn("size-8", className)}
		/>
	);
};
