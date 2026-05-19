"use client";

export default function Toast({ toasts, onRemove }) {
  const icons = {
    success: "fa-circle-check text-whatsapp",
    warning: "fa-circle-exclamation text-amber-500",
    danger: "fa-circle-xmark text-red-500",
    info: "fa-circle-info text-blue-500",
  };
  const borders = {
    success: "border-whatsapp",
    warning: "border-amber-500",
    danger: "border-red-500",
    info: "border-blue-500",
  };

  return (
    <div className="fixed top-6 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={`p-4 bg-navy-900 border-l-4 ${borders[t.type]} rounded-xl shadow-2xl flex items-start gap-3 w-80 animate-fade-in pointer-events-auto`}>
          <div className="text-base mt-0.5"><i className={`fa-solid ${icons[t.type]}`}></i></div>
          <div className="flex-grow">
            <h4 className="font-[var(--font-title)] font-bold text-xs text-white">{t.title}</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">{t.message}</p>
          </div>
          <button onClick={() => onRemove(t.id)} className="text-slate-500 hover:text-white transition-colors text-xs"><i className="fa-solid fa-xmark"></i></button>
        </div>
      ))}
    </div>
  );
}
