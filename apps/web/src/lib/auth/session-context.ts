import type { Session } from "@microboat/web/lib/auth";
import React from "react";

export const SessionContext = React.createContext<
	| {
			session: Session["session"] | null;
			user: Session["user"] | null;
			loaded: boolean;
			reloadSession: () => Promise<void>;
	  }
	| undefined
>(undefined);
