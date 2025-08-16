import { Avatar, AvatarFallback, AvatarImage } from "@microboat/web/components/ui/avatar";
import { appConfig } from "@microboat/web/config";
import { forwardRef, useMemo } from "react";

export const UserAvatar = forwardRef<
	HTMLSpanElement,
	{
		name: string;
		image?: string | null;
		className?: string;
	}
>(({ name, image, className }, ref) => {
	const initials = useMemo(
		() =>
			name
				.split(" ")
				.slice(0, 2)
				.map((n) => n[0])
				.join(""),
		[name],
	);
	const avatarSrc = useMemo(
		() =>
			image
				? image.startsWith("http")
					? image
					: `/image-proxy/${appConfig.storage.bucketNames.avatars}/${image}`
				: undefined,
		[image],
	);

	return (
		<Avatar ref={ref} className={className}>
			<AvatarImage src={avatarSrc} />
			<AvatarFallback className="bg-primary/10 text-primary">
				{initials}
			</AvatarFallback>
		</Avatar>
	);
});

UserAvatar.displayName = "UserAvatar";
