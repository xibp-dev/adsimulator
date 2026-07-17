"use client";

import { useState, useEffect } from "react";
import { 
  Globe, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  Trash2, 
  Edit3,
  Code,
  FileText,
  AlertTriangle,
  MousePointerClick
} from "lucide-react";
import Link from "next/link";
import GuidePanel from "@/components/create/GuidePanel";

interface Pixel {
  id: string;
  name: string;
  websiteUrl: string;
}

interface LandingPageConfig {
  id: string;
  name: string;
  pixelCode: string;
  template: "ecommerce" | "leadform" | "simple";
  title: string;
  headline: string;
  description: string;
  price: string;
  ctaText: string;
  buttonEvent: string; // Configurable event name (e.g. Purchase, AddToCart, Lead, etc.)
  imageUrl: string;
  createdAt: string;
}

const TEMPLATES = [
  { id: "ecommerce", name: "E-Commerce (Produk)", desc: "Cocok untuk jualan produk fisik dengan harga & tombol beli." },
  { id: "leadform", name: "Lead Form (Pendaftaran)", desc: "Cocok untuk webinar, formulir pendaftaran, atau e-book." },
  { id: "simple", name: "Simple Article", desc: "Halaman informasi sederhana dengan tombol aksi WhatsApp / Link." },
];

const STANDARD_EVENTS = [
  { value: "Purchase", label: "Purchase (Pembelian)" },
  { value: "Lead", label: "Lead (Pendaftaran/Prospek)" },
  { value: "AddToCart", label: "AddToCart (Tambah ke Keranjang)" },
  { value: "InitiateCheckout", label: "InitiateCheckout (Mulai Pembayaran)" },
  { value: "Contact", label: "Contact (Hubungi Kami)" },
  { value: "custom", label: "Custom Event (Kustom)" },
];

const DEFAULT_IMAGES = [
  { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", label: "Smartwatch" },
  { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", label: "Sneakers" },
  { url: "https://images.unsplash.com/photo-1496181130204-7552cc154d78?w=500&q=80", label: "Laptop/Work" },
  { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", label: "Headphones" },
];

function extractPixelId(code: string): string | null {
  if (!code) return null;
  const initMatch = code.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
  if (initMatch && initMatch[1]) {
    return initMatch[1].trim();
  }
  const noscriptMatch = code.match(/id=([^&"'\s>]+)/);
  if (noscriptMatch && noscriptMatch[1]) {
    return noscriptMatch[1].trim();
  }
  const trimmed = code.trim();
  if (trimmed.length >= 15 && !trimmed.includes("<script")) {
    return trimmed;
  }
  return null;
}

export default function LandingPagesBuilder() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [pages, setPages] = useState<LandingPageConfig[]>([]);
  const [fetchingPixels, setFetchingPixels] = useState(true);
  const [fetchingPages, setFetchingPages] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [pixelCode, setPixelCode] = useState("");
  const [template, setTemplate] = useState<"ecommerce" | "leadform" | "simple">("ecommerce");
  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("299000");
  const [ctaText, setCtaText] = useState("Beli Sekarang");
  const [buttonEvent, setButtonEvent] = useState("Purchase");
  const [customEventName, setCustomEventName] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGES[0].url);
  const [showForm, setShowForm] = useState(false);

  // Load Pixels
  useEffect(() => {
    const fetchPixels = async () => {
      try {
        const res = await fetch("/api/pixels");
        if (res.ok) {
          const data = await res.json();
          setPixels(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingPixels(false);
      }
    };
    fetchPixels();
  }, []);

  // Load pages from API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/landing-pages");
        if (res.ok) {
          const data = await res.json();
          setPages(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingPages(false);
      }
    };
    fetchPages();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const extractedId = extractPixelId(pixelCode);
    if (!extractedId) {
      alert("Kode Meta Pixel tidak valid! Harap salin seluruh blok kode dari tab 'Pixel Tracker' dan tempel di area script.");
      return;
    }

    const finalButtonEvent = buttonEvent === "custom" ? customEventName.trim() : buttonEvent;
    if (!finalButtonEvent) {
      alert("Nama event kustom tidak boleh kosong!");
      return;
    }

    const payload = { name, pixelCode, template, title, headline, description, price, ctaText, buttonEvent: finalButtonEvent, imageUrl, trackingRules: [] };

    try {
      if (editingId) {
        const res = await fetch(`/api/landing-pages/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setPages(prev => prev.map(p => p.id === editingId ? updated : p));
        }
      } else {
        const res = await fetch("/api/landing-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setPages(prev => [created, ...prev]);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan. Coba lagi.");
      return;
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPixelCode("");
    setTemplate("ecommerce");
    setTitle("");
    setHeadline("");
    setDescription("");
    setPrice("299000");
    setCtaText("Beli Sekarang");
    setButtonEvent("Purchase");
    setCustomEventName("");
    setImageUrl(DEFAULT_IMAGES[0].url);
  };

  const startEdit = (page: LandingPageConfig) => {
    setEditingId(page.id);
    setName(page.name);
    setPixelCode(page.pixelCode);
    setTemplate(page.template);
    setTitle(page.title);
    setHeadline(page.headline);
    setDescription(page.description);
    setPrice(page.price);
    setCtaText(page.ctaText);
    
    // Check if the saved event is a standard one
    const isStandard = STANDARD_EVENTS.some(ev => ev.value === page.buttonEvent);
    if (isStandard) {
      setButtonEvent(page.buttonEvent);
      setCustomEventName("");
    } else {
      setButtonEvent("custom");
      setCustomEventName(page.buttonEvent);
    }

    setImageUrl(page.imageUrl);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus landing page ini?")) return;
    try {
      const res = await fetch(`/api/landing-pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPages(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#dddfe2]">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Latihan Integrasi</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-600" />
              Custom Landing Page Builder
            </h1>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat Landing Page
          </button>
        )}
      </div>

      {/* Guide Panel – Landing Page Builder */}
      <GuidePanel
        title="🌐 Panduan: Custom Landing Page Builder"
        summary="Landing Page adalah halaman web khusus yang dikunjungi orang setelah mengklik iklanmu. Kualitas landing page sangat menentukan apakah pengunjung jadi beli/daftar atau tidak. Di sini kamu bisa buat landing page terintegrasi langsung dengan Meta Pixel untuk tracking konversi otomatis."
        tips={[
          {
            field: "Nama Landing Page",
            what: "Label internal untuk membedakan halaman-halamanmu.",
            recommendation: "Gunakan nama yang menggambarkan kampanye, misal: 'LP - Promo Akhir Tahun Produk A' atau 'LP - Webinar Marketing Digital Juli'. Ini memudahkan kamu saat mengelola banyak landing page.",
          },
          {
            field: "Template Halaman",
            what: "Desain awal yang bisa dipilih sesuai jenis bisnis: E-Commerce (produk fisik), Lead Form (pendaftaran), atau Simple Article (informasi umum).",
            recommendation: "E-Commerce: untuk produk dengan harga dan tombol beli. Lead Form: untuk webinar, kursus, atau pendaftaran. Simple Article: untuk konten edukasi yang mengarahkan ke WhatsApp.",
          },
          {
            field: "Integrasi Kode Meta Pixel",
            what: "Blok kode JavaScript dari Meta Pixel yang ditempelkan di landing page agar setiap kunjungan dan tindakan pengguna terdeteksi oleh Meta.",
            recommendation: "Salin kode pixel dari menu 'Pixel Tracker', lalu tempel seluruhnya di kolom ini. Jangan edit kode pixel — bahkan satu karakter yang salah bisa mematikan tracking. Setelah tersimpan, verifikasi di Meta Events Manager.",
          },
          {
            field: "Judul & Headline",
            what: "Judul utama (title) yang muncul di tab browser, dan headline yang besar dan langsung terlihat pengunjung.",
            recommendation: "Headline harus langsung menyebut manfaat utama atau penawaran terbaik, misal: 'Hemat 50% Hari Ini!' atau 'Belajar Meta Ads dari Nol sampai Mahir'. Hindari headline generik seperti 'Selamat Datang'.",
          },
          {
            field: "Tombol CTA & Event Pixel",
            what: "Tombol aksi di landing page (misal 'Beli Sekarang') yang sekaligus memicu pengiriman event ke Meta Pixel saat diklik.",
            recommendation: "Pilih event yang sesuai tujuan: 'Purchase' untuk penjualan, 'Lead' untuk pendaftaran, 'Contact' untuk WhatsApp. Event yang tepat membantu Meta mengoptimalkan kampanye ke orang yang paling mungkin melakukan tindakan tersebut.",
          },
          {
            field: "Gambar Produk",
            what: "Visual utama yang muncul di landing page. Ini adalah elemen pertama yang dilihat pengunjung.",
            recommendation: "Gunakan foto produk berkualitas tinggi dengan background putih atau kontras. Resolusi minimal 800x800px. Tambahkan gambar lifestyle (produk dalam penggunaan nyata) untuk meningkatkan kepercayaan.",
          },
        ]}
      />

      {showForm && (
        <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              {editingId ? "Edit Landing Page" : "Buat Landing Page Baru"}
            </h2>
            <div className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Wajib Tempel Kode Pixel Manual
            </div>
          </div>

          <form onSubmit={handleCreateOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Page Content */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Nama Halaman (Internal)</label>
                  <input
                    type="text"
                    placeholder="Contoh: LP Penjualan Smartwatch A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Pilih Template Halaman</label>
                  <div className="grid grid-cols-1 gap-2">
                    {TEMPLATES.map(t => (
                      <label
                        key={t.id}
                        className={`border rounded-lg p-3 flex flex-col cursor-pointer transition-all ${
                          template === t.id 
                            ? "border-indigo-500 bg-indigo-50/50" 
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="template"
                            checked={template === t.id}
                            onChange={() => {
                              setTemplate(t.id as any);
                              if (t.id === "leadform") {
                                setCtaText("Daftar Sekarang");
                                setButtonEvent("Lead");
                              } else if (t.id === "simple") {
                                setCtaText("Hubungi Via WhatsApp");
                                setButtonEvent("Contact");
                              } else {
                                setCtaText("Beli Sekarang");
                                setButtonEvent("Purchase");
                              }
                            }}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="font-bold text-sm text-gray-800">{t.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-5 mt-0.5">{t.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Judul Produk / Nama Brand</label>
                  <input
                    type="text"
                    placeholder="Contoh: Smartwatch Pro X"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Headline Penawaran</label>
                  <input
                    type="text"
                    placeholder="Contoh: Diskon 50% Khusus Pendaftar Hari Ini!"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Deskripsi Penawaran</label>
                  <textarea
                    placeholder="Tulis keunggulan produk Anda..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Right Column: Code & Event Selection */}
              <div className="space-y-4">
                {/* Real Meta Ads Simulation: Paste Code Box */}
                <div className="space-y-1 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                    <Code className="w-4 h-4 text-indigo-600" />
                    TEMPEL KODE META PIXEL (HEADER SCRIPT)
                  </label>
                  <p className="text-[11px] text-gray-500 leading-normal pb-2">
                    Buka menu <Link href="/dashboard/pixels" target="_blank" className="text-indigo-600 underline font-semibold">Pixel Tracker</Link>, buat Pixel baru, klik <strong>"Copy Code"</strong>, lalu paste seluruh script-nya di bawah ini:
                  </p>
                  <textarea
                    placeholder="<!-- Meta Pixel Code -->&#10;<script>&#10;  ...&#10;  fbq('init', 'YOUR_PIXEL_ID');&#10;  ...&#10;</script>"
                    value={pixelCode}
                    onChange={(e) => setPixelCode(e.target.value)}
                    rows={6}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 font-mono bg-slate-900 text-slate-100"
                    required
                  />
                  {pixelCode && (
                    <div className="mt-1 text-xs font-bold flex items-center gap-1">
                      {extractPixelId(pixelCode) ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Pixel ID Terdeteksi: {extractPixelId(pixelCode)}
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          ⚠️ Kode tidak valid / Pixel ID tidak ditemukan.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Event Saat Tombol Diklik (CTA Event)</label>
                  <select
                    value={buttonEvent}
                    onChange={(e) => setButtonEvent(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {STANDARD_EVENTS.map(ev => (
                      <option key={ev.value} value={ev.value}>{ev.label}</option>
                    ))}
                  </select>
                </div>

                {buttonEvent === "custom" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Nama Event Kustom</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama event kustom (contoh: KlikWhatsApp)"
                      value={customEventName}
                      onChange={(e) => setCustomEventName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                )}

                {template === "ecommerce" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Harga Produk (Rp)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 299000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Teks Tombol Aksi (CTA)</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Pilih Gambar Produk/Latar</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                    {DEFAULT_IMAGES.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setImageUrl(img.url)}
                        className={`h-14 relative rounded-lg overflow-hidden border-2 transition-all ${
                          imageUrl === img.url ? "border-indigo-600 scale-95" : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Atau masukkan URL gambar kustom"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                {editingId ? "Simpan Perubahan" : "Terbitkan Landing Page"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Landing Pages List */}
      <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Daftar Landing Page Anda ({pages.length})
        </h2>

        {fetchingPages ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Globe className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Belum ada Landing Page kustom.</p>
            <p className="text-xs text-gray-400 mt-1">Buat landing page khusus untuk mensimulasikan Pixel tracker Anda secara manual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pages.map((page) => {
              const detectedPixelId = extractPixelId(page.pixelCode);
              return (
                <div key={page.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                      <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover" />
                    </div>
                    {/* Text Details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full capitalize">
                          {page.template === "ecommerce" ? "E-commerce" : page.template === "leadform" ? "Lead Form" : "Article"}
                        </span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          CTA Event: {page.buttonEvent}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1c2b33] text-sm line-clamp-1">{page.name}</h4>
                      <p className="text-gray-500 font-medium line-clamp-1">{page.headline}</p>
                      
                      <div className="pt-1.5 flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-500">
                          Installed Pixel ID: <strong className="text-indigo-600 font-mono">{detectedPixelId || "Tidak terdeteksi"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-xs font-bold text-gray-700">
                      {page.template === "ecommerce" && page.price ? `Rp ${parseInt(page.price).toLocaleString("id-ID")}` : "Free/Leads"}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(page)}
                        className="p-1.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit Page"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="p-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/landing/${page.id}`}
                        target="_blank"
                        className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Buka LP
                      </Link>
                      <Link
                        href={`/landing/${page.id}?setup_tool=true`}
                        target="_blank"
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        title="Buka Meta Event Setup Tool"
                      >
                        <MousePointerClick className="w-3.5 h-3.5" /> Setup Tool
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
