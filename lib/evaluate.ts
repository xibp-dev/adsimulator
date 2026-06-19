const BANNED_KEYWORDS = [
  "obat kuat",
  "cepat kaya",
  "garansi 100%",
  "judi",
  "slot",
  "pasti menang",
  "langsing seketika",
  "tanpa modal",
  "pinjaman online",
  "pinjol"
];

export interface AdCopy {
  headline: string;
  primaryText: string;
  description: string;
}

export interface EvaluationResult {
  status: "ACTIVE" | "REJECTED";
  qualityScore: number;
  rejectionReason?: string;
}

export function evaluateAd(copy: AdCopy): EvaluationResult {
  const fullText = `${copy.headline} ${copy.primaryText} ${copy.description}`.toLowerCase();

  // 1. Policy Check
  for (const keyword of BANNED_KEYWORDS) {
    if (fullText.includes(keyword.toLowerCase())) {
      return {
        status: "REJECTED",
        qualityScore: 0,
        rejectionReason: `Melanggar Kebijakan Iklan: Mengandung kata terlarang "${keyword}"`,
      };
    }
  }

  if (fullText.length < 10) {
    return {
      status: "REJECTED",
      qualityScore: 0,
      rejectionReason: "Teks iklan terlalu pendek atau kosong.",
    };
  }

  // 2. Quality Scoring (Base: 1.0)
  // Skor kualitas mempengaruhi metrik (CPM, CTR). Range 0.7 - 1.3
  let score = 1.0;

  // Ciri iklan bagus: teks cukup panjang, terstruktur, ada CTA yang jelas
  if (copy.primaryText.length > 150) score += 0.1; // Cukup menjelaskan produk
  if (copy.primaryText.length > 500) score -= 0.1; // Terlalu bertele-tele
  
  // Cek apakah ada penggunaan emoji (biasanya menaikkan interaksi)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/u;
  if (emojiRegex.test(copy.primaryText) || emojiRegex.test(copy.headline)) {
    score += 0.1;
  }

  // Cek penggunaan huruf kapital berlebih (ciri spam)
  const upperCaseCount = (fullText.match(/[A-Z]/g) || []).length;
  if (upperCaseCount > fullText.length * 0.3 && fullText.length > 20) {
    score -= 0.2; // Kurangi skor jika >30% huruf kapital (teriak-teriak)
  }

  // Cek clickbait ringan
  const clickbaitWords = ["gratis", "diskon", "promo", "terbatas", "sekarang"];
  let clickbaitCount = 0;
  for (const cw of clickbaitWords) {
    if (fullText.includes(cw)) clickbaitCount++;
  }
  if (clickbaitCount > 0 && clickbaitCount <= 2) score += 0.1; // Sedikit clickbait bagus untuk CTR
  if (clickbaitCount > 2) score -= 0.1; // Terlalu banyak clickbait menurunkan kualitas audiens

  // Batasi skor antara 0.7 hingga 1.3
  score = Math.max(0.7, Math.min(1.3, score));

  return {
    status: "ACTIVE",
    qualityScore: parseFloat(score.toFixed(2)),
  };
}
