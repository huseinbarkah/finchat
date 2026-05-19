/**
 * FinChat.AI — CSV Export Engine
 */
import { formatRupiah, formatDateID } from "./utils";

/**
 * Generate CSV string from transactions array
 */
export function generateCSV(transactions, orgName = "FinChat.AI") {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const headers = [
    "No",
    "Tanggal",
    "Pengirim",
    "Deskripsi",
    "Kategori",
    "Jenis",
    "Nominal (IDR)",
    "Status",
  ];

  let csv = BOM + headers.join(",") + "\n";

  transactions.forEach((t, idx) => {
    const row = [
      idx + 1,
      `"${formatDateID(t.createdAt)}"`,
      `"${(t.whatsappSenderName || "Manual").replace(/"/g, '""')}"`,
      `"${(t.description || "").replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.type === "INCOME" ? "Pemasukan" : "Pengeluaran",
      t.type === "INCOME" ? t.amount : -t.amount,
      `"${t.status}"`,
    ];
    csv += row.join(",") + "\n";
  });

  // Summary rows
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  csv += "\n";
  csv += `,,,,,"Total Pemasukan",${totalIncome},\n`;
  csv += `,,,,,"Total Pengeluaran",-${totalExpense},\n`;
  csv += `,,,,,"Saldo Bersih",${totalIncome - totalExpense},\n`;
  csv += `\n"Laporan digenerate oleh ${orgName} via FinChat.AI",,,,,,\n`;

  return csv;
}
