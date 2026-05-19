/**
 * FinChat.AI — Client-Side Data Store
 * Uses localStorage for persistence in the demo.
 * In production, replace with API calls to the backend.
 */

const STORAGE_KEY = "finchat_data_v2";

const DEFAULT_DATA = {
  activeWorkspaceId: "bem-unpad",
  workspaces: {
    "bem-unpad": {
      name: "BEM Kema Unpad",
      slug: "bem-unpad",
      email: "bendahara@bem.org",
      categories: ["Donasi", "Kas Kelas", "Alat Kantor", "Transportasi", "Konsumsi", "Lain-lain"],
      transactions: [
        {
          id: "tx-001",
          type: "INCOME",
          amount: 2500000,
          category: "Donasi",
          description: "Donasi iuran UKM",
          rawChatLog: "masuk donasi iuran ukm 2.5 juta",
          whatsappSenderName: "Budi (WA Admin)",
          whatsappSenderNumber: "6281234567890",
          status: "SUCCESS",
          createdAt: "2026-05-19T10:00:00Z",
        },
        {
          id: "tx-002",
          type: "EXPENSE",
          amount: 500000,
          category: "Alat Kantor",
          description: "Fotokopi modul BEM",
          rawChatLog: "bayar fotokopi modul BEM 500rb",
          whatsappSenderName: "Budi (WA Admin)",
          whatsappSenderNumber: "6281234567890",
          status: "SUCCESS",
          createdAt: "2026-05-19T09:00:00Z",
        },
        {
          id: "tx-003",
          type: "INCOME",
          amount: 10000,
          category: "Kas Kelas",
          description: "Iuran anggota kas dari Budi",
          rawChatLog: "dapat iuran anggota kas total ceban dari budi",
          whatsappSenderName: "Siti Nurjanah",
          whatsappSenderNumber: "6289988776655",
          status: "SUCCESS",
          createdAt: "2026-05-18T14:00:00Z",
        },
      ],
      budgets: {
        "Alat Kantor": { limit: 1000000, spent: 500000 },
        Konsumsi: { limit: 1500000, spent: 0 },
        Transportasi: { limit: 500000, spent: 0 },
        "Lain-lain": { limit: 500000, spent: 0 },
      },
      allowedSenders: [
        { name: "Budi (WA Admin)", phone: "6281234567890" },
        { name: "Siti Nurjanah", phone: "6289988776655" },
      ],
      aiRules: [
        { keyword: "goceng", category: "Lain-lain" },
        { keyword: "modul", category: "Alat Kantor" },
        { keyword: "ceban", category: "Kas Kelas" },
        { keyword: "kopi", category: "Konsumsi" },
      ],
    },
    personal: {
      name: "Keuangan Pribadi",
      slug: "personal",
      email: "nurhaliza@personal.me",
      categories: ["Gaji", "Makanan", "Investasi", "Transportasi", "Pakaian", "Lain-lain"],
      transactions: [
        {
          id: "tx-p01",
          type: "INCOME",
          amount: 7500000,
          category: "Gaji",
          description: "Gaji bulanan",
          rawChatLog: "gaji bulanan masuk 7.5jt",
          whatsappSenderName: "Saya",
          status: "SUCCESS",
          createdAt: "2026-05-19T08:00:00Z",
        },
        {
          id: "tx-p02",
          type: "EXPENSE",
          amount: 75000,
          category: "Makanan",
          description: "Beli bakso samrat",
          rawChatLog: "beli bakso samrat 75ribu",
          whatsappSenderName: "Saya",
          status: "SUCCESS",
          createdAt: "2026-05-19T12:00:00Z",
        },
      ],
      budgets: {
        Makanan: { limit: 2000000, spent: 75000 },
        Transportasi: { limit: 1000000, spent: 0 },
        Pakaian: { limit: 800000, spent: 0 },
        "Lain-lain": { limit: 500000, spent: 0 },
      },
      allowedSenders: [{ name: "Nomor Utama Pribadi", phone: "6285721111111" }],
      aiRules: [
        { keyword: "bakso", category: "Makanan" },
        { keyword: "gaji", category: "Gaji" },
      ],
    },
    umkm: {
      name: "Kedai Kopi Kita (UMKM)",
      slug: "umkm",
      email: "finance@kopikita.id",
      categories: ["Penjualan", "Bahan Baku", "Gaji Karyawan", "Sewa Ruko", "Listrik & Air"],
      transactions: [
        {
          id: "tx-u01",
          type: "INCOME",
          amount: 3200000,
          category: "Penjualan",
          description: "Pemasukan kassa hari ini",
          rawChatLog: "pemasukan kassa hari ini 3.2jt",
          whatsappSenderName: "Kasir Roni",
          whatsappSenderNumber: "6282112233445",
          status: "SUCCESS",
          createdAt: "2026-05-19T17:00:00Z",
        },
        {
          id: "tx-u02",
          type: "EXPENSE",
          amount: 1500000,
          category: "Bahan Baku",
          description: "Kulakan biji kopi gayo",
          rawChatLog: "kulakan biji kopi gayo 1.5jt",
          whatsappSenderName: "Kasir Roni",
          whatsappSenderNumber: "6282112233445",
          status: "SUCCESS",
          createdAt: "2026-05-19T09:00:00Z",
        },
      ],
      budgets: {
        "Bahan Baku": { limit: 10000000, spent: 1500000 },
        "Gaji Karyawan": { limit: 4000000, spent: 0 },
        "Listrik & Air": { limit: 1500000, spent: 0 },
      },
      allowedSenders: [
        { name: "Kasir Roni", phone: "6282112233445" },
        { name: "Owner Anton", phone: "62811222333" },
      ],
      aiRules: [
        { keyword: "biji", category: "Bahan Baku" },
        { keyword: "penjualan", category: "Penjualan" },
      ],
    },
  },
  webhookStats: {
    totalRequests: 124,
    isOnline: true,
  },
};

function getStore() {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_DATA;
}

function saveStore(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function loadData() {
  return getStore();
}

export function saveData(data) {
  saveStore(data);
}

export function resetData() {
  saveStore(DEFAULT_DATA);
  return DEFAULT_DATA;
}

export function getActiveWorkspace(data) {
  return data.workspaces[data.activeWorkspaceId];
}
