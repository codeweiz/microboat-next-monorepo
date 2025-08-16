"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@microboat/web/components/ui/alert-dialog";
import { Button } from "@microboat/web/components/ui/button";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { useSession } from "@microboat/web/lib/hooks/use-session";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function DeleteAccountForm() {
	const t = useTranslations();
	const { reloadSession } = useSession();
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { getAuthErrorMessage } = useAuthErrorMessages();

	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true);
			setError(null);
			setSuccess(null);

			const { error } = await authClient.deleteUser({});

			if (error) {
				setError(getAuthErrorMessage(error.code));
				throw error;
			}

			setSuccess(t("settings.account.deleteAccount.notifications.success"));

			reloadSession();
		} catch (error) {
			console.error("Error deleting account:", error);
			if (!error) {
				setError(t("settings.account.deleteAccount.notifications.error"));
			}
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold">
						{t("settings.account.deleteAccount.title")}
					</h2>
					<p className="text-sm text-muted-foreground mt-2">
						{t("settings.account.deleteAccount.description")}
					</p>
				</div>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							className="font-bold cursor-pointer text-destructive hover:bg-destructive/90 hover:text-destructive-foreground dark:hover:bg-destructive/90 dark:hover:text-destructive-foreground"
							disabled={isDeleting}
						>
							{isDeleting
								? t("settings.account.deleteAccount.deleting")
								: t("settings.account.deleteAccount.button")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.account.deleteAccount.title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("settings.account.deleteAccount.confirmation")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteAccount}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								disabled={isDeleting}
							>
								{isDeleting
									? t("settings.account.deleteAccount.deleting")
									: t("settings.account.deleteAccount.confirmButton")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			{/* Error and Success Messages */}
			<CustomFormMessage error={error} success={success} />
		</div>
	);
}
