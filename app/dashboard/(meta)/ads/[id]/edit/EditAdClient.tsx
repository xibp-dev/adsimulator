"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ImagePlus,
  Plus,
  Trash2,
  PlayCircle,
  Image as ImageIcon,
  Link2,
} from "lucide-react";
import { MOCK_PAGES, MOCK_INSTAGRAM, CTA_OPTIONS } from "@/lib/mockData";
import { CTA } from "@/types";

interface Ad {
  id: string;
  name: string;
  format: string;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  destinationUrl: string;
  mediaUrls: string[];
  identityPage: string;
  identityInstagram: string;
}

export default function EditAdClient({ ad }: { ad: Ad }) {
  const router = useRouter();

  const [name, setName] = useState(ad.name);
  const [format, setFormat] = useState<"SINGLE_IMAGE_VIDEO" | "CAROUSEL" | "COLLECTION">(
    ad.format as "SINGLE_IMAGE_VIDEO" | "CAROUSEL" | "COLLECTION"
  );
  const [mediaUrls, setMediaUrls] = useState<string[]>(ad.mediaUrls ?? []);
  const [primaryText, setPrimaryText] = useState(ad.primaryText ?? "");
  const [headline, setHeadline] = useState(ad.headline ?? "");
  const [description, setDescription] = useState(ad.description ?? "");
  const [cta, setCta] = useState<CTA>((ad.cta as CTA) ?? "LEARN_MORE");
  const [destinationUrl, setDestinationUrl] = useState(ad.destinationUrl ?? "");
  const [identityPage, setIdentityPage] = useState(ad.identityPage ?? "");
  const [identityInstagram, setIdentityInstagram] = useState(ad.identityInstagram ?? "");
  const [pages, setPages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((dbPages) => {
        if (Array.isArray(dbPages) && dbPages.length > 0) {
          setPages(dbPages.map((p: any) => p.name));
        } else {
          setPages(MOCK_PAGES);
        }
      })
      .catch(() => setPages(MOCK_PAGES));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          primaryText,
          headline,
          description,
          cta,
          destinationUrl,
          mediaUrls,
        }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan perubahan");
      router.push("/dashboard/ads-manager");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const isYouTube = (mediaUrls[0] ?? "").startsWith("yt:");

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#dddfe2] px-4 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#1c2b33] px-2 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div>
            <h1 className="text-sm font-bold text-[#1c2b33]">Edit Iklan</h1>
            <p className="text-xs text-gray-400">{ad.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="px-3 py-1.5 text-sm font-semibold text-[#1c2b33] hover:bg-gray-100 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1c2b33]">Pengaturan iklan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ubah materi kreatif, teks, dan tujuan iklan Anda.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Nama iklan */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <label className="block text-sm font-semibold text-[#1c2b33] mb-1.5">Nama iklan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Iklan 1"
              className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
            />
          </section>

          {/* Identitas */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-3">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Identitas</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Halaman Facebook
              </label>
              <select
                value={identityPage}
                onChange={(e) => setIdentityPage(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              >
                <option value="">Pilih Halaman</option>
                {pages.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Akun Instagram
              </label>
              <select
                value={identityInstagram}
                onChange={(e) => setIdentityInstagram(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              >
                <option value="">Pilih akun Instagram</option>
                {MOCK_INSTAGRAM.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Format */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5">
            <h3 className="font-semibold text-sm text-[#1c2b33] mb-3">Format</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "SINGLE_IMAGE_VIDEO", label: "Gambar atau video tunggal" },
                { value: "CAROUSEL", label: "Carousel" },
                { value: "COLLECTION", label: "Koleksi" },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setFormat(f.value as "SINGLE_IMAGE_VIDEO" | "CAROUSEL" | "COLLECTION");
                    setMediaUrls([]);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium text-center transition-colors ${
                    format === f.value
                      ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]"
                      : "border-[#dddfe2] text-[#1c2b33] hover:bg-gray-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* Materi iklan */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-3">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Materi iklan</h3>

            {/* SINGLE */}
            {format === "SINGLE_IMAGE_VIDEO" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {[
                    { val: "image", icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Gambar (URL)" },
                    { val: "video", icon: <PlayCircle className="w-3.5 h-3.5" />, label: "Video YouTube" },
                  ].map((t) => {
                    const active = t.val === "video" ? isYouTube : !isYouTube;
                    return (
                      <button
                        key={t.val}
                        type="button"
                        onClick={() => setMediaUrls([])}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          active
                            ? "border-[#0866FF] bg-[#e7f0ff] text-[#0866FF]"
                            : "border-[#dddfe2] text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {t.icon} {t.label}
                      </button>
                    );
                  })}
                </div>

                {!isYouTube && (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="url"
                        value={mediaUrls[0] ?? ""}
                        onChange={(e) => setMediaUrls([e.target.value])}
                        placeholder="https://contoh.com/gambar.jpg"
                        className="flex-1 px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
                      />
                    </div>
                    {mediaUrls[0] && (
                      <div className="rounded-lg overflow-hidden border border-[#dddfe2] bg-gray-50 h-40 flex items-center justify-center">
                        <img
                          src={mediaUrls[0]}
                          alt="preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      Masukkan URL gambar publik (JPG, PNG, WebP).
                    </p>
                  </div>
                )}

                {isYouTube && (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <PlayCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <input
                        type="url"
                        value={(mediaUrls[0] ?? "").replace("yt:", "")}
                        onChange={(e) => setMediaUrls(["yt:" + e.target.value])}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
                      />
                    </div>
                    {(mediaUrls[0] ?? "").length > 3 &&
                      (() => {
                        const url = (mediaUrls[0] ?? "").replace("yt:", "");
                        const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
                        return match ? (
                          <div className="rounded-lg overflow-hidden border border-[#dddfe2] aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${match[1]}`}
                              className="w-full h-full"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <p className="text-xs text-red-400">URL YouTube tidak valid.</p>
                        );
                      })()}
                    <p className="text-xs text-gray-400">
                      Tempel URL video YouTube. Embed akan muncul di preview.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMediaUrls(isYouTube ? [] : ["yt:"]);
                  }}
                  className="text-xs text-[#0866FF] hover:underline"
                >
                  {isYouTube ? "← Ganti ke gambar" : "Pakai video YouTube →"}
                </button>
              </div>
            )}

            {/* CAROUSEL */}
            {format === "CAROUSEL" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Tambahkan 2–10 kartu. Setiap kartu bisa punya gambar berbeda.
                </p>
                {(mediaUrls.length ? mediaUrls : [""]).map((url, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0866FF] text-white text-[10px] font-bold flex items-center justify-center mt-2">
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const updated = [...mediaUrls];
                            updated[i] = e.target.value;
                            setMediaUrls(updated);
                          }}
                          placeholder={`URL gambar kartu ${i + 1}`}
                          className="flex-1 px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
                        />
                        {mediaUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setMediaUrls(mediaUrls.filter((_, idx) => idx !== i))}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {url && (
                        <div className="h-20 w-32 rounded-lg overflow-hidden border border-[#dddfe2] bg-gray-50">
                          <img
                            src={url}
                            alt={`kartu ${i + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {mediaUrls.length < 10 && (
                  <button
                    type="button"
                    onClick={() => setMediaUrls([...mediaUrls, ""])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#0866FF] hover:bg-[#e7f0ff] px-3 py-2 rounded-lg border border-[#0866FF] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah kartu
                  </button>
                )}
              </div>
            )}

            {/* COLLECTION */}
            {format === "COLLECTION" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Format Koleksi terdiri dari 1 gambar/video utama + min. 3 gambar produk di
                  bawahnya.
                </p>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Gambar/Video Utama (Cover)
                  </label>
                  <input
                    type="url"
                    value={mediaUrls[0] ?? ""}
                    onChange={(e) => {
                      const updated = [...(mediaUrls.length >= 4 ? mediaUrls : ["", "", "", ""])];
                      updated[0] = e.target.value;
                      setMediaUrls(updated);
                    }}
                    placeholder="URL gambar cover"
                    className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
                  />
                </div>
                <label className="text-xs font-semibold text-gray-500 block">
                  Gambar Produk (min. 3)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="space-y-1">
                      <input
                        type="url"
                        value={mediaUrls[n] ?? ""}
                        onChange={(e) => {
                          const updated = [
                            ...(mediaUrls.length >= 4 ? mediaUrls : ["", "", "", ""]),
                          ];
                          while (updated.length <= n) updated.push("");
                          updated[n] = e.target.value;
                          setMediaUrls(updated);
                        }}
                        placeholder={`Produk ${n}`}
                        className="w-full px-2 py-1.5 border border-[#dddfe2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0866FF] font-mono"
                      />
                      {mediaUrls[n] && (
                        <div className="h-16 rounded-lg overflow-hidden border border-[#dddfe2] bg-gray-50">
                          <img
                            src={mediaUrls[n]}
                            alt={`produk ${n}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Teks iklan */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Teks iklan</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Teks utama</label>
              <textarea
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                placeholder="Beri tahu orang tentang iklan Anda..."
                rows={3}
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Judul</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Tulis judul Anda di sini"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi opsional"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              />
            </div>
          </section>

          {/* Tujuan */}
          <section className="bg-white rounded-xl border border-[#dddfe2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#1c2b33]">Tujuan</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                URL situs web / Tujuan
              </label>
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                placeholder="https://situsanda.com"
                className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Tombol ajakan bertindak
              </label>
              <select
                value={cta}
                onChange={(e) => setCta(e.target.value as CTA)}
                className="w-full px-3 py-2.5 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
              >
                {CTA_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        </div>

        {/* Bottom save button */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => router.push("/dashboard/ads-manager")}
            className="px-5 py-2.5 text-sm font-semibold text-[#1c2b33] bg-white border border-[#dddfe2] hover:bg-gray-50 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] disabled:opacity-50 text-white rounded-lg"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
