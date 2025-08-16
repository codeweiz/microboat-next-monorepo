import type { AuthClientErrorCodes } from "@microboat/web/lib/auth/client";
import { useTranslations } from "next-intl";

export function useAuthErrorMessages() {
	const t = useTranslations();

	const authErrorMessages: Partial<AuthClientErrorCodes> = {
		USER_NOT_FOUND: t("auth.errors.userNotFound"),
		FAILED_TO_CREATE_USER: t("auth.errors.failedToCreateUser"),
		FAILED_TO_CREATE_SESSION: t("auth.errors.failedToCreateSession"),
		FAILED_TO_UPDATE_USER: t("auth.errors.failedToUpdateUser"),
		FAILED_TO_GET_SESSION: t("auth.errors.failedToGetSession"),
		INVALID_PASSWORD: t("auth.errors.invalidPassword"),
		INVALID_EMAIL: t("auth.errors.invalidEmail"),
		INVALID_TOKEN: t("auth.errors.invalidToken"),
		INVALID_EMAIL_OR_PASSWORD: t("auth.errors.invalidEmailOrPassword"),
		SOCIAL_ACCOUNT_ALREADY_LINKED: t("auth.errors.socialAccountAlreadyLinked"),
		CREDENTIAL_ACCOUNT_NOT_FOUND: t("auth.errors.credentialAccountNotFound"),
		EMAIL_CAN_NOT_BE_UPDATED: t("auth.errors.emailCanNotBeUpdated"),
		EMAIL_NOT_VERIFIED: t("auth.errors.emailNotVerified"),
		FAILED_TO_GET_USER_INFO: t("auth.errors.failedToGetUserInfo"),
		ID_TOKEN_NOT_SUPPORTED: t("auth.errors.idTokenNotSupported"),
		PASSWORD_TOO_LONG: t("auth.errors.passwordTooLong"),
		PASSWORD_TOO_SHORT: t("auth.errors.passwordTooShort"),
		PROVIDER_NOT_FOUND: t("auth.errors.providerNotFound"),
		USER_EMAIL_NOT_FOUND: t("auth.errors.userEmailNotFound"),
		USER_ALREADY_EXISTS: t("auth.errors.userAlreadyExists"),
		SESSION_EXPIRED: t("auth.errors.sessionExpired"),
		ACCOUNT_NOT_FOUND: t("auth.errors.accountNotFound"),
		FAILED_TO_UNLINK_LAST_ACCOUNT: t("auth.errors.failedToUnlinkLastAccount"),
	};

	const getAuthErrorMessage = (errorCode: string | undefined | any) => {
		let errorCodeString: string | undefined;

		if (typeof errorCode === "string") {
			errorCodeString = errorCode.toUpperCase();
		} else if (
			errorCode &&
			typeof errorCode === "object" &&
			"code" in errorCode
		) {
			errorCodeString =
				typeof errorCode.code === "string"
					? errorCode.code.toUpperCase()
					: undefined;
		} else {
			errorCodeString = undefined;
		}

		return (
			authErrorMessages[errorCodeString as keyof typeof authErrorMessages] ||
			t("auth.errors.unknown")
		);
	};

	return {
		getAuthErrorMessage,
	};
}
