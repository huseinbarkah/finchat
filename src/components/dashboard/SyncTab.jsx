"use client";

import { useState } from "react";

export default function SyncTab({ ws, data, updateData, addToast }) {
  const [sName, setSName] = useState("");
  const [sPhone, setSPhone] = useState("");

  const toggleServer = () => {
    data.webhookStats.isOnline = !data.webhookStats.isOnline;
    updateData(data);
    addToast(data.webhookStats.isOnline ? "Server Online" : "Server Offline", data.webhookStats.isOnline ? "Webhook Meta Cloud API aktif." : "Server diistirahatkan.", data.webhookStats.isOnline ? "success" : "warning");
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://api.finchat.ai/v1/webhook/${ws.slug}`);
    addToast("URL Disalin", "Endpoint webhook disalin ke clipboard.", "info");
  };

  const addSender = (e) => {
    e.preventDefault();
    if (!sName || !sPhone) return;
    ws.allowedSenders.push({ name: sName, phone: sPhone });
    updateData(data);
    setSName(""); setSPhone("");
    addToast("Pengirim Ditambahkan", `${sName} ditambahkan ke whitelist.`, "success");
  };

  const removeSender = (idx) => {
    ws.allowedSenders.splice(idx, 1);
    updateData(data);
    addToast("Pengirim Dihapus", "Nomor dihapus dari whitelist.", "warning");
  };

  const online = data.webhookStats.isOnline;

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-navy-900 border border-navy-850 p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-navy-850/60 pb-4">
            <div>
              <h3 className="font-[var(--font-title)] font-bold text-base text-white mb-1">Status Webhook Meta Cloud</h3>
              <p className="text-xs text-slate-500">Konfigurasi endpoint webhook untuk Meta Portal Developer.</p>
            </div>
            <button onClick={toggleServer} className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all ${online ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
              <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
              {online ? "Server Aktif (Online)" : "Server Terputus (Offline)"}
            </button>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400">Webhook API URL (HTTPS Endpoint)</label>
            <div className="flex gap-2">
              <input type="text" readOnly value={`https://api.finchat.ai/v1/webhook/${ws.slug}`} className="flex-grow text-xs font-mono px-3 py-3 rounded-xl bg-navy-950 border border-navy-800 text-slate-400 focus:outline-none" />
              <button onClick={copyUrl} className="px-4 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-800 text-xs font-semibold text-white transition-all flex items-center gap-1.5"><i className="fa-solid fa-copy"></i> Salin</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-navy-950 rounded-xl border border-navy-850 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Latensi Gateway</p>
              <p className="text-base font-bold text-white mt-1">45ms</p>
            </div>
            <div className="p-3.5 bg-navy-950 rounded-xl border border-navy-850 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Tingkat Kegagalan</p>
              <p className="text-base font-bold text-emerald-400 mt-1">0.12%</p>
            </div>
            <div className="p-3.5 bg-navy-950 rounded-xl border border-navy-850 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Webhook</p>
              <p className="text-base font-bold text-white mt-1">{data.webhookStats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-navy-900 border border-navy-850 p-6 rounded-2xl space-y-5">
          <div>
            <h3 className="font-[var(--font-title)] font-bold text-base text-white mb-1">Daftar Pengirim Terverifikasi</h3>
            <p className="text-xs text-slate-500">Hanya nomor WA terdaftar yang diizinkan menginput transaksi.</p>
          </div>
          <div className="space-y-2.5">
            {ws.allowedSenders.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Belum ada nomor terdaftar.</p>
            ) : ws.allowedSenders.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-navy-950 border border-navy-850 flex items-center justify-between text-xs hover:border-navy-800 transition-all">
                <div>
                  <p className="font-bold text-white">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5"><i className="fa-brands fa-whatsapp text-emerald-500"></i> +{s.phone}</p>
                </div>
                <button onClick={() => removeSender(idx)} className="text-slate-500 hover:text-red-400 transition-colors"><i className="fa-solid fa-trash text-xs"></i></button>
              </div>
            ))}
          </div>
          <form onSubmit={addSender} className="flex gap-2 border-t border-navy-850 pt-4">
            <input value={sName} onChange={(e) => setSName(e.target.value)} required type="text" placeholder="Nama Admin" className="w-1/2 text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none" />
            <input value={sPhone} onChange={(e) => setSPhone(e.target.value)} required type="text" placeholder="6281.." className="w-1/2 text-xs px-3 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none font-mono" />
            <button type="submit" className="px-4 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs shrink-0 transition-colors"><i className="fa-solid fa-plus"></i></button>
          </form>
        </div>
      </div>
    </section>
  );
}
