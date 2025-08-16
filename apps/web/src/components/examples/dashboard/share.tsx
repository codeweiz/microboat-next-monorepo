"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@microboat/web/components/ui/avatar";
import { Button } from "@microboat/web/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@microboat/web/components/ui/card";
import { Input } from "@microboat/web/components/ui/input";
import { Label } from "@microboat/web/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@microboat/web/components/ui/select";
import { Separator } from "@microboat/web/components/ui/separator";

const people = [
	{
		name: "Olivia Martin",
		email: "m@example.com",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
	},
	{
		name: "Isabella Nguyen",
		email: "b@example.com",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
	},
	{
		name: "Sofia Davis",
		email: "p@example.com",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
	},
	{
		name: "Ethan Thompson",
		email: "e@example.com",
		avatar:
			"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
	},
];
export function CardsShare() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Share this document</CardTitle>
				<CardDescription>
					Anyone with the link can view this document.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-2">
					<Label htmlFor="link" className="sr-only">
						Link
					</Label>
					<Input
						id="link"
						value="http://example.com/link/to/document"
						className="h-8"
						readOnly
					/>
					<Button size="sm" variant="outline" className="shadow-none">
						Copy Link
					</Button>
				</div>
				<Separator className="my-4" />
				<div className="flex flex-col gap-4">
					<div className="text-sm font-medium">People with access</div>
					<div className="grid gap-6">
						{people.map((person) => (
							<div
								key={person.email}
								className="flex items-center justify-between gap-4"
							>
								<div className="flex items-center gap-4">
									<Avatar>
										<AvatarImage src={person.avatar} alt="Image" />
										<AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm leading-none font-medium">
											{person.name}
										</p>
										<p className="text-muted-foreground text-sm">
											{person.email}
										</p>
									</div>
								</div>
								<Select defaultValue="edit">
									<SelectTrigger className="ml-auto pr-2" aria-label="Edit">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent align="end">
										<SelectItem value="edit">Can edit</SelectItem>
										<SelectItem value="view">Can view</SelectItem>
									</SelectContent>
								</Select>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
