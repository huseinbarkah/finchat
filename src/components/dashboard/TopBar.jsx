"use client";

export default function TopBar({ title, subtitle, onHamburger, webhookOnline }) {
  return (
    <header className="h-20 border-b border-navy-850/80 bg-navy-900/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-300 hover:text-white focus:outline-none transition-colors" onClick={onHamburger}>
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
        <div>
          <h1 className="font-[var(--font-title)] font-extrabold text-xl text-white tracking-tight">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className={`w-2 h-2 rounded-full ${webhookOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
          <span className={`text-[11px] font-semibold ${webhookOnline ? "text-emerald-400" : "text-red-400"}`}>
            {webhookOnline ? "Efisiensi AI: 96.8%" : "Server Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
