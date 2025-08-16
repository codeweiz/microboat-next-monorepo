"use server";

import { actionClient } from "@microboat/web/lib/safe-action";
import { getStorageProvider } from "@microboat/web/storage/providers";
import { z } from "zod";

const signedUploadUrlSchema = z.object({
	bucket: z.string().min(1),
	key: z.string().min(1),
	contentType: z.string().min(1),
});

export const getSignedUploadUrl = actionClient
	.inputSchema(signedUploadUrlSchema)
	.outputSchema(z.string())
	.action(async ({ parsedInput: { bucket, key, contentType } }) => {
		const storageProvider = getStorageProvider();
		return await storageProvider.getSignedUploadUrl({
			bucket: bucket,
			key: key,
			contentType: contentType,
		});
	});
