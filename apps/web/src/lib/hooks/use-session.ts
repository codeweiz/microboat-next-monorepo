import { SessionContext } from "@microboat/web/lib/auth/session-context";
import { useContext } from "react";

export const useSession = () => {
	const sessionContext = useContext(SessionContext);

	if (sessionContext === undefined) {
		throw new Error("useSession must be used within SessionProvider");
	}

	return sessionContext;
};
