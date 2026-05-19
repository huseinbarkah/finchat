/**
 * FinChat.AI — PDF Export Engine (Client-Side)
 * Uses jsPDF + jspdf-autotable for professional PDF generation
 */
import { formatRupiah, formatDateID } from "./utils";

/**
 * Generate and download PDF report
 */
export async function generatePDF(transactions, orgName = "FinChat.AI", period = "Mei 2026") {
  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.jsPDF || jspdfModule.default;
  const autoTableModule = await import("jspdf-autotable");
  const autoTable = autoTableModule.default || autoTableModule.autoTable;

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  // ===== KOP SURAT (LETTERHEAD) =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("LAPORAN ARUS KAS MASUK & KELUAR", pageWidth / 2, currentY + 8, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(orgName.toUpperCase(), pageWidth / 2, currentY + 15, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "Sistem Laporan Otomatis via FinChat.AI Engine",
    pageWidth / 2,
    currentY + 20,
    { align: "center" }
  );

  // Header line
  currentY += 24;
  doc.setDrawColor(0);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);

  // ===== METADATA =====
  currentY += 7;
  doc.setTextColor(60);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const printDate = formatDateID(new Date());
  doc.text(`Periode Laporan: ${period}`, margin, currentY);
  doc.text(`Tanggal Cetak: ${printDate}`, pageWidth - margin, currentY, {
    align: "right",
  });
  currentY += 4;
  doc.text("Klasifikasi: Laporan Publik", margin, currentY);
  doc.text("Mata Uang: IDR (Rupiah)", pageWidth - margin, currentY, {
    align: "right",
  });

  // ===== TABEL TRANSAKSI =====
  currentY += 8;

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  const tableData = transactions.map((t, idx) => [
    idx + 1,
    formatDateID(t.createdAt),
    (t.description || "").substring(0, 40),
    t.category,
    t.type === "INCOME" ? formatRupiah(t.amount) : "-",
    t.type === "EXPENSE" ? formatRupiah(t.amount) : "-",
  ]);

  const tableResult = autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [["No", "Tanggal", "Keterangan Transaksi", "Kategori", "Debit (+)", "Kredit (-)"]],
    body: tableData,
    foot: [
      [
        "",
        "",
        "",
        "TOTAL",
        formatRupiah(totalIncome),
        formatRupiah(totalExpense),
      ],
      [
        "",
        "",
        "",
        "SALDO BERSIH",
        { content: formatRupiah(totalIncome - totalExpense), colSpan: 2, styles: { halign: "center", fontStyle: "bold" } },
        "",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
    },
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontSize: 7,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 28 },
      2: { cellWidth: "auto" },
      3: { cellWidth: 25 },
      4: { halign: "right", cellWidth: 28 },
      5: { halign: "right", cellWidth: 28 },
    },
  });

  // ===== KOLOM TANDA TANGAN =====
  const tableFinalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || (tableResult && tableResult.finalY) || currentY + 60;
  const signatureY = tableFinalY + 20;

  if (signatureY + 40 < doc.internal.pageSize.getHeight() - margin) {
    doc.setFontSize(8);
    doc.setTextColor(60);
    doc.setFont("helvetica", "normal");

    // Left signature
    const leftX = margin + 20;
    doc.text("Dibuat oleh,", leftX, signatureY, { align: "center" });
    doc.line(leftX - 20, signatureY + 20, leftX + 20, signatureY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("Bendahara", leftX, signatureY + 25, { align: "center" });

    // Right signature
    const rightX = pageWidth - margin - 20;
    doc.setFont("helvetica", "normal");
    doc.text("Diketahui oleh,", rightX, signatureY, { align: "center" });
    doc.line(rightX - 20, signatureY + 20, rightX + 20, signatureY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("Ketua Organisasi", rightX, signatureY + 25, { align: "center" });
  }

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150);
  doc.text(
    "FinChat.AI • Sistem Pelaporan Berbasis Obrolan WhatsApp Otomatis",
    margin,
    pageHeight - 8
  );
  doc.text("Halaman 1 dari 1", pageWidth - margin, pageHeight - 8, {
    align: "right",
  });

  // Download ke folder Downloads
  const fileName = `laporan_keuangan_${orgName.replace(/\s+/g, "_")}_${period.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}
