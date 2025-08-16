import type {
	SignedUploadUrlParams,
	SignedUrlParams,
	StorageProvider,
} from "@microboat/web/storage/types";
import { AwsClient } from "aws4fetch";

export class S3StorageProvider implements StorageProvider {
	private awsClient: AwsClient;
	private accountId: string;

	constructor() {
		const region = process.env.STORAGE_REGION;
		const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
		const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
		const accountId = process.env.STORAGE_ACCOUNT_ID;

		if (!region || !accessKeyId || !secretAccessKey || !accountId) {
			throw new Error(
				"STORAGE_REGION, STORAGE_ACCESS_KEY_ID, STORAGE_SECRET_ACCESS_KEY, and STORAGE_ACCOUNT_ID must be set",
			);
		}

		this.awsClient = new AwsClient({
			region,
			service: "s3",
			accessKeyId,
			secretAccessKey,
		});

		this.accountId = accountId;
	}

	async getSignedUrl({
		bucket,
		key,
		expiresIn = 3600,
	}: SignedUrlParams): Promise<string> {
		try {
			const url = new URL(
				`https://${this.accountId}.r2.cloudflarestorage.com/${bucket}/${key}`,
			);

			url.searchParams.set("X-Amz-Expires", expiresIn.toString());

			const signedRequest = await this.awsClient.sign(url, {
				method: "GET",
				aws: { signQuery: true },
			});

			if (!signedRequest?.url) {
				throw new Error("Failed to generate signed URL");
			}

			return signedRequest.url;
		} catch (e) {
			console.error("Could not get signed url", e);
			throw new Error("Could not get signed url");
		}
	}

	async getSignedUploadUrl({
		bucket,
		key,
		contentType,
	}: SignedUploadUrlParams): Promise<string> {
		try {
			const expiresIn = 60 * 5; // 5 minutes

			const url = new URL(
				`https://${this.accountId}.r2.cloudflarestorage.com/${bucket}/${key}`,
			);

			url.searchParams.set("X-Amz-Expires", expiresIn.toString());

			if (contentType) {
				url.searchParams.set("Content-Type", contentType);
			}

			const signedRequest = await this.awsClient.sign(url, {
				method: "PUT",
				aws: { signQuery: true },
			});

			if (!signedRequest?.url) {
				throw new Error("Failed to generate signed upload URL");
			}

			return signedRequest.url;
		} catch (e) {
			console.error("Could not get signed upload url", e);
			throw new Error("Could not get signed upload url");
		}
	}
}
