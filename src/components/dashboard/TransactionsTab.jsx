"use client";

import { useState, useMemo } from "react";
import { formatRupiah, formatDateID } from "@/lib/utils";

export default function TransactionsTab({ ws, data, updateData, addToast }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ desc: "", type: "expense", amount: "", cat: ws.categories[0] || "" });

  const filtered = useMemo(() => {
    return ws.transactions.filter((t) => {
      const matchType = filterType === "all" || t.type === filterType.toUpperCase();
      const matchCat = filterCat === "all" || t.category === filterCat;
      const matchSearch = !search || (t.rawChatLog || t.description || "").toLowerCase().includes(search.toLowerCase()) || (t.whatsappSenderName || "").toLowerCase().includes(search.toLowerCase());
      return matchType && matchCat && matchSearch;
    });
  }, [ws.transactions, filterType, filterCat, search]);

  const handleDelete = (id) => {
    const tx = ws.transactions.find((t) => t.id === id);
    if (!tx || !confirm(`Hapus catatan "${tx.rawChatLog || tx.description}"?`)) return;
    if (tx.type === "EXPENSE" && ws.budgets[tx.category]) {
      ws.budgets[tx.category].spent = Math.max(0, ws.budgets[tx.category].spent - tx.amount);
    }
    ws.transactions = ws.transactions.filter((t) => t.id !== id);
    updateData(data);
    addToast("Transaksi Dihapus", "Catatan berhasil dibersihkan.", "warning");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(form.amount);
    if (!amount || !form.desc) return;
    const tx = {
      id: "tx-" + Date.now(),
      type: form.type === "income" ? "INCOME" : "EXPENSE",
      amount,
      category: form.cat,
      description: form.desc,
      rawChatLog: `[Input Manual] ${form.desc}`,
      whatsappSenderName: "Admin (Manual)",
      status: "SUCCESS",
      createdAt: new Date().toISOString(),
    };
    ws.transactions.unshift(tx);
    if (tx.type === "EXPENSE" && ws.budgets[tx.category]) ws.budgets[tx.category].spent += amount;
    updateData(data);
    setModal(false);
    setForm({ desc: "", type: "expense", amount: "", cat: ws.categories[0] || "" });
    addToast("Transaksi Manual Tersimpan", `Berhasil mencatat "${form.desc}"`, "success");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap gap-2.5 items-center flex-grow max-w-3xl">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-60">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Cari deskripsi / pengirim..." className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-white focus:outline-none focus:border-whatsapp" />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none"><i className="fa-solid fa-magnifying-glass"></i></span>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-navy-900 text-xs border border-navy-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
            <option value="all">Semua Jenis</option>
            <option value="income">Pemasukan (+)</option>
            <option value="expense">Pengeluaran (-)</option>
          </select>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-navy-900 text-xs border border-navy-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
            <option value="all">Semua Kategori</option>
            {ws.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={() => setModal(true)} className="px-5 py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-glow-emerald">
          <i className="fa-solid fa-plus"></i> Transaksi Manual
        </button>
      </div>

      <div className="bg-navy-900 border border-navy-850 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-850 bg-navy-950/40 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-4 px-5">Tanggal</th>
                <th className="py-4 px-5">Pengirim (WA)</th>
                <th className="py-4 px-5">Chat Mentah</th>
                <th className="py-4 px-5">Hasil AI (Kategori)</th>
                <th className="py-4 px-5 text-right">Jumlah (IDR)</th>
                <th className="py-4 px-5 text-center">Status</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-850/60">
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500 font-medium italic">Tidak ada transaksi terdaftar.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} className="hover:bg-navy-850/30 text-slate-300 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs">{formatDateID(t.createdAt)}</td>
                  <td className="py-4 px-5 font-semibold text-xs text-white">{t.whatsappSenderName || "Manual"}</td>
                  <td className="py-4 px-5 text-xs truncate max-w-[200px]" title={t.rawChatLog}>&quot;{t.rawChatLog || t.description}&quot;</td>
                  <td className="py-4 px-5"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${t.type === "INCOME" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>{t.category}</span></td>
                  <td className={`py-4 px-5 text-right text-xs font-semibold ${t.type === "INCOME" ? "text-emerald-400" : "text-red-400"}`}>{t.type === "INCOME" ? "+" : "-"} {formatRupiah(t.amount)}</td>
                  <td className="py-4 px-5 text-center"><span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>{t.status === "SUCCESS" ? "Sukses" : t.status}</span></td>
                  <td className="py-4 px-5 text-center">
                    <button onClick={() => handleDelete(t.id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition-colors" title="Hapus"><i className="fa-solid fa-trash text-xs"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-scale">
            <div className="px-5 py-4 border-b border-navy-850 flex items-center justify-between text-white">
              <h3 className="font-[var(--font-title)] font-bold text-sm"><i className="fa-solid fa-keyboard text-whatsapp mr-1.5"></i>Tambah Catatan Manual</h3>
              <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Keterangan Transaksi</label>
                <input required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} type="text" placeholder="Contoh: Pembelian spidol" className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none focus:border-whatsapp" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Jenis</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
                    <option value="expense">Pengeluaran (-)</option>
                    <option value="income">Pemasukan (+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nominal (IDR)</label>
                  <input required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} type="number" placeholder="50000" className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none focus:border-whatsapp" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kategori</label>
                <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
                  {ws.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="w-1/2 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-bold text-xs transition-all">Batalkan</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-all shadow-glow-emerald">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
