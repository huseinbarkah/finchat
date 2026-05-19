/**
 * Format integer rupiah to "Rp X.XXX.XXX" display string
 */
export function formatRupiah(val) {
  if (val === null || val === undefined) return "Rp 0";
  const abs = Math.abs(val);
  return "Rp " + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format date to Indonesian locale string
 */
export function formatDateID(date) {
  const d = new Date(date);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Get current month-year string for budget queries
 */
export function getCurrentMonthYear() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[tag] || tag)
  );
}

/**
 * Generate a simple unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
