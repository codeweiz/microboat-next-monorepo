import { appConfigService } from "@microboat/web/config/app-config-service";
import { S3StorageProvider } from "@microboat/web/storage/providers/s3";
import type { StorageProvider } from "@microboat/web/storage/types";

const providers = {
	s3: S3StorageProvider,
} as const;

let storageProviderInstance: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
	if (storageProviderInstance) {
		return storageProviderInstance;
	}

	const provider = appConfigService.getStorage().provider as keyof typeof providers;
	storageProviderInstance = new providers[provider]();
	return storageProviderInstance;
}
