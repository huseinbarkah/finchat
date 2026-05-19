"use client";

export default function Sidebar({ data, activeTab, sidebarOpen, onTabChange, onWorkspaceChange, onCloseSidebar }) {
  const ws = data.workspaces[data.activeWorkspaceId];
  const tabs = [
    { id: "tab-ikhtisar", icon: "fa-chart-line", label: "Ikhtisar (Overview)" },
    { id: "tab-transaksi", icon: "fa-receipt", label: "Catatan Transaksi" },
    { id: "tab-anggaran", icon: "fa-wallet", label: "Anggaran & Aturan AI" },
    { id: "tab-sinkronisasi", icon: "fa-arrows-spin", label: "Sinkronisasi WA" },
    { id: "tab-laporan", icon: "fa-file-invoice-dollar", label: "Generator Laporan" },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-navy-900 border-r border-navy-850/70 flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div>
        <div className="h-20 px-6 border-b border-navy-850 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-whatsapp to-emerald-400 flex items-center justify-center text-white shadow-md shadow-whatsapp/15">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </div>
            <span className="font-[var(--font-title)] font-extrabold text-lg text-white tracking-tight">FinChat<span className="text-whatsapp">.AI</span></span>
          </a>
          <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={onCloseSidebar}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="px-4 py-4 border-b border-navy-850/60">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5 px-2">Workspace</label>
          <div className="relative">
            <select value={data.activeWorkspaceId} onChange={(e) => onWorkspaceChange(e.target.value)} className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white appearance-none focus:outline-none focus:border-whatsapp focus:ring-1 focus:ring-whatsapp cursor-pointer">
              <option value="bem-unpad">🎒 BEM Kema Unpad</option>
              <option value="personal">👨‍💻 Keuangan Pribadi</option>
              <option value="umkm">🛍️ Kedai Kopi Kita (UMKM)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "bg-navy-850 text-white border border-navy-800/40" : "text-slate-400 hover:text-white hover:bg-navy-850/50"}`}>
              <i className={`fa-solid ${tab.icon} w-5 text-center ${activeTab === tab.id ? "text-whatsapp" : "text-slate-500"}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-navy-850/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {ws.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{ws.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{ws.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
