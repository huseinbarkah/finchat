import { NextResponse } from "next/server";
import { generateCSV } from "@/lib/export-csv";

// POST: Generate CSV from transactions
export async function POST(request) {
  try {
    const { transactions, orgName } = await request.json();

    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json({ error: "Missing transactions array" }, { status: 400 });
    }

    const csv = generateCSV(transactions, orgName);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="finchat_report.csv"`,
      },
    });
  } catch (error) {
    console.error("[CSV Export] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
