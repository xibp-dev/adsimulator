"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, 
  Globe, 
  HelpCircle,
  Plus,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Code,
  Copy,
  Check,
  Activity,
  ExternalLink,
  MousePointerClick,
  Lock
} from "lucide-react";
import Link from "next/link";

interface Pixel {
  id: string;
  name: string;
  websiteUrl: string;
  createdAt: string;
  eventsCount?: number;
}

export default function PixelPage() {
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);

  // Live Test Events Console States
  const [activeTab, setActiveTab] = useState<"setup" | "test">("setup");
  const [selectedPixelId, setSelectedPixelId] = useState("");
  const [testEvents, setTestEvents] = useState<any[]>([]);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [selectedLPId, setSelectedLPId] = useState("");

  const fetchPixels = async () => {
    try {
      const res = await fetch("/api/pixels");
      if (res.ok) {
        const data = await res.json();
        setPixels(data);
        if (data.length > 0 && !selectedPixelId) {
          setSelectedPixelId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  // Fetch Landing Pages from localStorage
  const loadLandingPages = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("metalabs_landing_pages");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLandingPages(parsed);
          if (parsed.length > 0) {
            setSelectedLPId(parsed[0].id);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    const checkPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setHasPortfolio(data.length > 0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkPortfolio();
    fetchPixels();
    loadLandingPages();
  }, []);

  // Poll for received events when testing
  useEffect(() => {
    if (activeTab !== "test" || !selectedPixelId) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/pixels/events?pixelId=${selectedPixelId}`);
        if (res.ok) {
          const data = await res.json();
          setTestEvents(data);
        }
      } catch (e) {
        console.error("Failed to fetch events for testing", e);
      }
    };

    // Initial fetch
    fetchEvents();

    // Poll every 2 seconds
    const interval = setInterval(fetchEvents, 2000);
    return () => clearInterval(interval);
  }, [activeTab, selectedPixelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, websiteUrl: url }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          const errors = Object.values(data.error).flat().join(", ");
          setErrorMsg(errors);
        } else {
          setErrorMsg(data.error || "Gagal membuat Pixel");
        }
      } else {
        setSuccessMsg(`Meta Pixel "${data.name}" berhasil dibuat!`);
        setName("");
        setUrl("");
        fetchPixels();
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const getPixelCode = (id: string, name: string) => {
    return `<!-- Meta Pixel Code for ${name} -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${id}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (hasPortfolio === null) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (hasPortfolio === false) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-[#dddfe2] rounded-xl shadow-sm max-w-2xl w-full p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1c2b33]">Meta Pixel Terkunci</h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Anda wajib membuat <strong className="font-bold text-gray-800">Portofolio Bisnis</strong> terlebih dahulu sebelum diizinkan mengonfigurasi Meta Pixel.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Kembali ke Beranda
            </Link>
            <Link href="/dashboard/business-settings" className="bg-[#0866FF] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow">
              Buat Portofolio Bisnis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#dddfe2]">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Langkah 3 dari 4</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-600" />
              Simulasi Pembuatan & Setup Meta Pixel
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Educational Guide */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1c2b33] flex items-center gap-2 text-sm border-b border-gray-100 pb-2">
              <HelpCircle className="w-4 h-4 text-purple-500" />
              Apa itu Meta Pixel?
            </h3>
            
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p>
                <strong className="font-bold text-gray-800">Meta Pixel (sekarang Dataset)</strong> adalah baris kode JavaScript pendek yang dipasang di website bisnis Anda.
              </p>
              <p>
                Fungsi Utama Pixel:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li><strong className="font-bold text-gray-800">Melacak Konversi:</strong> Mengetahui audiens yang membeli produk atau mengisi form pendaftaran setelah mengeklik iklan.</li>
                <li><strong className="font-bold text-gray-800">Retargeting (Remarketing):</strong> Menampilkan iklan khusus kepada pengunjung yang sudah pernah membuka website Anda.</li>
                <li><strong className="font-bold text-gray-800">Optimasi Algoritma:</strong> Membantuan sistem Meta mencarikan tipe audiens yang paling berkemungkinan melakukan tindakan konversi.</li>
              </ul>
              <p className="bg-purple-50 text-purple-700 p-2.5 rounded-lg border border-purple-100 font-medium">
                💡 <strong className="font-bold text-purple-900">Tips:</strong> Pasang Pixel di tag `&lt;head&gt;` header global website Anda agar dapat melacak semua kunjungan halaman secara akurat.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form, List, and Test Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("setup")}
              className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === "setup"
                  ? "border-[#0866FF] text-[#0866FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Pengaturan & Kode Pixel
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`py-2.5 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "test"
                  ? "border-[#0866FF] text-[#0866FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Activity className="w-4 h-4" />
              Uji Peristiwa (Test Events)
            </button>
          </div>

          {activeTab === "setup" ? (
            <>
              {/* Creation Form */}
              <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#1c2b33] flex items-center gap-2">
                  <Code className="w-5 h-5 text-gray-700" />
                  Buat Pixel Tracker Baru (Simulator)
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">Nama Pixel</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pixel Toko Hijab Cantik / Pixel Utama Website"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase">URL Website Bisnis Anda</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        placeholder="Contoh: https://www.hijabcantik.co.id"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                        required
                      />
                    </div>
                  </div>

                  {errorMsg && <p className="text-red-500 text-xs font-medium">{errorMsg}</p>}
                  {successMsg && <p className="text-emerald-600 text-xs font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {successMsg}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0866FF] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Buat Meta Pixel
                  </button>
                </form>
              </div>

              {/* List of Pixels & Tracking Snippet Code */}
              <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#1c2b33]">
                  Pixel Tracker Anda ({pixels.length})
                </h2>

                <div className="bg-indigo-50 border border-indigo-150 rounded-lg p-3 text-xs text-indigo-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <strong>💡 Kustomisasi Landing Page:</strong> Anda kini bisa memisahkan dan mendesain Landing Page kustom khusus untuk dihubungkan dengan Pixel tracker ini.
                  </div>
                  <Link
                    href="/dashboard/landing-pages"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded transition-all text-[11px] whitespace-nowrap self-stretch sm:self-auto text-center"
                  >
                    Ke Builder Halaman →
                  </Link>
                </div>

                {fetching ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : pixels.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <Cpu className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada Pixel tracker yang dibuat.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pixels.map((pixel) => {
                      const codeString = getPixelCode(pixel.id, pixel.name);
                      return (
                        <div key={pixel.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 relative overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-[#1c2b33]">{pixel.name}</h4>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-gray-400" /> ID: {pixel.id} | {pixel.websiteUrl}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs font-semibold">
                                  <Activity className="w-3 h-3" /> {pixel.eventsCount || 0} Event Terekam
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPixelId(pixel.id);
                                  setActiveTab("test");
                                }}
                                className="flex items-center gap-1 bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded px-2.5 py-1 text-xs font-semibold text-orange-800 transition-colors"
                              >
                                <Activity className="w-3.5 h-3.5" /> Uji Event
                              </button>
                              <button
                                onClick={() => copyToClipboard(codeString, pixel.id)}
                                className="flex items-center justify-center gap-1 bg-white hover:bg-gray-100 border border-gray-300 rounded px-2.5 py-1 text-xs font-semibold text-gray-700 transition-colors"
                              >
                                {copiedId === pixel.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" /> Copy Code
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Integrasi Kode Header (Simulasi)</label>
                            <pre className="bg-slate-950 text-slate-200 text-[10px] p-3 rounded-lg overflow-x-auto font-mono max-h-40">
                              {codeString}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Test Events Panel */
            <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1c2b33] flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Uji Peristiwa Secara Real-Time
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Simulasikan interaksi pengunjung dan pantau pengiriman event Pixel Anda secara instan.
                  </p>
                </div>
                
                {pixels.length > 0 && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-600">Pixel:</label>
                    <select
                      value={selectedPixelId}
                      onChange={(e) => setSelectedPixelId(e.target.value)}
                      className="border border-gray-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-[#0866FF] font-bold"
                    >
                      {pixels.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {pixels.length === 0 ? (
                <div className="text-center py-12">
                  <Cpu className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Anda belum membuat Pixel apa pun. Silakan buat Pixel di tab Pengaturan terlebih dahulu.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Step 1: Open Target Web */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Langkah 1: Buka Landing Page yang Terpasang Pixel
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
                      {landingPages.length === 0 ? (
                        <div className="text-xs text-gray-500 flex-1">
                          Belum ada Landing Page kustom. Gunakan tombol di bawah ini untuk membuka halaman dummy standar.
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Pilih Landing Page Anda:</label>
                          <select
                            value={selectedLPId}
                            onChange={(e) => setSelectedLPId(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#0866FF]"
                          >
                            {landingPages.map(lp => (
                              <option key={lp.id} value={lp.id}>{lp.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link
                          href={selectedLPId ? `/landing/${selectedLPId}` : `/preview-web?pixelId=${selectedPixelId}`}
                          target="_blank"
                          className="bg-[#0866FF] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap justify-center"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Buka Halaman Uji
                        </Link>
                        {selectedLPId && (
                          <Link
                            href={`/landing/${selectedLPId}?setup_tool=true`}
                            target="_blank"
                            className="bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap justify-center"
                          >
                            <MousePointerClick className="w-4 h-4" />
                            Buka Event Setup Tool
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Live Monitor */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        Aktivitas Event Live yang Diterima
                      </h3>
                      <span className="text-[10px] text-gray-400 italic">Diperbarui otomatis tiap 2 detik</span>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-slate-950 font-mono text-xs text-slate-200">
                      {testEvents.length === 0 ? (
                        <div className="text-center py-16 px-4 text-slate-500 italic">
                          <Activity className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-pulse" />
                          <p>Menunggu Aktivitas Event...</p>
                          <p className="text-[10px] mt-1 text-slate-600">Buka Halaman Uji, klik tombol pembelian atau daftar, lalu event akan muncul di sini secara instan.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto">
                          {testEvents.map((event) => (
                            <div key={event.id} className="p-3 hover:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                <span className="text-emerald-400 font-bold text-sm">{event.eventName}</span>
                                <span className="text-slate-600">|</span>
                                <span className="text-slate-400 truncate max-w-xs sm:max-w-md text-[11px]" title={event.url}>
                                  {event.url}
                                </span>
                              </div>
                              <span className="text-slate-500 text-[10px] whitespace-nowrap">
                                {new Date(event.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions to next step */}
          {pixels.length > 0 && (
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard/pages"
                className="text-gray-600 hover:text-gray-800 text-sm font-semibold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Link>
              <Link
                href="/dashboard/billing"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Lanjut ke Langkah 4: Setup Pembayaran & Top Up
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
