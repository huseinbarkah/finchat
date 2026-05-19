import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata = {
  title: "FinChat.AI — Dashboard Keuangan Conversational via WhatsApp",
  description:
    "Catat keuangan organisasi langsung dari obrolan WhatsApp. AI mengubah chat kasual menjadi laporan keuangan profesional secara otomatis.",
  keywords: [
    "keuangan",
    "whatsapp",
    "AI",
    "akuntansi",
    "dashboard",
    "laporan",
    "UMKM",
    "BEM",
  ],
  openGraph: {
    title: "FinChat.AI — Conversational Accounting",
    description: "Dari chat WhatsApp ke laporan keuangan profesional dalam hitungan detik.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-navy-950 text-slate-300 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
