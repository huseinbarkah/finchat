"use client";

import { useState } from "react";
import { parseWithLocalNLP } from "@/lib/ai-engine";
import { formatRupiah } from "@/lib/utils";

export default function WASimulator({ ws, data, updateData, addToast }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Halo! 👋 Silakan ketik transaksi harian seperti mengobrol biasa!\n\nContoh:\n• \"masuk donasi iuran ukm 2.5 juta\"\n• \"bayar fotokopi modul BEM 500rb\"\n• \"beli kopi sachet ceban buat konsumsi\"" },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || processing) return;
    const text = input.trim();
    setInput("");
    setMessages((p) => [...p, { type: "user", text }]);
    setProcessing(true);

    if (!data.webhookStats.isOnline) {
      setTimeout(() => {
        setMessages((p) => [...p, { type: "bot", text: "⚠️ *SERVER OFFLINE*\n\nSistem gagal merespon karena server sedang maintenance." }]);
        setProcessing(false);
      }, 800);
      return;
    }

    data.webhookStats.totalRequests++;

    setTimeout(() => {
      const result = parseWithLocalNLP(text, ws.aiRules, ws.categories);

      if (result.success) {
        const reply = `✅ *BERHASIL DIARSIPKAN*\n\n• Kategori: ${result.category}\n• Nominal: ${formatRupiah(result.amount)}\n• Aliran: ${result.type === "expense" ? "Pengeluaran (-)" : "Pemasukan (+)"}\n\nDatabase dashboard terupdate secara real-time.`;
        setMessages((p) => [...p, { type: "bot", text: reply }]);

        const tx = {
          id: "tx-" + Date.now(),
          type: result.type === "income" ? "INCOME" : "EXPENSE",
          amount: result.amount,
          category: result.category,
          description: result.description,
          rawChatLog: text,
          whatsappSenderName: "Simulator User",
          status: "SUCCESS",
          createdAt: new Date().toISOString(),
        };
        ws.transactions.unshift(tx);

        if (tx.type === "EXPENSE" && ws.budgets[tx.category]) {
          ws.budgets[tx.category].spent += tx.amount;
        }

        updateData(data);
        addToast("Parsing Chat Berhasil", `"${result.category}" ${formatRupiah(result.amount)}`, "success");
      } else {
        setMessages((p) => [...p, { type: "bot", text: "❌ *AI GAGAL MENYARING CHAT*\n\nSistem tidak dapat mengidentifikasi nominal.\n\nCoba: \"beli bensin goceng\" atau \"terima iuran kas 50k\"" }]);
        addToast("Parsing Gagal", "AI gagal mengidentifikasi nominal.", "danger");
      }

      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col justify-end items-end">
      <button onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-navy-950 flex items-center justify-center shadow-2xl hover:shadow-whatsapp/30 cursor-pointer transition-all border border-emerald-400/20 animate-pulse-glow">
        <i className={`fa-${open ? "solid fa-xmark" : "brands fa-whatsapp"} text-2xl`}></i>
      </button>

      {open && (
        <div className="flex flex-col bg-[#0b141a] w-[350px] h-[500px] rounded-2xl overflow-hidden border border-emerald-800/30 shadow-2xl mt-4 animate-fade-in-scale">
          <div className="bg-[#075e54] px-4 py-3 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700/80 flex items-center justify-center relative">
                <i className="fa-solid fa-robot"></i>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075e54]"></span>
              </div>
              <div>
                <p className="font-bold text-xs">FinChat.AI Assistant</p>
                <p className="text-[10px] text-emerald-200">Asisten Pembukuan Otomatis</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:text-white text-slate-200 transition-colors"><i className="fa-solid fa-minus text-sm"></i></button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3 flex flex-col" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: "50%" }}>
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] text-xs p-2.5 rounded-lg shadow-md animate-fade-in ${m.type === "user" ? "self-end bg-[#005c4b] text-white rounded-br-none" : "self-start bg-[#1f2c34] text-slate-200 rounded-bl-none border-l-4 border-whatsapp"}`}>
                {m.type === "bot" && <p className="font-semibold text-whatsapp mb-1">FinChat.AI Bot 🤖</p>}
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[8px] mt-1 ${m.type === "user" ? "text-emerald-300 text-right" : "text-slate-500"}`}>
                  {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {processing && <div className="self-start max-w-[85%] bg-[#1f2c34] text-slate-400 text-[10px] p-2 rounded-lg italic animate-pulse">AI menyaring keuangan...</div>}
          </div>

          <form onSubmit={handleSend} className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2 shrink-0">
            <input value={input} onChange={(e) => setInput(e.target.value)} type="text" autoComplete="off" placeholder="Tulis pengeluaran/pemasukan..." className="flex-grow px-3 py-2 bg-[#2a3942] rounded-full text-white text-xs focus:outline-none border border-slate-700/30" />
            <button type="submit" disabled={processing} className="w-8 h-8 rounded-full bg-whatsapp text-navy-950 flex items-center justify-center hover:bg-whatsapp-dark shadow-md shrink-0 transition-colors disabled:opacity-50">
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
