"use client";

import { useState, useMemo } from "react";
import { formatRupiah, formatDateID } from "@/lib/utils";

export default function ReportTab({ ws, data, addToast }) {
  const [period, setPeriod] = useState("this-month");

  const filteredTx = useMemo(() => {
    if (period === "last-month") return [];
    return ws.transactions;
  }, [ws.transactions, period]);

  const totalIncome = filteredTx.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTx.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const metaPeriod = period === "this-month" ? "Mei 2026" : period === "last-month" ? "April 2026" : "Seluruh Riwayat";

  const handleExcel = () => {
    addToast("Menyiapkan Laporan", "Mengekstrak data ke Excel...", "info");
    setTimeout(async () => {
      try {
        const { generateExcel } = await import("@/lib/export-excel");
        const buffer = await generateExcel(filteredTx, ws.name, metaPeriod);
        const fileName = `finchat_report_${ws.slug}.xlsx`;
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 200);
        addToast("Ekspor Sukses", "Berkas Excel tersimpan di folder Downloads.", "success");
      } catch (err) {
        console.error("Excel Export Error:", err);
        addToast("Ekspor Gagal", err.message || "Gagal membuat berkas Excel.", "danger");
      }
    }, 500);
  };

  const handlePDF = () => {
    addToast("Menyiapkan PDF", "Rendering dokumen...", "info");
    setTimeout(async () => {
      try {
        const { generatePDF } = await import("@/lib/export-pdf");
        await generatePDF(filteredTx, ws.name, metaPeriod);
        addToast("Ekspor Sukses", "Dokumen PDF tersimpan di folder Downloads.", "success");
      } catch (err) {
        console.error("PDF Export Error:", err);
        addToast("Ekspor Gagal", err.message || "Terjadi kesalahan saat membuat PDF.", "danger");
      }
    }, 500);
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Config Panel */}
        <div className="lg:col-span-4 bg-navy-900 border border-navy-850 p-6 rounded-2xl flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <h3 className="font-[var(--font-title)] font-bold text-base text-white mb-1">Saring Dokumen Ekspor</h3>
              <p className="text-xs text-slate-500">Atur parameter laporan sebelum mengunduh berkas.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Pilih Periode Waktu</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
                <option value="this-month">Bulan Berjalan (Mei 2026)</option>
                <option value="last-month">Bulan Kemarin (April 2026)</option>
                <option value="all-time">Seluruh Riwayat Transaksi</option>
              </select>
            </div>
          </div>
          <div className="space-y-3 pt-6 border-t border-navy-850/60 mt-6">
            <button onClick={handleExcel} className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-white border border-navy-800/80 font-bold text-xs transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-file-excel text-emerald-400 text-sm"></i> Unduh Berkas Excel (.xlsx)
            </button>
            <button onClick={handlePDF} className="w-full py-3 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-glow-emerald">
              <i className="fa-solid fa-file-pdf text-sm"></i> Unduh Berkas Laporan PDF
            </button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="lg:col-span-8 bg-navy-900 border border-navy-850 p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-navy-850/60 pb-3 mb-4">
            <h3 className="font-[var(--font-title)] font-bold text-sm text-white flex items-center gap-2"><i className="fa-solid fa-eye text-whatsapp"></i> Pratinjau Dokumen PDF Real-time</h3>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">laporan_preview.pdf</span>
          </div>
          <div className="flex-grow bg-white text-slate-800 p-8 rounded-xl shadow-lg font-serif min-h-[400px] flex flex-col justify-between border border-slate-300">
            <div>
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-5">
                <h4 className="font-bold text-lg uppercase tracking-tight text-slate-900">LAPORAN ARUS KAS MASUK &amp; KELUAR</h4>
                <p className="text-xs uppercase font-sans font-semibold tracking-wider text-slate-600 mt-1">{ws.name}</p>
                <p className="text-[10px] italic font-sans text-slate-500 mt-0.5">Sistem Laporan Otomatis via FinChat.AI Engine</p>
              </div>
              <div className="grid grid-cols-2 text-[10px] font-sans text-slate-600 mb-6 gap-2">
                <div>
                  <p><strong>Periode Laporan:</strong> {metaPeriod}</p>
                  <p><strong>Tanggal Cetak:</strong> {formatDateID(new Date())}</p>
                </div>
                <div className="text-right">
                  <p><strong>Klasifikasi:</strong> Laporan Publik</p>
                  <p><strong>Mata Uang:</strong> IDR (Rupiah)</p>
                </div>
              </div>
              <div className="font-sans text-[10px]">
                <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5 font-bold mb-1.5">
                  <div className="col-span-3">Tanggal</div>
                  <div className="col-span-5">Keterangan Transaksi</div>
                  <div className="col-span-2 text-right">Debit</div>
                  <div className="col-span-2 text-right">Kredit</div>
                </div>
                <div className="space-y-1.5">
                  {filteredTx.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-[10px] italic">Tidak ada transaksi untuk periode ini.</div>
                  ) : filteredTx.map((t) => (
                    <div key={t.id} className="grid grid-cols-12 border-b border-slate-200 pb-1 text-slate-700">
                      <div className="col-span-3 text-[9px]">{formatDateID(t.createdAt)}</div>
                      <div className="col-span-5 text-[9px] truncate pr-2">&quot;{t.rawChatLog || t.description}&quot;</div>
                      <div className="col-span-2 text-right text-[9px] text-emerald-600">{t.type === "INCOME" ? formatRupiah(t.amount) : "-"}</div>
                      <div className="col-span-2 text-right text-[9px] text-red-600">{t.type === "EXPENSE" ? formatRupiah(t.amount) : "-"}</div>
                    </div>
                  ))}
                </div>
                {filteredTx.length > 0 && (
                  <div className="mt-4 pt-2 border-t-2 border-slate-800">
                    <div className="grid grid-cols-12 font-bold text-[9px]">
                      <div className="col-span-8 text-right pr-4">TOTAL:</div>
                      <div className="col-span-2 text-right text-emerald-700">{formatRupiah(totalIncome)}</div>
                      <div className="col-span-2 text-right text-red-700">{formatRupiah(totalExpense)}</div>
                    </div>
                    <div className="grid grid-cols-12 font-bold text-[10px] mt-1">
                      <div className="col-span-8 text-right pr-4">SALDO BERSIH:</div>
                      <div className="col-span-4 text-center text-slate-900">{formatRupiah(totalIncome - totalExpense)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-end border-t border-slate-300 pt-4 font-sans text-[9px] text-slate-400 mt-8">
              <div>FinChat.AI • Pelaporan Otomatis via WhatsApp</div>
              <div>Halaman 1 dari 1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
