"use client";

import { appConfig } from "@microboat/web/config";
import Script from "next/script";

export default function AffonsoScript() {
	if (process.env.NODE_ENV !== "production") {
		return null;
	}

	if (!appConfig.affiliate.affonso.enabled) {
		return null;
	}

	const affiliateId = appConfig.affiliate.affonso.id;
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
