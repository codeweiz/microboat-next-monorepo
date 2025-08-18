"use client";

import { useConfig } from "@microboat/common";
import { useMemo } from "react";
import { MailService } from "../service";

export function useMail() {
	const configService = useConfig();
	return useMemo(() => new MailService(configService), [configService]);
}