import { CircleCheckIcon, CircleXIcon } from "lucide-react";

interface CustomFormMessageProps {
	success?: string;
	error?: string;
}

export const CustomFormMessage = ({
	success,
	error,
}: CustomFormMessageProps) => {
	if (!success && !error) {
		return null;
	}

	return (
		<div className="flex items-center gap-x-2">
			{success && (
				<div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
					<CircleCheckIcon className="h-6 w-6" />
					<p>{success}</p>
				</div>
			)}
			{error && (
				<div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
					<CircleXIcon className="h-6 w-6" />
					<p>{error}</p>
				</div>
			)}
		</div>
	);
};
