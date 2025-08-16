import {initOpenNextCloudflareForDev} from "@opennextjs/cloudflare";
import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "**",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);