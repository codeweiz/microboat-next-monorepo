export interface StorageProvider {
	getSignedUrl(params: SignedUrlParams): Promise<string>;
	getSignedUploadUrl(params: SignedUploadUrlParams): Promise<string>;
}

export interface SignedUrlParams {
	bucket: string;
	key: string;
	expiresIn: number;
}

export interface SignedUploadUrlParams {
	bucket: string;
	key: string;
	contentType: string;
}
