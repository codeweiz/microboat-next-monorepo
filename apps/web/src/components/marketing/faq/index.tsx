import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@microboat/web/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@microboat/web/components/ui/avatar";
import { Button } from "@microboat/web/components/ui/button";
import { getFaqConfig } from "@microboat/web/config/marketing/faq";

const Faq = () => {
	const config = getFaqConfig();

	return (
		<section id="faq" className="py-8 md:py-16 px-8 md:px-0">
			<div className="mx-auto container space-y-8 md:space-y-16">
				<div className="mx-auto flex max-w-3xl flex-col text-left md:text-center">
					<h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl">
						{config.heading}
					</h2>
					<p className="text-muted-foreground lg:text-lg">
						{config.description}
					</p>
				</div>
				<Accordion
					type="single"
					collapsible
					className="mx-auto w-full lg:max-w-3xl"
				>
					{config.items.map((item, index) => (
						<AccordionItem
							key={`${item.id}-${index}`}
							value={`${item.id}-${index}`}
						>
							<AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60 cursor-pointer">
								<div className="font-medium sm:py-1 lg:py-2 lg:text-lg">
									{item.question}
								</div>
							</AccordionTrigger>
							<AccordionContent className="sm:mb-1 lg:mb-2">
								<div className="text-muted-foreground lg:text-lg">
									{item.answer}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				<div className="mx-auto flex max-w-4xl flex-col items-center rounded-lg bg-accent p-4 text-center md:rounded-xl md:p-6 lg:p-8">
					<div className="relative">
						<Avatar className="absolute mb-4 size-16 origin-bottom -translate-x-[60%] scale-[80%] border md:mb-5">
							<AvatarImage src={config.avatars[0].src} alt={config.avatars[0].alt} />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="absolute mb-4 size-16 origin-bottom translate-x-[60%] scale-[80%] border md:mb-5">
							<AvatarImage src={config.avatars[1].src} alt={config.avatars[1].alt} />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
						<Avatar className="mb-4 size-16 border md:mb-5">
							<AvatarImage src={config.avatars[2].src} alt={config.avatars[2].alt} />
							<AvatarFallback>SU</AvatarFallback>
						</Avatar>
					</div>
					<h3 className="mb-2 max-w-3xl font-semibold lg:text-lg">
						{config.supportHeading}
					</h3>
					<p className="mb-8 max-w-3xl text-muted-foreground lg:text-lg">
						{config.supportDescription}
					</p>
					<div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
						<Button className="w-full sm:w-auto" asChild>
							<a href={config.supportButtonUrl} rel="noreferrer">
								{config.supportButtonText}
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export { Faq };
