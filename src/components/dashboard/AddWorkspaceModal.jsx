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

export default function AddWorkspaceModal({ isOpen, onClose, onSave }) {
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
    if (categories.length <= 1) return; // Prevent removing everything
    setCategories((prev) => prev.filter((c) => c !== catToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    // Fallback if name has only symbols
    const slug = baseSlug || "ws-" + Date.now().toString().slice(-6);

    const templateData = TEMPLATES[selectedTemplate];

    // Filter budgets to match only the current active categories
    const budgets = {};
    if (templateData.budgets) {
      Object.entries(templateData.budgets).forEach(([catName, budgetObj]) => {
        if (categories.includes(catName)) {
          budgets[catName] = { ...budgetObj };
        }
      });
    }

    // Filter AI rules to match only the current active categories
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
    handleReset();
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setSelectedTemplate("organisasi");
    setCategories(TEMPLATES.organisasi.categories);
    setSelectedEmoji(TEMPLATES.organisasi.emoji);
    setNewCat("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-navy-900 border border-navy-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-scale max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-850 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-whatsapp to-emerald-400 flex items-center justify-center text-white text-sm shadow-md">
              <span className="text-lg">{selectedEmoji}</span>
            </div>
            <div>
              <h3 className="font-[var(--font-title)] font-bold text-sm">Tambah Workspace Baru</h3>
              <p className="text-[10px] text-slate-500">Buat ekosistem pembukuan WhatsApp otomatis Anda.</p>
            </div>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
          {/* Grid: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Nama Organisasi / Workspace</label>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Email Finansial (Opsional)</label>
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Pilih Ikon Emoji</label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 bg-navy-950 p-3 rounded-xl border border-navy-850">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setSelectedEmoji(e)}
                  className={`w-full aspect-square text-base flex items-center justify-center rounded-lg transition-all border cursor-pointer hover:bg-navy-850/60 ${selectedEmoji === e ? "bg-whatsapp/15 border-whatsapp text-white" : "border-transparent text-slate-400"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Pilih Template Kategori</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(TEMPLATES).map(([key, template]) => {
                const isSelected = selectedTemplate === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTemplate(key)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all hover:bg-navy-850/40 cursor-pointer ${isSelected ? "bg-navy-850/80 border-whatsapp text-white ring-1 ring-whatsapp/30" : "bg-navy-950 border-navy-800 text-slate-400"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${isSelected ? "bg-whatsapp text-navy-950" : "bg-navy-850 text-slate-300"}`}>
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

          {/* Dynamic Categories editor */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">Kategori Keuangan Aktif</label>
            <div className="bg-navy-950 border border-navy-850 rounded-xl p-4.5 space-y-3.5">
              {/* Chips area */}
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

              {/* Add category input */}
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
              onClick={handleReset}
              className="w-1/2 py-3 rounded-xl bg-navy-850 hover:bg-navy-800 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-xs transition-all shadow-glow-emerald cursor-pointer"
            >
              Simpan Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
