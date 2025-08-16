import { Footer } from "@microboat/web/components/shared/footer";
import { Header } from "@microboat/web/components/shared/header";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col">
			<Header />
			{children}
			<Footer />
		</div>
	);
}
