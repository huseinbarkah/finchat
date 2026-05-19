import { NextResponse } from "next/server";
import { parseWithGemini, parseWithLocalNLP } from "@/lib/ai-engine";

// POST: Parse chat text with AI engine
export async function POST(request) {
  try {
    const { text, customRules = [], useLocal = false } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' field" }, { status: 400 });
    }

    let result;
    if (useLocal) {
      result = parseWithLocalNLP(text, customRules);
    } else {
      result = await parseWithGemini(text, customRules);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI Parse] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
