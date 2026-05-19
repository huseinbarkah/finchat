import { NextResponse } from "next/server";
import { verifyWebhookToken, parseIncomingMessage, sendReplyMessage, formatConfirmationMessage } from "@/lib/whatsapp";
import { parseWithGemini } from "@/lib/ai-engine";

// GET: Meta webhook verification handshake
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const result = verifyWebhookToken(mode, token, challenge);

  if (result.valid) {
    console.log("[Webhook] Token verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[Webhook] Token verification failed");
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST: Incoming WhatsApp message handler
export async function POST(request) {
  try {
    const payload = await request.json();

    // Always respond 200 to Meta to prevent retries
    const message = parseIncomingMessage(payload);
    if (!message) {
      return NextResponse.json({ status: "no_message" }, { status: 200 });
    }

    console.log(`[Webhook] Message from ${message.from}: "${message.body}"`);

    // TODO: In production, check idempotency via database (whatsappMessageId)
    // TODO: In production, check AllowedSenders via database

    // Parse with AI
    const parsed = await parseWithGemini(message.body, []);

    if (!parsed.success) {
      await sendReplyMessage(
        message.from,
        '❌ *AI Gagal Menyaring*\n\nSistem tidak mengenali nominal keuangan.\n\nCoba: "beli bensin goceng" atau "terima iuran kas 50k"'
      );
      return NextResponse.json({ status: "parse_failed" }, { status: 200 });
    }

    // TODO: In production, save to database via Prisma
    // TODO: In production, calculate real balance from database

    const mockBalance = 2000000;
    const transaction = {
      type: parsed.type.toUpperCase(),
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.description,
    };

    // Send confirmation reply
    const replyText = formatConfirmationMessage(transaction, mockBalance);
    await sendReplyMessage(message.from, replyText);

    return NextResponse.json({ status: "success", parsed }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
