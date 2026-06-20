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
  // Bersihkan: trim whitespace, uppercase, hapus karakter non-printable
  const raw = staticQris.trim().toUpperCase().replace(/[^\x20-\x7E]/g, "");

  // Validasi dasar: QRIS harus diawali "000201"
  if (!raw.startsWith("000201")) {
    throw new Error("Format QRIS tidak valid (harus diawali 000201)");
  }

  // Cari posisi tag 6304 secara aktif (bukan asumsi posisi fixed)
  const crcTagIndex = raw.lastIndexOf("6304");
  if (crcTagIndex === -1) {
    throw new Error("Format QRIS tidak valid (tidak ditemukan CRC tag 6304)");
  }

  // Ambil body (semua sebelum 6304) dan CRC asli (4 char setelah 6304)
  const body = raw.substring(0, crcTagIndex);

  // Ubah Point of Initiation Method: tag 01 value "11" → "12"
  let modified = body.replace("000201010211", "000201010212");
  // Jika sudah 12 (dynamic), biarkan saja
  if (!modified.includes("000201010212")) {
    modified = body; // fallback: tidak ubah
  }

  // Sisipkan tag 54 (Transaction Amount) sebelum tag 58 (Country Code)
  const amountStr = Math.round(amount).toString();
  const tag54 = tlv("54", amountStr);

  if (modified.includes("5802")) {
    modified = modified.replace("5802", `${tag54}5802`);
  } else {
    modified = modified + tag54;
  }

  // Hitung ulang CRC
  const withCrcTag = modified + "6304";
  const checksum = crc16(withCrcTag);

  return withCrcTag + checksum;
}

/** Validasi apakah sebuah string adalah QRIS yang valid */
export function isValidQris(raw: string): boolean {
  try {
    const trimmed = raw.trim().toUpperCase().replace(/[^\x20-\x7E]/g, "");
    if (!trimmed.startsWith("000201")) return false;
    if (!trimmed.includes("6304")) return false;
    if (trimmed.length < 20) return false;
    // Verifikasi CRC format (4 hex chars setelah 6304 terakhir)
    const crcIdx = trimmed.lastIndexOf("6304");
    const crcValue = trimmed.substring(crcIdx + 4, crcIdx + 8);
    return /^[0-9A-F]{4}$/.test(crcValue);
  } catch {
    return false;
  }
}

