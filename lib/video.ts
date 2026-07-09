// Utilitas untuk mengubah berbagai bentuk URL YouTube menjadi URL embed (mode privasi).

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const u = url.trim();
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = u.match(p);
    if (m) return m[1];
  }
  // Bila admin menempel ID mentah (11 karakter)
  if (/^[\w-]{11}$/.test(u)) return u;
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",             // jangan tampilkan video terkait dari channel lain
    modestbranding: "1",  // kecilkan branding YouTube
    playsinline: "1",     // putar inline di iOS
    iv_load_policy: "3",  // sembunyikan anotasi
  });
  // youtube-nocookie = mode privasi (privacy-enhanced)
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
