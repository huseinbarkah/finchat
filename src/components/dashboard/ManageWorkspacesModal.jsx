"use client";

import { useState, useEffect } from "react";

const EMOJIS = ["🎒", "🛍️", "👨‍💻", "🏢", "🚀", "🏦", "🏥", "💼", "☕", "🏪", "📦", "📈"];

const TEMPLATES = {
  organisasi: {
    label: "Organisasi / BEM",
    desc: "Cocok untuk iuran anggota, kas divisi, pengadaan barang, & konsumsi rapat.",
    icon: "fa-users-line",
    emoji: "🎒",
    categories: ["Donasi", "Kas Kelas", "Alat Kantor", "Transportasi", "Konsumsi", "Lain-lain"],
    budgets: {
      "Alat Kantor": { limit: 1000000, spent: 0 },
      Konsumsi: { limit: 1500000, spent: 0 },
      Transportasi: { limit: 500000, spent: 0 },
      "Lain-lain": { limit: 500000, spent: 0 },
    },
    rules: [
      { keyword: "donasi", category: "Donasi" },
      { keyword: "modul", category: "Alat Kantor" },
      { keyword: "ceban", category: "Kas Kelas" },
      { keyword: "kopi", category: "Konsumsi" },
      { keyword: "gojek", category: "Transportasi" },
    ],
  },
  bisnis: {
    label: "Bisnis / UMKM",
    desc: "Cocok untuk kassa penjualan, stok bahan baku, gaji karyawan, & biaya ruko.",
    icon: "fa-store",
    emoji: "🛍️",
    categories: ["Penjualan", "Bahan Baku", "Gaji Karyawan", "Sewa Ruko", "Listrik & Air"],
    budgets: {
      "Bahan Baku": { limit: 10000000, spent: 0 },
      "Gaji Karyawan": { limit: 4000000, spent: 0 },
      "Listrik & Air": { limit: 1500000, spent: 0 },
    },
    rules: [
      { keyword: "penjualan", category: "Penjualan" },
      { keyword: "biji", category: "Bahan Baku" },
      { keyword: "gaji", category: "Gaji Karyawan" },
      { keyword: "listrik", category: "Listrik & Air" },
    ],
  },
  pribadi: {
    label: "Keuangan Pribadi",
    desc: "Cocok untuk gaji bulanan, pos makanan, investasi, & belanja pakaian.",
    icon: "fa-user-astronaut",
    emoji: "👨‍💻",
    categories: ["Gaji", "Makanan", "Investasi", "Transportasi", "Pakaian", "Lain-lain"],
    budgets: {
      Makanan: { limit: 2000000, spent: 0 },
      Transportasi: { limit: 1000000, spent: 0 },
      Pakaian: { limit: 800000, spent: 0 },
      "Lain-lain": { limit: 500000, spent: 0 },
    },
    rules: [
      { keyword: "bakso", category: "Makanan" },
      { keyword: "gaji", category: "Gaji" },
      { keyword: "saham", category: "Investasi" },
      { keyword: "grab", category: "Transportasi" },
    ],
  },
  kosong: {
    label: "Kosong (Mulai dari Nol)",
    desc: "Hanya menyediakan kategori 'Lain-lain'. Atur kategori & aturan AI Anda sendiri.",
    icon: "fa-folder-open",
    emoji: "💼",
    categories: ["Lain-lain"],
    budgets: {},
    rules: [],
  },
};

export default function ManageWorkspacesModal({ isOpen, onClose, data, onSave, onDelete }) {
  const [view, setView] = useState("list"); // "list" | "create"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎒");
  const [selectedTemplate, setSelectedTemplate] = useState("organisasi");
  const [categories, setCategories] = useState(TEMPLATES.organisasi.categories);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    if (selectedTemplate && TEMPLATES[selectedTemplate]) {
      setCategories(TEMPLATES[selectedTemplate].categories);
      setSelectedEmoji(TEMPLATES[selectedTemplate].emoji);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (isOpen) {
      setView("list");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const trimmed = newCat.trim();
    if (!categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
    setNewCat("");
  };

  const handleRemoveCategory = (catToRemove) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((c) => c !== catToRemove));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const slug = baseSlug || "ws-" + Date.now().toString().slice(-6);

    const templateData = TEMPLATES[selectedTemplate];

    const budgets = {};
    if (templateData.budgets) {
      Object.entries(templateData.budgets).forEach(([catName, budgetObj]) => {
        if (categories.includes(catName)) {
          budgets[catName] = { ...budgetObj };
        }
      });
    }

    const aiRules = (templateData.rules || []).filter((rule) =>
      categories.includes(rule.category)
    );

    const newWorkspace = {
      name: name.trim(),
      slug,
      email: email.trim() || "finance@" + (slug.includes("-") ? slug : slug + ".me"),
      emoji: selectedEmoji,
      categories: [...categories],
      transactions: [],
      budgets,
      allowedSenders: [{ name: "Simulator User", phone: "628999888777" }],
      aiRules,
    };

    onSave(slug, newWorkspace);
    handleResetForm();
    onClose();
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setSelectedTemplate("organisasi");
    setCategories(TEMPLATES.organisasi.categories);
    setSelectedEmoji(TEMPLATES.organisasi.emoji);
    setNewCat("");
    setView("list");
  };

  const workspacesCount = Object.keys(data.workspaces).length;

  const handleDeleteClick = (id, wsName) => {
    if (workspacesCount <= 1) return;
    if (confirm(`Apakah Anda yakin ingin menghapus workspace "${wsName}"?\n\nSemua transaksi, anggaran, dan klasifikasi AI di dalamnya akan DIHAPUS PERMANEN.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-scale max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-850 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            {view === "create" ? (
              <button
                onClick={handleResetForm}
                className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-navy-750 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer mr-1"
                title="Kembali ke daftar"
              >
                <i className="fa-solid fa-arrow-left text-xs"></i>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-whatsapp to-emerald-400 flex items-center justify-center text-white shadow-md text-sm">
                ⚙️
              </div>
            )}
            <div>
              <h3 className="font-[var(--font-title)] font-bold text-sm">
                {view === "list" ? "Kelola Workspace" : "Tambah Workspace Baru"}
              </h3>
              <p className="text-[10px] text-slate-500">
                {view === "list"
                  ? "Atur, tambah, atau bersihkan daftar organisasi Anda."
                  : "Buat ekosistem pembukuan WhatsApp otomatis Anda."}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* View 1: List Workspace */}
        {view === "list" && (
          <div className="p-6 flex flex-col flex-grow overflow-hidden space-y-4">
            <div className="flex-grow overflow-y-auto space-y-2.5 pr-1">
              {Object.entries(data.workspaces).map(([id, wsItem]) => {
                const isActive = data.activeWorkspaceId === id;
                let defaultEmoji = "💼";
                if (id === "bem-unpad") defaultEmoji = "🎒";
                else if (id === "personal") defaultEmoji = "👨‍💻";
                else if (id === "umkm") defaultEmoji = "🛍️";
                const emoji = wsItem.emoji || defaultEmoji;

                return (
                  <div
                    key={id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? "bg-navy-850 border-whatsapp/40 text-white shadow-glow-emerald/5"
                        : "bg-navy-950/70 border-navy-850 text-slate-300 hover:bg-navy-950 hover:border-navy-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-center text-base shrink-0">
                        {emoji}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold truncate text-white">{wsItem.name}</p>
                          {isActive && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-whatsapp/10 text-whatsapp border border-whatsapp/20">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{wsItem.email || "Tidak ada email"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {workspacesCount > 1 ? (
                        <button
                          onClick={() => handleDeleteClick(id, wsItem.name)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
                          title={`Hapus workspace "${wsItem.name}"`}
                        >
                          <i className="fa-regular fa-trash-can text-[11px]"></i>
                        </button>
                      ) : (
                        <span
                          className="p-2 rounded-lg bg-navy-900 text-slate-600 border border-navy-850 cursor-not-allowed select-none"
                          title="Minimal harus menyisakan 1 workspace"
                        >
                          <i className="fa-regular fa-trash-can text-[11px]"></i>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Panel Actions */}
            <div className="pt-4 border-t border-navy-850 shrink-0 flex flex-col space-y-2">
              <button
                onClick={() => setView("create")}
                className="w-full py-3 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-all shadow-glow-emerald cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i> Tambah Workspace Baru
              </button>
              {workspacesCount === 1 && (
                <p className="text-[10px] text-slate-500 text-center italic mt-1">
                  💡 Proteksi Aktif: Anda tidak dapat menghapus workspace terakhir Anda.
                </p>
              )}
            </div>
          </div>
        )}

        {/* View 2: Form Create Workspace */}
        {view === "create" && (
          <form onSubmit={handleCreateSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
            {/* Grid: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                  Nama Organisasi / Workspace
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Contoh: BEM Kema Unpad"
                  className="w-full text-xs px-3.5 py-3 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none focus:border-whatsapp focus:ring-1 focus:ring-whatsapp transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                  Email Finansial (Opsional)
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Contoh: bendahara@bem.org"
                  className="w-full text-xs px-3.5 py-3 rounded-xl bg-navy-950 border border-navy-800 text-white focus:outline-none focus:border-whatsapp focus:ring-1 focus:ring-whatsapp transition-colors"
                />
              </div>
            </div>

            {/* Emoji Selection Grid */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                Pilih Ikon Emoji
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 bg-navy-950 p-3 rounded-xl border border-navy-850">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setSelectedEmoji(e)}
                    className={`w-full aspect-square text-base flex items-center justify-center rounded-lg transition-all border cursor-pointer hover:bg-navy-850/60 ${
                      selectedEmoji === e ? "bg-whatsapp/15 border-whatsapp text-white" : "border-transparent text-slate-400"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                Pilih Template Kategori
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(TEMPLATES).map(([key, template]) => {
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTemplate(key)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all hover:bg-navy-850/40 cursor-pointer ${
                        isSelected
                          ? "bg-navy-850/80 border-whatsapp text-white ring-1 ring-whatsapp/30"
                          : "bg-navy-950 border-navy-800 text-slate-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                          isSelected ? "bg-whatsapp text-navy-950" : "bg-navy-850 text-slate-300"
                        }`}
                      >
                        <i className={`fa-solid ${template.icon}`}></i>
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-300"}`}>{template.label}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{template.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Categories Editor */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                Kategori Keuangan Aktif
              </label>
              <div className="bg-navy-950 border border-navy-850 rounded-xl p-4.5 space-y-3.5">
                {/* Chips Area */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-navy-850 border border-navy-800 text-slate-300 transition-colors hover:text-white"
                    >
                      {c}
                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(c)}
                          className="text-slate-500 hover:text-red-400 text-xs leading-none select-none ml-0.5 focus:outline-none cursor-pointer"
                          title={`Hapus kategori "${c}"`}
                        >
                          &times;
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Category Input */}
                <div className="flex gap-2">
                  <input
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    type="text"
                    placeholder="Ketik kategori baru... (cth: Pemasaran)"
                    className="flex-grow text-[11px] px-3 py-2 bg-navy-900 border border-navy-800 text-white rounded-lg focus:outline-none focus:border-whatsapp"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3.5 py-2 bg-navy-800 hover:bg-navy-750 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <i className="fa-solid fa-plus text-[10px]"></i> Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-navy-850 shrink-0">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-1/2 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-all shadow-glow-emerald cursor-pointer"
              >
                Simpan Workspace
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
