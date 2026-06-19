"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Star, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function PreviewWebPage() {
  const searchParams = useSearchParams();
  const pixelId = searchParams.get("pixelId");
  
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Simulasi Meta Pixel Base Code (Fires PageView on Load)
  useEffect(() => {
    if (pixelId) {
      // Meniru tembakan fbq('track', 'PageView')
      console.log(`[Pixel Tracker] Firing PageView for Pixel ID: ${pixelId}`);
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId,
          eventName: "PageView",
          url: window.location.href,
        })
      }).catch(err => console.error("Pixel tracking error:", err));
    }
  }, [pixelId]);

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    
    // Jeda simulasi proses pembayaran
    await new Promise(resolve => setTimeout(resolve, 800));

    if (pixelId) {
      // Meniru tembakan fbq('track', 'Purchase', { value: 299000, currency: 'IDR' })
      console.log(`[Pixel Tracker] Firing Purchase for Pixel ID: ${pixelId}`);
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId,
          eventName: "Purchase",
          url: window.location.href,
        })
      }).catch(err => console.error("Pixel tracking error:", err));
    }

    setPurchaseLoading(false);
    setPurchaseSuccess(true);
  };

  if (!pixelId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error: Pixel ID Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Anda harus menyertakan ?pixelId=xxx di URL untuk menguji tracker.</p>
          <Link href="/dashboard/pixels" className="text-blue-600 underline">Kembali ke Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Fake Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-gray-800">TokoDumy.</div>
          <div className="flex gap-4">
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">Home</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer">Katalog</span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer relative">
              <ShoppingCart className="w-5 h-5" />
              {purchaseSuccess && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">1</span>
              )}
            </span>
          </div>
        </div>
      </nav>

      {/* Product Section */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Pixel Status Indicator */}
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-4 py-3 rounded-lg flex items-center justify-between">
          <div>
            <strong>Peringatan Simulator:</strong> Ini adalah website dummy. <br/>
            Skrip Pixel Tracker telah aktif untuk ID: <code className="font-mono bg-white px-1 py-0.5 rounded ml-1">{pixelId}</code>
          </div>
          <Link href="/dashboard/pixels" className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-semibold shadow-sm transition-colors">
            Cek Dashboard Pixel
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
            <div className="w-64 h-64 bg-gray-300 rounded-2xl shadow-inner flex items-center justify-center text-gray-400">
              [Gambar Produk]
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            <div className="text-sm text-blue-600 font-bold mb-2">PROMO TERBATAS</div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Smartwatch Pro Max X</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current text-yellow-200" />
              </div>
              <span className="text-sm text-gray-500">(128 Ulasan)</span>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-2">Rp 299.000</div>
            <div className="text-sm text-gray-500 line-through mb-6">Rp 799.000</div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Smartwatch revolusioner dengan fitur pelacak kesehatan akurat, baterai tahan 14 hari, dan desain elegan yang cocok untuk segala aktivitas Anda.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Garansi Resmi 1 Tahun
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="w-5 h-5 text-blue-500" /> Gratis Ongkir ke Seluruh Indonesia
              </li>
            </ul>

            {purchaseSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-center">
                <h3 className="font-bold text-lg mb-1">🎉 Pembayaran Berhasil!</h3>
                <p className="text-sm">Event "Purchase" telah ditembakkan ke Meta Pixel Anda.</p>
              </div>
            ) : (
              <button 
                onClick={handlePurchase}
                disabled={purchaseLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {purchaseLoading ? "Memproses..." : "Beli Sekarang (Simulasi Purchase)"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
