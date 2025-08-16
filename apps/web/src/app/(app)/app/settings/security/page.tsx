"use client";

import { ChangePasswordForm } from "@microboat/web/components/settings/security/change-password";
import { ConnectSocialAccountForm } from "@microboat/web/components/settings/security/connect-social-account";
import { useUserAccountsQuery } from "@microboat/web/lib/auth/api";

export default function SecurityPage() {
	const { data: accounts, isPending } = useUserAccountsQuery();

	return (
		<div className="space-y-12">
			<ChangePasswordForm accounts={accounts} isPending={isPending} />
			<ConnectSocialAccountForm accounts={accounts} isPending={isPending} />
		</div>
	);
}
