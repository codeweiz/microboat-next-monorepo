import { getPaymentProvider } from "@microboat/payment";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.text();
		const signature = request.headers.get("stripe-signature") || "";

		if (!signature || !body) {
			return NextResponse.json(
				{ error: "Missing stripe-signature header or body" },
				{ status: 400 },
			);
		}

		console.log("Stripe webhook received", JSON.stringify(body, null, 2));

		await getPaymentProvider().handleWebhook(body, signature);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{ error: "Webhook handler failed" },
			{ status: 400 },
		);
	}
}
