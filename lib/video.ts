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

export interface MediaEmbedInfo {
  type: "youtube" | "slides" | "pdf" | "office" | "generic";
  embedUrl: string;
}

export function getMediaEmbedInfo(url: string): MediaEmbedInfo | null {
  if (!url) return null;
  const u = url.trim();

  // 1. YouTube check
  const ytId = getYouTubeId(u);
  if (ytId) {
    const embed = getYouTubeEmbedUrl(u);
    return embed ? { type: "youtube", embedUrl: embed } : null;
  }

  // 2. Google Slides check
  if (u.includes("docs.google.com/presentation")) {
    let embedUrl = u;
    const editIndex = u.indexOf("/edit");
    if (editIndex !== -1) {
      embedUrl = u.substring(0, editIndex) + "/embed?start=false&loop=false&delayms=3000";
    } else {
      const pubIndex = u.indexOf("/pub");
      if (pubIndex !== -1) {
        embedUrl = u.substring(0, pubIndex) + "/embed?start=false&loop=false&delayms=3000";
      }
    }
    return { type: "slides", embedUrl };
  }

  // 3. Google Docs Document check
  if (u.includes("docs.google.com/document")) {
    let embedUrl = u;
    const editIndex = u.indexOf("/edit");
    if (editIndex !== -1) {
      embedUrl = u.substring(0, editIndex) + "/preview";
    }
    return { type: "office", embedUrl };
  }

  // 4. Google Drive check (PDF/Doc/Slides)
  if (u.includes("drive.google.com")) {
    let embedUrl = u;
    const viewIndex = u.indexOf("/view");
    if (viewIndex !== -1) {
      embedUrl = u.substring(0, viewIndex) + "/preview";
    } else {
      const editIndex = u.indexOf("/edit");
      if (editIndex !== -1) {
        embedUrl = u.substring(0, editIndex) + "/preview";
      }
    }
    return { type: "pdf", embedUrl };
  }

  // 5. Direct PDF check
  if (u.toLowerCase().endsWith(".pdf") || u.toLowerCase().includes(".pdf?")) {
    return { type: "pdf", embedUrl: u };
  }

  // 6. Microsoft Office Online files (.docx, .pptx, .xlsx)
  const isOfficeFile = /\.(docx|doc|pptx|ppt|xlsx|xls)($|\?)/i.test(u);
  if (isOfficeFile) {
    return {
      type: "office",
      embedUrl: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(u)}`,
    };
  }

  // 7. Generic fallback
  return { type: "generic", embedUrl: u };
}
