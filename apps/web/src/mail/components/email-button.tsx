import { Button } from "@react-email/components";
import React, { type PropsWithChildren } from "react";

export default function EmailButton({
	href,
	children,
}: PropsWithChildren<{
	href: string;
}>) {
	return (
		<Button
			href={href}
			className="rounded-md bg-primary px-4 py-2 text-lg text-primary-foreground"
		>
			{children}
		</Button>
	);
}
