"use client";

import { useState, useEffect, useCallback } from "react";
import { loadData, saveData, getActiveWorkspace } from "@/lib/store";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import OverviewTab from "@/components/dashboard/OverviewTab";
import TransactionsTab from "@/components/dashboard/TransactionsTab";
import BudgetTab from "@/components/dashboard/BudgetTab";
import SyncTab from "@/components/dashboard/SyncTab";
import ReportTab from "@/components/dashboard/ReportTab";
import WASimulator from "@/components/dashboard/WASimulator";
import Toast from "@/components/dashboard/Toast";

const TAB_CONFIG = {
  "tab-ikhtisar": { title: "Ikhtisar Dashboard", sub: "Potret cepat arus kas & efisiensi kecerdasan buatan Anda bulan ini." },
  "tab-transaksi": { title: "Catatan Transaksi (Ledger)", sub: "Tinjau, edit, atau validasi seluruh data keuangan yang diparsing oleh WhatsApp Bot." },
  "tab-anggaran": { title: "Anggaran & Aturan Klasifikasi", sub: "Tentukan pagu batas pengeluaran bulanan dan latih perilaku parsing AI." },
  "tab-sinkronisasi": { title: "Sinkronisasi WhatsApp Gateway", sub: "Pantau status endpoint API Webhook dan atur izin pengirim." },
  "tab-laporan": { title: "Generator Laporan Keuangan", sub: "Ekspor laporan keuangan bersih siap kirim ke format formal PDF / Excel." },
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("tab-ikhtisar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { setData(loadData()); }, []);

  const updateData = useCallback((newData) => {
    setData({ ...newData });
    saveData(newData);
  }, []);

  const addToast = useCallback((title, message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, title, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  if (!data) return (
    <div className="h-screen w-screen flex items-center justify-center bg-navy-950">
      <div className="animate-pulse text-whatsapp font-bold">Memuat FinChat.AI...</div>
    </div>
  );

  const ws = getActiveWorkspace(data);
  const tabInfo = TAB_CONFIG[activeTab];

  return (
    <div className="flex h-screen overflow-hidden">
      <Toast toasts={toasts} onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      <Sidebar
        data={data}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
        onWorkspaceChange={(id) => { data.activeWorkspaceId = id; updateData(data); addToast("Berpindah Workspace", `Membuka workspace ${data.workspaces[id].name}`, "info"); }}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-grow flex flex-col min-w-0 h-full overflow-hidden relative">
        <TopBar title={tabInfo.title} subtitle={tabInfo.sub} onHamburger={() => setSidebarOpen(true)} webhookOnline={data.webhookStats.isOnline} />

        <div className="flex-grow overflow-y-auto p-6" id="view-container">
          {activeTab === "tab-ikhtisar" && <OverviewTab ws={ws} />}
          {activeTab === "tab-transaksi" && <TransactionsTab ws={ws} data={data} updateData={updateData} addToast={addToast} />}
          {activeTab === "tab-anggaran" && <BudgetTab ws={ws} data={data} updateData={updateData} addToast={addToast} />}
          {activeTab === "tab-sinkronisasi" && <SyncTab ws={ws} data={data} updateData={updateData} addToast={addToast} />}
          {activeTab === "tab-laporan" && <ReportTab ws={ws} data={data} addToast={addToast} />}
        </div>
      </main>

      <WASimulator ws={ws} data={data} updateData={updateData} addToast={addToast} />
    </div>
  );
}
