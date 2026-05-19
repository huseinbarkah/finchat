/**
 * FinChat.AI — WhatsApp Cloud API Helpers
 */
import axios from "axios";

const API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_TOKEN = process.env.WHATSAPP_API_TOKEN;

/**
 * Verify webhook token handshake from Meta
 */
export function verifyWebhookToken(mode, token, challenge) {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    return { valid: true, challenge };
  }
  return { valid: false };
}

/**
 * Parse incoming webhook payload to extract message details
 */
export function parseIncomingMessage(payload) {
  try {
    const entry = payload?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages || value.messages.length === 0) {
      return null;
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    // Only process text messages
    if (message.type !== "text") {
      return null;
    }

    return {
      from: message.from, // Sender phone number
      body: message.text?.body || "", // Message text
      messageId: message.id, // Unique message ID for idempotency
      timestamp: message.timestamp,
      senderName: contact?.profile?.name || "Unknown",
    };
  } catch (error) {
    console.error("[WhatsApp] Error parsing incoming message:", error);
    return null;
  }
}

/**
 * Send text reply back to WhatsApp user via Graph API
 */
export async function sendReplyMessage(to, text) {
  if (!PHONE_NUMBER_ID || !API_TOKEN) {
    console.warn("[WhatsApp] Missing API credentials, skipping reply");
    return false;
  }

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (error) {
    console.error("[WhatsApp] Error sending reply:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Format confirmation message for successful transaction
 */
export function formatConfirmationMessage(transaction, balance) {
  const { formatRupiah } = require("./utils");
  const typeLabel = transaction.type === "INCOME" ? "Pemasukan (+)" : "Pengeluaran (-)";

  return (
    `✅ *TRANSAKSI BERHASIL DICATAT*\n\n` +
    `📋 *Kategori:* ${transaction.category}\n` +
    `💰 *Nominal:* ${formatRupiah(transaction.amount)}\n` +
    `📊 *Jenis:* ${typeLabel}\n` +
    `📝 *Deskripsi:* ${transaction.description}\n\n` +
    `💼 *Saldo Saat Ini:* ${formatRupiah(balance)}\n\n` +
    `_Tercatat otomatis oleh FinChat.AI_`
  );
}
