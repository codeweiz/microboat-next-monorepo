import { Button } from "@microboat/web/components/ui/button";
import { getFooterData } from "@microboat/web/config/footer";
import Link from "next/link";

export function SocialButton() {
	const footerData = getFooterData();
	return (
		<>
			<h3 className="mb-4 text-lg font-semibold">{footerData.social.title}</h3>
			<div className="mb-6 flex space-x-4">
				{footerData.social.media.map((item, index) => (
					<Button
						key={index}
						variant="outline"
						size="icon"
						className="rounded-full cursor-pointer"
					>
						<Link href={item.href} target="_blank" rel="noreferrer">
							{item.icon}
							<span className="sr-only">{item.name}</span>
						</Link>
					</Button>
				))}
			</div>
		</>
	);
}
