"use client";

import { CustomFormMessage } from "@microboat/web/components/shared/custom-form-message";
import { Label } from "@microboat/web/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@microboat/web/components/ui/select";
import { appConfig } from "@microboat/web/config";
import { updateLocale } from "@microboat/web/i18n/lib/update-locale";
import { useRouter } from "@microboat/web/i18n/navigation";
import { authClient } from "@microboat/web/lib/auth/client";
import { useAuthErrorMessages } from "@microboat/web/lib/auth/errors";
import { useLocaleStore } from "@microboat/web/lib/stores/use-locale-store";
import { type Locale, useTranslations } from "next-intl";
import { useState } from "react";

export function ChangeLanguageForm() {
	const { currentLocale, setCurrentLocale } = useLocaleStore();
	const t = useTranslations();
	const router = useRouter();
	const { getAuthErrorMessage } = useAuthErrorMessages();
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const saveLocale = async (newLocale: Locale) => {
		console.log("saveLocale", newLocale);
		try {
			setError(null);
			setSuccess(null);
			setIsUpdating(true);

			const { error: updateError } = await authClient.updateUser({
				locale: newLocale,
			});

			if (updateError) {
				setError(getAuthErrorMessage(updateError.code));
				return;
			}
			await updateLocale(newLocale);
			router.refresh();
		} catch (err) {
			setError(getAuthErrorMessage(err));
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<div className="space-y-8">
			{/* Language Settings Section */}
			<div>
				<div className="mb-6">
					<h2 className="text-xl font-semibold">
						{t("settings.account.languageSettings.title")}
					</h2>
					<p className="text-sm text-muted-foreground">
						{t("settings.account.languageSettings.description")}
					</p>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>
								{t("settings.account.languageSettings.language.title")}
							</Label>
						</div>
						<Select
							value={currentLocale}
							onValueChange={(value) => {
								setCurrentLocale(value as Locale);
								saveLocale(value as Locale);
							}}
							disabled={isUpdating}
						>
							<SelectTrigger className="w-[200px]">
								<SelectValue placeholder="Select language">
									<span className="flex items-center gap-2">
										<span className="truncate">
											{
												appConfig.i18n.locales[
													currentLocale as keyof typeof appConfig.i18n.locales
												]?.name
											}
										</span>
									</span>
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{Object.entries(appConfig.i18n.locales).map(
									([localeKey, { name }]) => (
										<SelectItem key={localeKey} value={localeKey}>
											<span className="flex items-center gap-2">
												<span className="truncate">{name}</span>
											</span>
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>

					<CustomFormMessage success={success} error={error} />
				</div>
			</div>
		</div>
	);
}
