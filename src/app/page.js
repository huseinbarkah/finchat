"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { parseWithLocalNLP } from "@/lib/ai-engine";
import { formatRupiah } from "@/lib/utils";

// ========== LANDING PAGE ==========
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);

    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("promoSeen")) {
        setShowPromo(true);
        sessionStorage.setItem("promoSeen", "true");
      }
    }, 1500);

    return () => {
      window.removeEventListener("scroll", h);
      clearTimeout(timer);
    };
  }, []);

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPromo(false);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-navy-950 overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-900/90 backdrop-blur-xl border-b border-navy-850/60 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-whatsapp to-emerald-400 flex items-center justify-center text-white shadow-md">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </div>
            <span className="font-[var(--font-title)] font-extrabold text-lg text-white tracking-tight">
              FinChat<span className="text-whatsapp">.AI</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Fitur
            </a>
            <a
              href="#simulator"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Harga
            </a>
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-sm transition-all shadow-glow-emerald"
            >
              Buka Dashboard →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <i
              className={`fa-solid ${mobileNav ? "fa-xmark" : "fa-bars"} text-xl`}
            ></i>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileNav && (
          <div className="md:hidden bg-navy-900/95 backdrop-blur-xl border-t border-navy-850 px-6 py-4 space-y-3 animate-slide-down">
            <a
              href="#features"
              className="block text-sm text-slate-300 py-2"
              onClick={() => setMobileNav(false)}
            >
              Fitur
            </a>
            <a
              href="#simulator"
              className="block text-sm text-slate-300 py-2"
              onClick={() => setMobileNav(false)}
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="block text-sm text-slate-300 py-2"
              onClick={() => setMobileNav(false)}
            >
              Harga
            </a>
            <Link
              href="/dashboard"
              className="block w-full text-center py-2.5 rounded-xl bg-whatsapp text-navy-950 font-bold text-sm"
            >
              Buka Dashboard →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-whatsapp/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-whatsapp/3 to-blue-500/3 rounded-full blur-[150px] animate-gradient"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-whatsapp/10 border border-whatsapp/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse"></span>
            <span className="text-xs font-semibold text-whatsapp">
              Powered by Google Gemini AI
            </span>
          </div>

          <h1 className="font-[var(--font-title)] font-extrabold text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight mb-6 animate-slide-up">
            Dari Chat WhatsApp{" "}
            <span className="bg-gradient-to-r from-whatsapp via-emerald-400 to-teal-300 bg-clip-text text-transparent animate-gradient">
              ke Laporan Keuangan
            </span>{" "}
            dalam Hitungan Detik
          </h1>

          <p
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Kirim chat seperti{" "}
            <span className="text-white font-semibold">
              &quot;beli kopi goceng&quot;
            </span>{" "}
            — AI kami langsung parsing, kategorikan, dan catat ke pembukuan
            digital Anda secara otomatis.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-sm transition-all shadow-glow-emerald flex items-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              Mulai Gratis Sekarang
            </Link>
            <a
              href="#simulator"
              className="px-8 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-850 text-white border border-navy-800 font-bold text-sm transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-play text-whatsapp text-xs"></i>
              Coba Simulator Demo
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { val: "96.8%", label: "Akurasi AI Parsing" },
              { val: "<45ms", label: "Latensi Gateway" },
              { val: "Multi-Tenant", label: "Banyak Organisasi" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-[var(--font-title)] font-extrabold text-2xl md:text-3xl text-white">
                  {s.val}
                </p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-title)] font-extrabold text-3xl md:text-4xl text-white mb-4">
              Satu Platform,{" "}
              <span className="text-whatsapp">Semua Keuangan</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Didesain untuk BEM, UMKM, dan keuangan pribadi yang ingin
              otomatisasi pembukuan tanpa ribet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "fa-wand-magic-sparkles",
                color: "from-purple-500 to-violet-600",
                title: "AI Parsing Instan",
                desc: "Pahami bahasa gaul, typo, dan singkatan khas Indonesia. 'Goceng', '50k', '2ratus rebu' — semua terdeteksi.",
              },
              {
                icon: "fa-building",
                color: "from-blue-500 to-cyan-500",
                title: "Multi-Tenant",
                desc: "Kelola banyak organisasi dalam satu akun. BEM, UMKM, atau pribadi — semuanya rapi terpisah.",
              },
              {
                icon: "fa-chart-line",
                color: "from-whatsapp to-emerald-400",
                title: "Dashboard Real-time",
                desc: "Visualisasi arus kas langsung terupdate setiap chat masuk. KPI, grafik, dan budget tracker live.",
              },
              {
                icon: "fa-file-pdf",
                color: "from-red-500 to-rose-500",
                title: "Ekspor PDF & CSV",
                desc: "Cetak laporan keuangan resmi lengkap dengan kop surat, tabel, tanda tangan, dan kalkulasi total.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-navy-900 border border-navy-850 rounded-2xl p-6 hover:border-navy-800 transition-all group hover:-translate-y-1 duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white text-lg mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <i className={`fa-solid ${f.icon}`}></i>
                </div>
                <h3 className="font-[var(--font-title)] font-bold text-white text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SIMULATOR ── */}
      <section id="simulator" className="py-20 md:py-28 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-whatsapp/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="font-[var(--font-title)] font-extrabold text-3xl md:text-4xl text-white mb-4">
              Coba <span className="text-whatsapp">Langsung</span> di Sini
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Ketik pesan pengeluaran atau pemasukan kasual seperti chat
              WhatsApp biasa. AI kami parsing secara instan.
            </p>
          </div>

          <SimulatorDemo />
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[var(--font-title)] font-extrabold text-3xl md:text-4xl text-white mb-4">
              Harga <span className="text-whatsapp">Transparan</span>
            </h2>
            <p className="text-slate-400">
              Mulai gratis, upgrade ketika bisnis Anda bertumbuh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Gratis",
                price: "Rp 0",
                period: "selamanya",
                highlight: false,
                features: [
                  "1 Organisasi / Workspace",
                  "100 Transaksi / bulan",
                  "AI Parsing (Local NLP)",
                  "Export CSV",
                  "1 Nomor WA Terdaftar",
                ],
                cta: "Mulai Gratis",
              },
              {
                name: "Pro",
                price: "Rp 29.000",
                period: "/ bulan",
                highlight: true,
                features: [
                  "5 Organisasi / Workspace",
                  "Unlimited Transaksi",
                  "AI Parsing (Gemini Pro)",
                  "Export CSV + PDF Profesional",
                  "10 Nomor WA Terdaftar",
                  "Webhook Real-time",
                  "Laporan Custom Branding",
                ],
                cta: "Langganan Pro",
              },
              {
                name: "Business",
                price: "Rp 199.000",
                period: "/ bulan",
                highlight: false,
                features: [
                  "Unlimited Organisasi",
                  "Unlimited Transaksi",
                  "AI Fine-tuning Custom",
                  "Semua Format Ekspor",
                  "Unlimited Nomor WA",
                  "Dedicated Support 24/7",
                ],
                cta: "Langganan Business",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-navy-900 to-navy-950 border-2 border-whatsapp/40 shadow-glow-emerald scale-105 relative"
                    : "bg-navy-900 border border-navy-850 hover:border-navy-800"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-whatsapp text-navy-950 text-[10px] font-extrabold uppercase tracking-wider">
                    Populer
                  </div>
                )}

                <h3 className="font-[var(--font-title)] font-bold text-white text-lg mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-[var(--font-title)] font-extrabold text-3xl text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500">{plan.period}</span>
                </div>

                <hr className="border-navy-850 my-4" />

                <ul className="space-y-3 flex-grow mb-6">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <i className="fa-solid fa-check text-whatsapp text-xs mt-1 shrink-0"></i>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${
                    plan.highlight
                      ? "bg-whatsapp hover:bg-whatsapp-dark text-navy-950 shadow-glow-emerald"
                      : "bg-navy-800 hover:bg-navy-750 text-white border border-navy-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-navy-850 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-whatsapp to-emerald-400 flex items-center justify-center text-white text-sm">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <span className="font-[var(--font-title)] font-extrabold text-sm text-white">
              FinChat<span className="text-whatsapp">.AI</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Syarat & Ketentuan
            </a>
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Dokumentasi API
            </a>
          </div>

          <p className="text-xs text-slate-600">
            © 2026 FinChat.AI — All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {showPromo && (
        <PromoModal
          onClose={() => setShowPromo(false)}
          onSelectPlan={handleSubscribe}
        />
      )}
      {showPayment && (
        <PaymentMockup
          plan={selectedPlan}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

// ========== SIMULATOR DEMO COMPONENT ==========
function SimulatorDemo() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: 'Halo! 👋 Silakan ketik transaksi harian seperti mengobrol biasa!\n\nContoh:\n• "masuk donasi iuran ukm 2.5 juta"\n• "bayar fotokopi modul BEM 500rb"\n• "beli kopi sachet ceban buat konsumsi"',
    },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || processing) return;
    const text = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { type: "user", text }]);
    setProcessing(true);

    setTimeout(() => {
      const result = parseWithLocalNLP(text, []);

      if (result.success) {
        const reply =
          `✅ *BERHASIL DIARSIPKAN*\n\n` +
          `• Kategori: ${result.category}\n` +
          `• Nominal: ${formatRupiah(result.amount)}\n` +
          `• Aliran: ${result.type === "expense" ? "Pengeluaran (-)" : "Pemasukan (+)"}\n\n` +
          `Database dashboard terupdate secara real-time.`;
        setMessages((prev) => [...prev, { type: "bot", text: reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: '❌ AI tidak dapat mengidentifikasi nominal keuangan.\n\nCoba format kasual seperti:\n"beli bensin goceng" atau "terima iuran kas 50k"',
          },
        ]);
      }

      setProcessing(false);
    }, 800);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-[#0b141a] rounded-2xl overflow-hidden border border-emerald-800/30 shadow-2xl">
        {/* Header */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 text-white">
          <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center text-white relative">
            <i className="fa-solid fa-robot"></i>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075e54]"></span>
          </div>
          <div>
            <p className="font-bold text-xs">FinChat.AI Simulator</p>
            <p className="text-[10px] text-emerald-200">
              Demo Interaktif • Tanpa Login
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[360px] overflow-y-auto p-4 space-y-3 flex flex-col">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] text-xs p-3 rounded-lg shadow-md animate-fade-in ${
                m.type === "user"
                  ? "self-end bg-[#005c4b] text-white rounded-br-none"
                  : "self-start bg-[#1f2c34] text-slate-200 rounded-bl-none border-l-4 border-whatsapp"
              }`}
            >
              {m.type === "bot" && (
                <p className="font-semibold text-whatsapp mb-1">
                  FinChat.AI Bot 🤖
                </p>
              )}
              <p className="whitespace-pre-line">{m.text}</p>
            </div>
          ))}
          {processing && (
            <div className="self-start max-w-[85%] bg-[#1f2c34] text-slate-400 text-[10px] p-2 rounded-lg italic animate-pulse">
              AI menyaring keuangan...
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="bg-[#1f2c34] px-3 py-2.5 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Tulis pengeluaran/pemasukan..."
            className="flex-grow px-3 py-2 bg-[#2a3942] rounded-full text-white text-xs focus:outline-none border border-slate-700/30"
          />
          <button
            type="submit"
            disabled={processing}
            className="w-8 h-8 rounded-full bg-whatsapp text-navy-950 flex items-center justify-center hover:bg-whatsapp-dark shadow-md shrink-0 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

// ========== PROMO MODAL ==========
function PromoModal({ onClose, onSelectPlan }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-navy-900 border border-whatsapp/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-navy-800 text-slate-400 hover:text-white transition-colors z-10"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Banner */}
        <div className="relative h-40 bg-gradient-to-r from-[#005c4b] to-emerald-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative text-center z-10">
            <h2 className="font-[var(--font-title)] text-3xl font-extrabold text-white mb-2">
              Penawaran Terbatas! 🎉
            </h2>
            <p className="text-emerald-100 font-medium text-sm">
              Diskon Spesial untuk Upgrade Pertama Anda
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-300 text-center mb-8">
            Pilih paket langganan <strong>Pro</strong> atau{" "}
            <strong>Business</strong> hari ini dan otomatisasi keuangan bisnis
            Anda dengan harga spesial!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pro Plan Promo */}
            <div className="bg-navy-950 border border-navy-800 rounded-2xl p-5 relative overflow-hidden group hover:border-whatsapp/50 transition-colors">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                DISC 50%
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Paket Pro</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-500 line-through">
                  Rp 99.000
                </span>
                <span className="text-2xl font-extrabold text-whatsapp">
                  Rp 49.000
                  <span className="text-xs text-slate-400 font-normal">
                    /bln
                  </span>
                </span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 mb-6">
                <li>
                  <i className="fa-solid fa-check text-whatsapp mr-2"></i>5
                  Organisasi
                </li>
                <li>
                  <i className="fa-solid fa-check text-whatsapp mr-2"></i>AI
                  Parsing Gemini Pro
                </li>
                <li>
                  <i className="fa-solid fa-check text-whatsapp mr-2"></i>
                  Laporan Custom
                </li>
              </ul>
              <button
                onClick={() =>
                  onSelectPlan({ name: "Pro Promo", price: 49000 })
                }
                className="w-full py-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-navy-950 font-bold text-sm transition-all shadow-glow-emerald"
              >
                Ambil Promo Pro
              </button>
            </div>

            {/* Business Plan Promo */}
            <div className="bg-navy-950 border border-navy-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                HEMAT 33%
              </div>
              <h3 className="font-bold text-white text-lg mb-1">
                Paket Business
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-500 line-through">
                  Rp 299.000
                </span>
                <span className="text-2xl font-extrabold text-blue-400">
                  Rp 199.000
                  <span className="text-xs text-slate-400 font-normal">
                    /bln
                  </span>
                </span>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 mb-6">
                <li>
                  <i className="fa-solid fa-check text-blue-400 mr-2"></i>
                  Unlimited Organisasi
                </li>
                <li>
                  <i className="fa-solid fa-check text-blue-400 mr-2"></i>AI
                  Fine-tuning
                </li>
                <li>
                  <i className="fa-solid fa-check text-blue-400 mr-2"></i>
                  Dedicated Support
                </li>
              </ul>
              <button
                onClick={() =>
                  onSelectPlan({ name: "Business Promo", price: 199000 })
                }
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/50"
              >
                Ambil Promo Business
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== PAYMENT MOCKUP ==========
function PaymentMockup({ plan, onClose }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!method) return alert("Pilih metode pembayaran terlebih dahulu!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2); // Success
    }, 2000);
  };

  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-fade-in">
        <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center animate-slide-up shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-4xl text-green-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Pembayaran Berhasil!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Terima kasih telah berlangganan <strong>{plan?.name}</strong>.
            Pembayaran sebesar {formatRupiah(plan?.price || 0)} berhasil
            diterima.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-colors"
          >
            Mulai Gunakan FinChat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-slide-up font-sans">
        {/* Header - Midtrans Style */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
              Total Pembayaran
            </p>
            <p className="text-xl font-extrabold text-slate-800">
              {formatRupiah(plan?.price || 0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">
              Order ID
            </p>
            <p className="text-sm font-semibold text-slate-700">
              #FNC-{Math.floor(Math.random() * 100000)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center gap-3 mb-6 border border-blue-100">
            <i className="fa-solid fa-circle-info"></i>
            <div>
              <strong>Simulasi Pembayaran</strong>
              <p className="text-xs opacity-80 mt-0.5">
                Ini adalah mockup environment Sandbox.
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-slate-700 mb-4 text-sm">
            Pilih Metode Pembayaran
          </h3>

          <div className="space-y-3 mb-8">
            {/* GoPay */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${method === "gopay" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={method === "gopay"}
                  onChange={() => setMethod("gopay")}
                  className="w-4 h-4 text-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  GoPay / QRIS
                </span>
              </div>
              <i className="fa-solid fa-qrcode text-slate-400 text-lg"></i>
            </label>

            {/* Credit Card */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${method === "cc" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={method === "cc"}
                  onChange={() => setMethod("cc")}
                  className="w-4 h-4 text-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  Kartu Kredit / Debit
                </span>
              </div>
              <i className="fa-regular fa-credit-card text-slate-400 text-lg"></i>
            </label>

            {/* Virtual Account */}
            <label
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${method === "va" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={method === "va"}
                  onChange={() => setMethod("va")}
                  className="w-4 h-4 text-emerald-500"
                />
                <span className="font-semibold text-slate-700">
                  Transfer Bank (VA)
                </span>
              </div>
              <i className="fa-solid fa-building-columns text-slate-400 text-lg"></i>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-grow py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>{" "}
                  Memproses...
                </>
              ) : (
                `Bayar Sekarang`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
