"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Truck, 
  Globe, 
  Activity, 
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code,
  HelpCircle,
  Plus,
  Trash2,
  MousePointerClick,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

interface TrackingRule {
  id: string;
  type: "button" | "url";
  buttonText?: string;
  eventName: string;
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
  buttonEvent: string;
  imageUrl: string;
  trackingRules?: TrackingRule[]; // Rules set by Event Setup Tool
}

interface EventLog {
  id: string;
  name: string;
  timestamp: string;
  status: "sending" | "success" | "error";
}

const EVENT_DISPLAY_NAMES: Record<string, string> = {
  Purchase: "Pembelian",
  Lead: "Pendaftaran (Lead)",
  AddToCart: "Tambahkan ke Keranjang Belanja",
  InitiateCheckout: "Memulai Checkout",
  Contact: "Hubungi Kami",
};

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

function LandingContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if Event Setup Tool is active
  const isSetupToolActive = searchParams.get("setup_tool") === "true";

  const [config, setConfig] = useState<LandingPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Event Setup Tool States
  const [trackingRules, setTrackingRules] = useState<TrackingRule[]>([]);
  const [isSelectingButton, setIsSelectingButton] = useState(false);
  const [selectedElementText, setSelectedElementText] = useState<string | null>(null);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [selectedEventToAssign, setSelectedEventToAssign] = useState("Purchase");

  // Form inputs for Lead Form template
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  // Load configuration from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const stored = localStorage.getItem("metalabs_landing_pages");
      if (stored) {
        try {
          const pages: LandingPageConfig[] = JSON.parse(stored);
          const found = pages.find(p => p.id === id);
          if (found) {
            setConfig(found);
            setTrackingRules(found.trackingRules || []);
          }
        } catch (e) {
          console.error("Failed to parse landing pages from localStorage", e);
        }
      }
      setLoading(false);
    }
  }, [id]);

  const pixelId = config ? extractPixelId(config.pixelCode) : null;
  const pageViewFired = useRef(false);

  // Status updater instead of appender
  const updateLog = (logId: string, eventName: string, status: "sending" | "success" | "error") => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => {
      const exists = prev.some(log => log.id === logId);
      if (exists) {
        return prev.map(log => log.id === logId ? { ...log, status } : log);
      } else {
        return [{ id: logId, name: eventName, timestamp: time, status }, ...prev];
      }
    });
  };

  // Fire PageView exactly once on load
  useEffect(() => {
    if (pixelId && !pageViewFired.current) {
      pageViewFired.current = true;
      const logId = "pageview-" + Date.now();
      updateLog(logId, "PageView", "sending");

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId,
          eventName: "PageView",
          url: window.location.href,
        })
      })
      .then(res => {
        updateLog(logId, "PageView", res.ok ? "success" : "error");
      })
      .catch(() => {
        updateLog(logId, "PageView", "error");
      });
    }
  }, [pixelId]);

  // Handle firing pixel events based on button clicks
  const triggerEventForButton = async (btnText: string) => {
    if (!pixelId) return;

    // Find if there is a tracking rule for this button text
    const matchedRule = trackingRules.find(
      r => r.type === "button" && r.buttonText?.toLowerCase() === btnText.toLowerCase()
    );

    let eventToFire = config?.buttonEvent || "Purchase";
    if (matchedRule) {
      eventToFire = matchedRule.eventName;
    }

    const logId = "click-" + Date.now() + Math.random().toString(36).substring(2, 5);
    updateLog(logId, eventToFire, "sending");
    setActionLoading(true);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId,
          eventName: eventToFire,
          url: window.location.href,
        })
      });

      if (res.ok) {
        updateLog(logId, eventToFire, "success");
        setActionSuccess(true);
      } else {
        updateLog(logId, eventToFire, "error");
      }
    } catch {
      updateLog(logId, eventToFire, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Event Setup Tool Save
  const saveTrackingRules = (updatedRules: TrackingRule[]) => {
    if (typeof window !== "undefined" && config) {
      const stored = localStorage.getItem("metalabs_landing_pages");
      if (stored) {
        try {
          const pages: LandingPageConfig[] = JSON.parse(stored);
          const updatedPages = pages.map(p => {
            if (p.id === config.id) {
              return { ...p, trackingRules: updatedRules };
            }
            return p;
          });
          localStorage.setItem("metalabs_landing_pages", JSON.stringify(updatedPages));
          setTrackingRules(updatedRules);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleFinishSetup = () => {
    // Redirect to normal view by removing query param
    router.push(`/landing/${id}`);
  };

  // Selection hover/click handlers
  const handlePageButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnText = e.currentTarget.innerText.trim();
    
    if (isSetupToolActive && isSelectingButton) {
      e.preventDefault();
      e.stopPropagation();
      setSelectedElementText(btnText);
      setSetupModalOpen(true);
      setIsSelectingButton(false);
      return;
    }

    // Normal click fires events
    triggerEventForButton(btnText);
  };

  const deleteRule = (ruleId: string) => {
    const filtered = trackingRules.filter(r => r.id !== ruleId);
    saveTrackingRules(filtered);
  };

  const confirmAddRule = () => {
    if (!selectedElementText) return;
    
    const newRule: TrackingRule = {
      id: Math.random().toString(36).substring(2, 9),
      type: "button",
      buttonText: selectedElementText,
      eventName: selectedEventToAssign
    };

    // Remove duplicates with same button text
    const filtered = trackingRules.filter(
      r => !(r.type === "button" && r.buttonText?.toLowerCase() === selectedElementText.toLowerCase())
    );

    const updated = [...filtered, newRule];
    saveTrackingRules(updated);
    
    setSetupModalOpen(false);
    setSelectedElementText(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md border border-gray-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Landing Page Tidak Ditemukan</h1>
          <p className="text-gray-600 text-sm mb-6">
            Halaman dengan ID ini belum dikonfigurasi atau tersimpan di browser Anda.
          </p>
          <Link 
            href="/dashboard/landing-pages" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative pb-20">
      {/* Warning banner if Pixel is not installed */}
      {!pixelId && (
        <div className="bg-red-50 border-b border-red-200 text-red-800 text-xs px-4 py-2.5 text-center font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Meta Pixel tidak terdeteksi! Pastikan Anda menempelkan Header Script (Meta Pixel Code) dengan benar di Editor Halaman.</span>
        </div>
      )}

      {/* 1. Header/Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-extrabold text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
            {config.title}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-500 hover:text-gray-900 cursor-pointer">Fitur</span>
            <span className="text-sm font-semibold text-gray-500 hover:text-gray-900 cursor-pointer">Kontak</span>
            {config.template === "ecommerce" && (
              <span className="relative p-1">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {actionSuccess && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">1</span>
                )}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Main Content Area berdasarkan Template */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {config.template === "ecommerce" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row shadow-sm">
            {/* Image Section */}
            <div className="md:w-1/2 bg-gray-50 p-6 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-md">
                <img src={config.imageUrl} alt={config.title} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Info Section */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">PROMO SPESIAL</span>
              <h1 className="text-3xl font-extrabold text-gray-950 mb-2 leading-tight">{config.headline}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold">(4.9/5 dari 143 ulasan)</span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-black text-gray-900">
                  Rp {parseInt(config.price || "0").toLocaleString("id-ID")}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  Rp {(parseInt(config.price || "0") * 2).toLocaleString("id-ID")}
                </span>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {config.description}
              </p>

              <div className="space-y-2 mb-6 border-t border-b py-4 border-gray-100">
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Garansi kepuasan pelanggan 100%</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-gray-700">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Gratis Ongkos Kirim seluruh Indonesia</span>
                </div>
              </div>

              {actionSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center shadow-sm">
                  <h3 className="font-bold text-base mb-1">🎉 Pembelian Selesai!</h3>
                  <p className="text-xs">Event berhasil ditembakkan ke Meta Pixel Anda.</p>
                </div>
              ) : (
                <button
                  onClick={handlePageButtonClick}
                  disabled={actionLoading || !pixelId}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 text-white ${
                    isSetupToolActive && isSelectingButton 
                      ? "bg-blue-600 ring-4 ring-blue-400 animate-pulse cursor-crosshair" 
                      : isSetupToolActive 
                        ? "bg-indigo-600 hover:bg-indigo-700 border-2 border-dashed border-yellow-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {actionLoading ? "Memproses..." : config.ctaText}
                </button>
              )}
            </div>
          </div>
        )}

        {config.template === "leadform" && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white text-center">
              <h1 className="text-2xl font-extrabold mb-2">{config.headline}</h1>
              <p className="text-indigo-100 text-sm">{config.description}</p>
            </div>
            
            <div className="p-8">
              {actionSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-lg">🎉 Pendaftaran Berhasil!</h3>
                  <p className="text-sm">Terima kasih telah mendaftar. Data Anda telah kami simpan.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); triggerEventForButton(config.ctaText); }} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap Anda"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      disabled={isSetupToolActive}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Alamat Email</label>
                    <input
                      type="email"
                      placeholder="contoh@email.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                      disabled={isSetupToolActive}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading || !pixelId}
                    onClick={isSetupToolActive ? (e) => { e.preventDefault(); handlePageButtonClick(e as any); } : undefined}
                    className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-6 ${
                      isSetupToolActive && isSelectingButton 
                        ? "bg-blue-600 ring-4 ring-blue-400 animate-pulse cursor-crosshair" 
                        : isSetupToolActive 
                          ? "bg-indigo-600 border-2 border-dashed border-yellow-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {config.ctaText}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {config.template === "simple" && (
          <div className="max-w-3xl mx-auto text-center space-y-6 py-12">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-indigo-100 shadow-md">
              <img src={config.imageUrl} alt={config.title} className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              {config.headline}
            </h1>
            
            <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
              {config.description}
            </p>

            <div className="pt-4">
              {actionSuccess ? (
                <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl">
                  <p className="text-xs font-bold">Terhubung! Membuka WhatsApp...</p>
                </div>
              ) : (
                <button
                  onClick={handlePageButtonClick}
                  disabled={actionLoading || !pixelId}
                  className={`font-bold px-8 py-3.5 rounded-full transition-all shadow-md active:scale-95 text-white text-sm uppercase tracking-wider ${
                    isSetupToolActive && isSelectingButton 
                      ? "bg-blue-600 ring-4 ring-blue-400 animate-pulse cursor-crosshair" 
                      : isSetupToolActive 
                        ? "bg-emerald-600 border-2 border-dashed border-yellow-400"
                        : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {actionLoading ? "Menghubungkan..." : config.ctaText}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. Pixel Simulator Helper Widget (Fixed at bottom right) */}
      {!isSetupToolActive && (
        <div className="fixed bottom-4 right-4 z-50 w-72 bg-slate-900 text-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 text-xs">
          <div className="bg-slate-800 px-3 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-1.5 font-bold">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Pixel Helper Widget</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold ${
              pixelId ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            }`}>
              {pixelId ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="p-3 space-y-2">
            {pixelId ? (
              <div>
                <span className="text-slate-400">Target Pixel ID:</span>
                <code className="block mt-0.5 bg-slate-950 px-2 py-1 rounded font-mono text-[10px] break-all select-all text-indigo-300">
                  {pixelId}
                </code>
              </div>
            ) : (
              <div className="text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Menunggu script penjelajah...</span>
              </div>
            )}

            {pixelId && (
              <div className="border-t border-slate-800 pt-2 space-y-1.5">
                <span className="text-slate-400 font-semibold block">Simulasikan Event Kustom:</span>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={async () => {
                      const logId = "widget-addtocart-" + Date.now();
                      updateLog(logId, "AddToCart", "sending");
                      const res = await fetch("/api/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pixelId, eventName: "AddToCart", url: window.location.href }),
                      });
                      updateLog(logId, "AddToCart", res.ok ? "success" : "error");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded p-1 text-[10px] text-center font-bold transition-colors"
                  >
                    + AddToCart
                  </button>
                  <button
                    onClick={async () => {
                      const logId = "widget-checkout-" + Date.now();
                      updateLog(logId, "InitiateCheckout", "sending");
                      const res = await fetch("/api/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pixelId, eventName: "InitiateCheckout", url: window.location.href }),
                      });
                      updateLog(logId, "InitiateCheckout", res.ok ? "success" : "error");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white rounded p-1 text-[10px] text-center font-bold transition-colors"
                  >
                    + Checkout
                  </button>
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Kustom... (lalu Enter)"
                    className="bg-slate-950 text-white rounded px-1.5 py-1 text-[10px] flex-1 focus:outline-none border border-slate-700 font-mono"
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        const inputEl = e.currentTarget;
                        const customName = inputEl.value.trim();
                        if (!customName) return;
                        inputEl.value = "";
                        const logId = "widget-custom-" + Date.now() + Math.random().toString(36).substring(2, 5);
                        updateLog(logId, customName, "sending");
                        const res = await fetch("/api/track", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ pixelId, eventName: customName, url: window.location.href }),
                        });
                        updateLog(logId, customName, res.ok ? "success" : "error");
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="border-t border-slate-800 pt-2">
              <span className="text-slate-400 font-semibold block mb-1">Event Logs:</span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto font-mono text-[10px]">
                {!pixelId ? (
                  <span className="text-red-400 italic block py-1">Tempel skrip Pixel agar dapat melacak event.</span>
                ) : logs.length === 0 ? (
                  <span className="text-slate-500 italic block py-1">Menunggu event pertama...</span>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-950/60 p-1.5 rounded">
                      <span className="text-indigo-400 font-bold">{log.name}</span>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>{log.timestamp}</span>
                        {log.status === "sending" && (
                          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                        )}
                        {log.status === "success" && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                        )}
                        {log.status === "error" && (
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. META EVENT SETUP TOOL SIMULATOR OVERLAY */}
      {isSetupToolActive && (
        <div className="fixed top-20 left-4 z-50 w-80 bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans text-sm text-gray-800 select-none">
          {/* Header */}
          <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="font-bold text-gray-900 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded">::</span>
              <span>Meta Event Setup Tool</span>
            </div>
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 text-xs font-semibold">
            <div className="flex-1 py-2 text-center border-b-2 border-blue-600 text-blue-600 cursor-pointer">
              Peristiwa di Halaman Ini
            </div>
            <div className="flex-1 py-2 text-center text-gray-500 hover:text-gray-700 cursor-pointer">
              Semua Peristiwa
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 overflow-y-auto max-h-64 space-y-3">
            {trackingRules.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-500">
                Belum ada peristiwa yang dikonfigurasi pada halaman ini.
              </div>
            ) : (
              <div className="space-y-2">
                {trackingRules.map((rule) => (
                  <div key={rule.id} className="flex items-start justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-gray-900 block flex items-center gap-1.5">
                        <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
                        {EVENT_DISPLAY_NAMES[rule.eventName] || rule.eventName}
                      </span>
                      <span className="text-[10px] text-gray-500 block font-mono">
                        Button text is: "{rule.buttonText}"
                      </span>
                    </div>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selection State Helper */}
          {isSelectingButton && (
            <div className="bg-blue-50 border-t border-b border-blue-150 p-3 text-xs text-blue-800 text-center animate-pulse font-semibold">
              Silakan klik tombol pada halaman untuk merekam peristiwa baru...
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 bg-slate-50 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setIsSelectingButton(true)}
                className={`flex-1 border border-gray-300 bg-white font-bold py-2 rounded-lg text-xs transition-all hover:bg-gray-50 flex items-center justify-center gap-1 ${
                  isSelectingButton ? "ring-2 ring-blue-500 border-blue-500" : ""
                }`}
              >
                Track a new button
              </button>
              <button
                onClick={() => alert("Simulasi Lacak URL telah dikonfigurasi")}
                className="flex-1 border border-gray-300 bg-white font-bold py-2 rounded-lg text-xs transition-all hover:bg-gray-50 flex items-center justify-center gap-1"
              >
                Lacak URL
              </button>
            </div>
            
            <button
              onClick={handleFinishSetup}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Selesaikan Penyiapan
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL FOR CONFIGURING NEW EVENT AFTER BUTTON CLICKED */}
      {setupModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-gray-900 border-b pb-2 text-sm flex items-center gap-1.5">
              <MousePointerClick className="w-4 h-4 text-blue-600" />
              Siapkan Peristiwa untuk Tombol
            </h3>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500 font-bold block uppercase tracking-wider">Teks Tombol Terpilih:</span>
                <span className="bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 block mt-1 font-mono font-bold text-slate-800">
                  "{selectedElementText}"
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500 font-bold uppercase tracking-wider">Pilih Peristiwa (Event):</label>
                <select
                  value={selectedEventToAssign}
                  onChange={(e) => setSelectedEventToAssign(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="InitiateCheckout">Memulai Checkout (InitiateCheckout)</option>
                  <option value="AddToCart">Tambahkan ke Keranjang Belanja (AddToCart)</option>
                  <option value="Purchase">Pembelian (Purchase)</option>
                  <option value="Lead">Pendaftaran (Lead)</option>
                  <option value="Contact">Hubungi Kami (Contact)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => { setSetupModalOpen(false); setSelectedElementText(null); }}
                className="px-3.5 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={confirmAddRule}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomLandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingContent />
    </Suspense>
  );
}
