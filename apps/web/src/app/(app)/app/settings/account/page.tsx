"use client";

import { ChangeAvatarForm } from "@microboat/web/components/settings/account/change-avatar-form";
import { ChangeLanguageForm } from "@microboat/web/components/settings/account/change-language-form";
import { ChangeNameEmailForm } from "@microboat/web/components/settings/account/change-name-email-form";
import { DeleteAccountForm } from "@microboat/web/components/settings/account/delete-account-form";
import { Separator } from "@microboat/web/components/ui/separator";
import { useTranslations } from "next-intl";

export default function AccountPage() {
	const t = useTranslations("settings.account");

	return (
		<div className="space-y-8 md:space-y-16">
			<ChangeNameEmailForm />
			<ChangeAvatarForm />

			<ChangeLanguageForm />

			<Separator />

			{/* Delete Account Section */}
			<DeleteAccountForm />
		</div>
	);
}
