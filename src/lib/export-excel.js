/**
 * FinChat.AI — Excel Export Engine
 */
import ExcelJS from "exceljs";
import { formatRupiah, formatDateID } from "./utils";

/**
 * Generate Excel buffer from transactions array
 */
export async function generateExcel(transactions, orgName = "FinChat.AI", period = "Mei 2026") {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FinChat.AI";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Laporan Keuangan", {
    views: [{ showGridLines: false }]
  });

  // --- Title & Header ---
  sheet.mergeCells("A1:H1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `LAPORAN ARUS KAS - ${orgName.toUpperCase()}`;
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF0F172A" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("A2:H2");
  const subTitleCell = sheet.getCell("A2");
  subTitleCell.value = `Periode: ${period} | Dicetak: ${formatDateID(new Date())}`;
  subTitleCell.font = { name: "Arial", size: 10, italic: true, color: { argb: "FF475569" } };
  subTitleCell.alignment = { vertical: "middle", horizontal: "center" };

  sheet.addRow([]); // empty row

  // --- Column definitions ---
  sheet.columns = [
    { header: "No", key: "no", width: 6 },
    { header: "Tanggal", key: "date", width: 15 },
    { header: "Pengirim", key: "sender", width: 25 },
    { header: "Deskripsi", key: "desc", width: 40 },
    { header: "Kategori", key: "category", width: 20 },
    { header: "Debit (+)", key: "income", width: 18 },
    { header: "Kredit (-)", key: "expense", width: 18 },
    { header: "Status", key: "status", width: 15 }
  ];

  // Style the header row (row 4)
  const headerRow = sheet.getRow(4);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0F172A" } // Navy-850
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } }
    };
  });

  // --- Add Data ---
  transactions.forEach((t, idx) => {
    const isIncome = t.type === "INCOME";
    const row = sheet.addRow({
      no: idx + 1,
      date: formatDateID(t.createdAt),
      sender: t.whatsappSenderName || "Manual",
      desc: t.description || "",
      category: t.category,
      income: isIncome ? t.amount : null,
      expense: !isIncome ? t.amount : null,
      status: t.status
    });

    // Style data row
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "hair", color: { argb: "FFE2E8F0" } },
        bottom: { style: "hair", color: { argb: "FFE2E8F0" } },
        left: { style: "hair", color: { argb: "FFE2E8F0" } },
        right: { style: "hair", color: { argb: "FFE2E8F0" } }
      };
      cell.alignment = { vertical: "middle", horizontal: colNumber === 6 || colNumber === 7 ? "right" : "left" };
      if (colNumber === 1 || colNumber === 8) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
    });

    // Formatting currency columns
    row.getCell(6).numFmt = '"Rp" #,##0_ ;[Red]-"Rp" #,##0 ';
    row.getCell(7).numFmt = '"Rp" #,##0_ ;[Red]-"Rp" #,##0 ';
    
    // Coloring
    if (isIncome) {
      row.getCell(6).font = { color: { argb: "FF059669" }, bold: true }; // Emerald
    } else {
      row.getCell(7).font = { color: { argb: "FFE11D48" }, bold: true }; // Rose
    }
  });

  // --- Summary Rows ---
  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  sheet.addRow([]);

  const summaryStart = sheet.rowCount + 1;
  const totalIncomeRow = sheet.addRow({ category: "TOTAL PEMASUKAN", income: totalIncome });
  totalIncomeRow.getCell(5).font = { bold: true };
  totalIncomeRow.getCell(5).alignment = { horizontal: "right" };
  totalIncomeRow.getCell(6).font = { bold: true, color: { argb: "FF059669" } };
  totalIncomeRow.getCell(6).numFmt = '"Rp" #,##0_ ;[Red]-"Rp" #,##0 ';

  const totalExpenseRow = sheet.addRow({ category: "TOTAL PENGELUARAN", expense: totalExpense });
  totalExpenseRow.getCell(5).font = { bold: true };
  totalExpenseRow.getCell(5).alignment = { horizontal: "right" };
  totalExpenseRow.getCell(7).font = { bold: true, color: { argb: "FFE11D48" } };
  totalExpenseRow.getCell(7).numFmt = '"Rp" #,##0_ ;[Red]-"Rp" #,##0 ';

  const balanceRow = sheet.addRow({ category: "SALDO BERSIH", income: totalIncome - totalExpense });
  balanceRow.getCell(5).font = { bold: true, size: 12 };
  balanceRow.getCell(5).alignment = { horizontal: "right" };
  balanceRow.getCell(6).font = { bold: true, size: 12 };
  balanceRow.getCell(6).numFmt = '"Rp" #,##0_ ;[Red]-"Rp" #,##0 ';
  
  // Return buffer
  return await workbook.xlsx.writeBuffer();
}
