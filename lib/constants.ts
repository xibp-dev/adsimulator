// Konfigurasi ringan yang aman diimpor di client & server (tanpa dependensi).

// Nomor WhatsApp admin untuk konfirmasi pembayaran langganan (format internasional tanpa +)
export const ADMIN_WHATSAPP = "6285770314485";

export function waLink(message: string): string {
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
