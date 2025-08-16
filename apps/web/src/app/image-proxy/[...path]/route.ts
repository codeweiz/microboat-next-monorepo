import { appConfig } from "@microboat/web/config";
import { getStorageProvider } from "@microboat/web/storage/providers";
import { NextResponse } from "next/server";

export const GET = async (
	_req: Request,
	{ params }: { params: Promise<{ path: string[] }> },
) => {
	const { path } = await params;

	const [bucket, filePath] = path;

	console.log("bucket", bucket);
	console.log("filePath", filePath);

	if (!(bucket && filePath)) {
		return new Response("Invalid path", { status: 400 });
	}

	if (bucket === appConfig.storage.bucketNames.avatars) {
		const signedUrl = await getStorageProvider().getSignedUrl({
			bucket,
			key: filePath,
			expiresIn: 60 * 60,
		});

		return NextResponse.redirect(signedUrl, {
			headers: { "Cache-Control": "max-age=3600" },
		});
	}

	return new Response("Not found", {
		status: 404,
		headers: {
			"X-Custom-Bucket": bucket,
			"X-Custom-File-Path": filePath,
		},
	});
};
