"use client";

import { useConfig } from "@microboat/common";
import Script from "next/script";

export default function AffonsoScript() {
	const config = useConfig();
	
	if (process.env.NODE_ENV !== "production") {
		return null;
	}

	if (!config.getAffiliate().affonso.enabled) {
		return null;
	}

	const affiliateId = config.getAffiliate().affonso.id;
	if (!affiliateId) {
		return null;
	}

	return (
		<Script
			src="https://affonso.io/js/pixel.min.js"
			strategy="afterInteractive"
			data-affonso={affiliateId}
			data-cookie_duration="30"
		/>
	);
}
