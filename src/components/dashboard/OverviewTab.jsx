"use client";

import { useMemo, useEffect, useRef } from "react";
import { formatRupiah, formatDateID } from "@/lib/utils";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function OverviewTab({ ws }) {
  const txs = ws.transactions;
  const totalIncome = useMemo(() => txs.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0), [txs]);
  const totalExpense = useMemo(() => txs.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0), [txs]);
  const netBalance = totalIncome - totalExpense;

  const chartData = {
    labels: ["Pemasukan (+)", "Pengeluaran (-)"],
    datasets: [{
      data: [totalIncome, totalExpense],
      backgroundColor: ["rgba(16,185,129,0.25)", "rgba(239,68,68,0.25)"],
      borderColor: ["#10b981", "#ef4444"],
      borderWidth: 1.5,
      borderRadius: 12,
    }],
  };
  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af", font: { size: 10 }, callback: (v) => "Rp " + v / 1000 + "k" } },
      x: { grid: { display: false }, ticks: { color: "#fff", font: { weight: "bold", size: 11 } } },
    },
  };

  const kpis = [
    { label: "TOTAL SALDO AKTIF", value: formatRupiah(netBalance), icon: "fa-wallet", color: "bg-emerald-500/10 text-emerald-400", sub: netBalance < 0 ? <><i className="fa-solid fa-triangle-exclamation text-red-400"></i> Defisit!</> : <><i className="fa-solid fa-circle-check text-emerald-400"></i> Arus kas sehat &amp; aman.</> },
    { label: "PEMASUKAN BULAN INI", value: formatRupiah(totalIncome), icon: "fa-square-arrow-up-right", color: "bg-blue-500/10 text-blue-400", sub: <><i className="fa-solid fa-arrow-trend-up text-emerald-400"></i> +12% vs bulan lalu</> },
    { label: "PENGELUARAN BULAN INI", value: formatRupiah(totalExpense), icon: "fa-square-arrow-down-left", color: "bg-red-500/10 text-red-400", sub: <><i className="fa-solid fa-circle-exclamation text-red-400"></i> {totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0}% dari pemasukan</> },
    { label: "EFISIENSI AI PARSING", value: "96.8%", icon: "fa-wand-magic-sparkles", color: "bg-purple-500/10 text-purple-400", sub: <><i className="fa-solid fa-circle-nodes text-purple-400"></i> Parsing instan tanpa lag</> },
  ];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-navy-900 border border-navy-850 p-5 rounded-2xl hover:border-navy-800 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-slate-500">{k.label}</span>
              <div className={`w-8 h-8 rounded-lg ${k.color} flex items-center justify-center text-sm`}><i className={`fa-solid ${k.icon}`}></i></div>
            </div>
            <h3 className="font-[var(--font-title)] font-bold text-2xl text-white tracking-tight">{k.value}</h3>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-navy-900 border border-navy-850 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-[var(--font-title)] font-bold text-base text-white">Visualisasi Perbandingan Arus Kas</h3>
            <span className="text-xs text-slate-500">Periode Mei 2026</span>
          </div>
          <div className="h-[300px] w-full relative">
            <Bar data={chartData} options={chartOpts} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-navy-900 border border-navy-850 p-5 rounded-2xl flex flex-col justify-between min-h-[385px]">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-navy-850">
              <h3 className="font-[var(--font-title)] font-bold text-base text-white">Log Aktivitas WA</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Real-time
              </span>
            </div>
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {txs.length === 0 ? (
                <div className="p-4 text-center text-slate-500 text-xs italic">Menunggu input webhook...</div>
              ) : txs.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-navy-950/80 border border-navy-850/60 flex items-center justify-between hover:border-navy-800 transition-all">
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-bold text-white truncate">&quot;{t.rawChatLog || t.description}&quot;</p>
                    <p className="text-[10px] text-slate-500 mt-1">AI: {t.category} • {t.type === "INCOME" ? "+" : "-"} {formatRupiah(t.amount)}</p>
                  </div>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">Sukses</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
