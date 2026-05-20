/**
 * FinChat.AI — AI Engine (Structured Parsing)
 * Supports: Google Gemini (primary), Local NLP fallback
 */

const SYSTEM_PROMPT = `Kamu adalah Akuntan Profesional Indonesia yang SANGAT KETAT dalam menganalisis pesan chat WhatsApp kasual menjadi data transaksi keuangan terstruktur.

ATURAN PARSING NOMINAL (WAJIB DIIKUTI):
- "goceng" / "5k" = 5000
- "ceban" / "10k" = 10000
- "gocap" / "50k" = 50000
- "cepek" / "100k" = 100000
- "500rb" / "500ribu" / "500 ribu" = 500000
- "1.5jt" / "1,5juta" / "1.5 juta" / "satu setengah juta" = 1500000
- "2ratus rebu" / "200rb" = 200000
- "sejuta" = 1000000
- "1M" = 1000000000
- "5M" = 5000000000
- "10M" = 10000000000 (M = MILYAR)
- Angka tanpa suffix = nilai literal dalam rupiah
- SELALU konversi ke integer tanpa titik/koma

ATURAN TIPE TRANSAKSI:
- EXPENSE (pengeluaran): kata kunci "beli", "bayar", "keluar", "buat", "cetak", "fotokopi", "ongkir", "ongkos", "sewa", "tagihan", "cicilan", "kulakan"
- INCOME (pemasukan): kata kunci "terima", "masuk", "donasi", "gaji", "penjualan", "iuran", "kas masuk", "transfer masuk", "dapat", "pemasukan"
- Jika ambigu, default ke EXPENSE

ATURAN KATEGORI:
- Identifikasi konteks kalimat untuk menentukan kategori yang paling tepat
- Gunakan kategori standar: "Konsumsi", "Transportasi", "Alat Kantor", "Operasional", "Logistik", "Donasi", "Gaji", "Penjualan", "Bahan Baku", "Lain-lain"

RESPONSE FORMAT (JSON ONLY, tanpa markdown/backtick):
{
  "type": "income" atau "expense",
  "amount": integer murni (contoh: 150000),
  "category": string kategori,
  "description": string ringkas esensi transaksi (maksimal 10 kata),
  "is_valid": true/false
}

PENTING:
- Jika pesan TIDAK mengandung data keuangan yang jelas, set is_valid = false
- JANGAN pernah mengembalikan amount = 0 jika is_valid = true
- SELALU kembalikan JSON murni tanpa backtick atau markdown wrapper`;

/**
 * Parse chat message using Google Gemini AI
 */
export async function parseWithGemini(text, customRules = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[AI Engine] No GEMINI_API_KEY found, falling back to local NLP");
    return parseWithLocalNLP(text, customRules);
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    let enhancedPrompt = SYSTEM_PROMPT;
    if (customRules.length > 0) {
      enhancedPrompt += "\n\nATURAN KUSTOM ORGANISASI:\n";
      customRules.forEach((r) => {
        let typeStr = "";
        if (r.type === "income") typeStr = ' sebagai INCOME (pemasukan) dan';
        else if (r.type === "expense") typeStr = ' sebagai EXPENSE (pengeluaran) dan';
        enhancedPrompt += `- Jika mengandung kata "${r.keyword}", klasifikasikan${typeStr} ke kategori "${r.category}"\n`;
      });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: enhancedPrompt + "\n\nAnalisis pesan berikut:\n\"" + text + "\"" },
          ],
        },
      ],
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    // Validate response structure
    if (
      typeof parsed.type !== "string" ||
      typeof parsed.amount !== "number" ||
      typeof parsed.is_valid !== "boolean"
    ) {
      console.warn("[AI Engine] Invalid response structure from Gemini, falling back to local NLP");
      return parseWithLocalNLP(text, customRules);
    }

    return {
      success: parsed.is_valid,
      type: parsed.type === "income" ? "income" : "expense",
      amount: Math.round(Math.abs(parsed.amount)),
      category: parsed.category || "Lain-lain",
      description: parsed.description || text.substring(0, 50),
    };
  } catch (error) {
    console.error("[AI Engine] Gemini API error:", error.message);
    return parseWithLocalNLP(text, customRules);
  }
}

/**
 * Local NLP fallback parser (works without API keys)
 */
export function parseWithLocalNLP(text, customRules = [], categories = []) {
  const cleanText = text.toLowerCase().trim();

  let amount = 0;
  let type = "expense";
  let category = "Lain-lain";

  // 1. Process custom AI rules
  let matchedCategory = null;
  let matchedType = null;
  for (const rule of customRules) {
    if (cleanText.includes(rule.keyword.toLowerCase())) {
      matchedCategory = rule.category;
      if (rule.type && rule.type !== "auto") {
        matchedType = rule.type;
      }
      break;
    }
  }

  // 2. Extract monetary amount from Indonesian slang
  if (cleanText.includes("goceng")) amount = 5000;
  else if (cleanText.includes("ceban")) amount = 10000;
  else if (cleanText.includes("gocap")) amount = 50000;
  else if (cleanText.includes("cepek")) amount = 100000;
  else if (cleanText.includes("sejuta")) amount = 1000000;
  else {
    // Strategy A: Look for numbers with financial suffixes (k, rb, ribu, jt, juta)
    const suffixRegex = /(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta)\b/g;
    const suffixMatches = [...cleanText.matchAll(suffixRegex)];

    if (suffixMatches.length > 0) {
      const match = suffixMatches[0];
      let baseVal = parseFloat(match[1].replace(",", "."));
      let suffix = match[2].toLowerCase();

      if (suffix === "k" || suffix === "rb" || suffix === "ribu") {
        amount = baseVal * 1000;
      } else if (suffix === "jt" || suffix === "juta") {
        amount = baseVal * 1000000;
      }
    } else {
      // Strategy B: Look for numbers with "rp" prefix
      const rpRegex = /rp\.?\s*(\d+(?:[.,]\d+)*)/g;
      const rpMatches = [...cleanText.matchAll(rpRegex)];

      if (rpMatches.length > 0) {
        const rawNumStr = rpMatches[0][1].replace(/[.,]/g, "");
        amount = parseInt(rawNumStr) || 0;
      } else {
        // Strategy C: Extract all raw numbers and pick the largest one (to avoid quantity numbers like "2" in "2liter")
        const numberRegex = /\b\d+(?:[.,]\d+)*\b/g;
        const numbers = (cleanText.match(numberRegex) || [])
          .map(numStr => {
            const cleanNum = numStr.replace(/[.,]/g, "");
            return parseInt(cleanNum) || 0;
          })
          .filter(n => n > 0);

        if (numbers.length > 0) {
          amount = Math.max(...numbers);
        }
      }
    }
  }

  if (amount === 0) {
    return { success: false, type: "expense", amount: 0, category: "Lain-lain", description: text };
  }

  amount = Math.round(amount);

  // 3. Determine type (income vs expense)
  const incomeKeywords = ["terima", "masuk", "donasi", "iuran", "gaji", "penjualan", "kas masuk", "dapat", "pemasukan"];
  const expenseKeywords = ["beli", "bayar", "keluar", "buat", "cetak", "fotokopi", "sewa", "ongkir", "kulakan", "tagihan"];

  if (matchedType) {
    type = matchedType;
  } else {
    for (const kw of incomeKeywords) {
      if (cleanText.includes(kw)) {
        type = "income";
        break;
      }
    }
  }

  // 4. Determine category
  if (matchedCategory) {
    category = matchedCategory;
  } else if (cleanText.match(/bensin|ojek|grab|gojek|transportasi|parkir/)) {
    category = "Transportasi";
  } else if (cleanText.match(/makan|kopi|snack|nasi|bakso|minum|konsumsi|catering/)) {
    category = "Konsumsi";
  } else if (cleanText.match(/fotokopi|spidol|kertas|alat|print|cetak|atk/)) {
    category = "Alat Kantor";
  } else if (cleanText.match(/donasi|sumbangan/)) {
    category = "Donasi";
  } else if (cleanText.match(/iuran|kas/)) {
    category = categories.includes("Kas Kelas") ? "Kas Kelas" : "Donasi";
  } else if (cleanText.match(/gaji|upah|honor/)) {
    category = "Gaji";
  } else if (cleanText.match(/jual|penjualan|kassa/)) {
    category = "Penjualan";
  } else if (cleanText.match(/bahan|biji|ingredient/)) {
    category = "Bahan Baku";
  } else if (cleanText.match(/sewa|listrik|air|wifi/)) {
    category = "Operasional";
  }

  // Generate description
  let description = text.length > 60 ? text.substring(0, 57) + "..." : text;

  return { success: true, type, amount, category, description };
}
