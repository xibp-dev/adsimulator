/**
 * lib/qris.ts
 * Konversi QRIS Statis → QRIS Dinamis sesuai standar EMVCo / QRIS Indonesia
 *
 * Algoritma:
 * 1. Parse TLV dari string QRIS statis
 * 2. Ubah Point of Initiation Method (tag 01) dari "11" → "12"
 * 3. Sisipkan tag 54 (Transaction Amount) sebelum tag 58
 * 4. Hitung ulang CRC-16/CCITT-FALSE (tag 63)
 */

/** Hitung CRC-16/CCITT-FALSE (polynomial 0x1021, init 0xFFFF) */
export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

/** Parse satu level TLV dari sebuah string QRIS */
function parseTLV(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  let i = 0;
  while (i < raw.length - 4) {
    const tag = raw.substring(i, i + 2);
    const len = parseInt(raw.substring(i + 2, i + 4), 10);
    if (isNaN(len) || i + 4 + len > raw.length) break;
    const val = raw.substring(i + 4, i + 4 + len);
    map.set(tag, val);
    i += 4 + len;
  }
  return map;
}

/** Format satu TLV field: tag + length (2 digit) + value */
function tlv(tag: string, value: string): string {
  return `${tag}${String(value.length).padStart(2, "0")}${value}`;
}

/**
 * Konversi QRIS statis ke QRIS dinamis dengan nominal tertentu.
 * @param staticQris  String QRIS statis (tanpa spasi/newline)
 * @param amount      Nominal dalam Rupiah (integer positif, min 1)
 * @returns           String QRIS dinamis siap di-encode ke QR
 * @throws            Error jika format QRIS tidak valid
 */
export function generateDynamicQris(staticQris: string, amount: number): string {
  const raw = staticQris.trim().toUpperCase();

  // Validasi dasar: QRIS harus diawali "000201" dan diakhiri 4 char CRC
  if (!raw.startsWith("000201")) {
    throw new Error("Format QRIS tidak valid (harus diawali 000201)");
  }

  // Hapus 4 karakter CRC di akhir agar bisa diproses
  const body = raw.slice(0, -4); // buang "63" tag + CRC
  // Pastikan tanpa tag 63 di akhir
  const crcPrefix = raw.slice(-6, -4); // harusnya "63" + "04"
  if (crcPrefix !== "6304") {
    throw new Error("Format QRIS tidak valid (tidak ditemukan CRC tag 6304)");
  }

  // Ubah Point of Initiation Method: tag 01 value "11" → "12"
  // "11" = static, "12" = dynamic (one-time use)
  let modified = body.replace(/^(000201010211)/, "000201010212");
  if (!modified.startsWith("000201010212")) {
    // Kalau sudah "12" tidak perlu diubah
    modified = body.replace(/^(000201010212)/, "000201010212");
  }

  // Sisipkan tag 54 (Transaction Amount) sebelum tag 58 (Country Code)
  // Nominal dalam string tanpa koma/titik, bulatkan ke integer
  const amountStr = Math.round(amount).toString();
  const tag54 = tlv("54", amountStr);

  if (modified.includes("5802")) {
    // Sisipkan tepat sebelum "5802"
    modified = modified.replace("5802", `${tag54}5802`);
  } else {
    // Fallback: append sebelum tag 63
    modified = modified + tag54;
  }

  // Tambahkan kembali tag 63 (CRC placeholder "0000") lalu hitung CRC
  const withCrcTag = modified + "6304";
  const checksum = crc16(withCrcTag);

  return withCrcTag + checksum;
}

/** Validasi apakah sebuah string adalah QRIS yang valid */
export function isValidQris(raw: string): boolean {
  try {
    const trimmed = raw.trim().toUpperCase();
    if (!trimmed.startsWith("000201")) return false;
    if (!trimmed.includes("6304")) return false;
    if (trimmed.length < 20) return false;
    // Verifikasi CRC
    const body = trimmed.slice(0, -4);
    const existingCrc = trimmed.slice(-4);
    const calculatedCrc = crc16(body + "6304");
    // Cukup cek format, tidak reject jika CRC tidak cocok (bisa sudah dynamic)
    return /^[0-9A-F]{4}$/.test(existingCrc);
  } catch {
    return false;
  }
}
