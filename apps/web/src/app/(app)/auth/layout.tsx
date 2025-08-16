import { LegalFooter } from "@microboat/web/components/shared/footer/legal-footer";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center gap-2 p-6">
				{children}
			</div>
			<div className="container max-w-4xl mx-auto pb-6">
				<LegalFooter showBorder={false} />
			</div>
		</div>
	);
}
