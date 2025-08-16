import React from "react";
import type { SVGProps } from "react";

const Vercel = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 24 24"
		{...props}
		>
			<title>Vercel</title>
		<path fill="currentColor" d="M24 22.525H0l12-21.05z" />
	</svg>
);

export default Vercel;
