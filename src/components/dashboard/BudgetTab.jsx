"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";

export default function BudgetTab({ ws, data, updateData, addToast }) {
  const [ruleKw, setRuleKw] = useState("");
  const [ruleCat, setRuleCat] = useState(ws.categories[0] || "");
  const [ruleType, setRuleType] = useState("auto");

  const handleAddRule = (e) => {
    e.preventDefault();
    const kw = ruleKw.trim().toLowerCase();
    if (!kw) return;
    if (ws.aiRules.some((r) => r.keyword === kw)) { alert("Aturan tersebut sudah ada!"); return; }
    ws.aiRules.push({ keyword: kw, category: ruleCat, type: ruleType });
    updateData(data);
    setRuleKw("");
    setRuleType("auto");
    addToast("Aturan AI Ditambahkan", `"${kw}" → "${ruleCat}"`, "success");
  };

  const removeRule = (idx) => {
    ws.aiRules.splice(idx, 1);
    updateData(data);
    addToast("Aturan AI Dihapus", "Aturan kosa kata dihapus.", "warning");
  };

  const budgetKeys = Object.keys(ws.budgets);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Budget Tracker */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-850 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-[var(--font-title)] font-bold text-base text-white mb-1">Pelacak Anggaran Terkini</h3>
            <p className="text-xs text-slate-500">Memonitor sisa pagu anggaran bulanan yang berhasil divalidasi oleh bot WhatsApp.</p>
          </div>
          <div className="space-y-4">
            {budgetKeys.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Pagu anggaran tidak dikonfigurasi.</p>
            ) : budgetKeys.map((cat) => {
              const b = ws.budgets[cat];
              const pct = Math.min(Math.round((b.spent / b.limit) * 100), 100);
              let barColor = "bg-whatsapp", txtColor = "text-slate-400";
              if (pct >= 90) { barColor = "bg-red-500"; txtColor = "text-red-400 font-bold"; }
              else if (pct >= 75) { barColor = "bg-amber-500"; txtColor = "text-amber-400 font-semibold"; }
              return (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{cat}</span>
                    <span className={`font-semibold ${txtColor}`}>{formatRupiah(b.spent)} / {formatRupiah(b.limit)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-navy-850">
                    <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Rules */}
        <div className="lg:col-span-6 bg-navy-900 border border-navy-850 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-[var(--font-title)] font-bold text-base text-white mb-1">Aturan Pengenalan AI</h3>
            <p className="text-xs text-slate-500">Petakan kosakata lokal / slang khusus ke kategori pembukuan.</p>
          </div>
          <form onSubmit={handleAddRule} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kosa Kata (Keyword)</label>
                <input value={ruleKw} onChange={(e) => setRuleKw(e.target.value)} required type="text" placeholder="Contoh: 'goceng'" className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none focus:border-whatsapp" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tipe Aliran</label>
                <select value={ruleType} onChange={(e) => setRuleType(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
                  <option value="auto">Otomatis</option>
                  <option value="expense">Pengeluaran (-)</option>
                  <option value="income">Pemasukan (+)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kategori Klasifikasi</label>
                <select value={ruleCat} onChange={(e) => setRuleCat(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-300 focus:outline-none focus:border-whatsapp cursor-pointer">
                  {ws.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-plus text-whatsapp"></i> Daftarkan Aturan AI Baru
            </button>
          </form>
          <div className="border-t border-navy-850/80 pt-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Daftar Aturan Aktif</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {ws.aiRules.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Belum ada aturan klasifikasi.</p>
              ) : ws.aiRules.map((rule, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-navy-950 border border-navy-850 text-xs">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold">&quot;{rule.keyword}&quot;</span>
                    <span className="text-slate-500"> → Kategori </span>
                    <span className="font-bold text-white">{rule.category}</span>
                    {rule.type && rule.type !== "auto" && (
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${rule.type === 'income' ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'}`}>
                        {rule.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    )}
                  </div>
                  <button onClick={() => removeRule(idx)} className="text-slate-500 hover:text-red-400 transition-colors"><i className="fa-solid fa-circle-xmark"></i></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
