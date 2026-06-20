"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Wallet, 
  Receipt, 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  Info,
  DollarSign,
  Lock
} from "lucide-react";
import Link from "next/link";

interface AdAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface Campaign {
  id: string;
}

export default function BillingPage() {
  const [adAccount, setAdAccount] = useState<AdAccount | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [statements, setStatements] = useState<[string, number][]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(500000);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activePaymentType, setActivePaymentType] = useState<"prepaid" | "postpaid">("prepaid");
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);
  
  // Mock postpaid card info
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardSaved, setCardSaved] = useState(false);

  const fetchBillingData = async () => {
    try {
      // We can fetch data from existing API routes or perform lightweight inline fetches
      const resAccount = await fetch("/api/campaigns"); // To check session and indirectly get account info if we want, or we can make a custom endpoint
      // Let's create a quick API fetch for billing information
      const resBilling = await fetch("/api/billing/data");
      if (resBilling.ok) {
        const data = await resBilling.json();
        setAdAccount(data.adAccount);
        setCampaigns(data.campaigns);
        setTotalSpent(data.totalSpent);
        setStatements(data.statements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
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
    fetchBillingData();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Gagal melakukan top up");
      } else {
        setSuccessMsg(`Berhasil melakukan top up sebesar Rp ${Number(amount).toLocaleString("id-ID")}!`);
        fetchBillingData();
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName) {
      setErrorMsg("Harap isi detail kartu dengan lengkap");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCardSaved(true);
      setSuccessMsg("Kartu Kredit/Debit berhasil dihubungkan untuk pembayaran pascabayar!");
      setLoading(false);
      setErrorMsg("");
    }, 1000);
  };

  const formatCurrency = (val: number) => {
    return `Rp ${val.toLocaleString("id-ID")}`;
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
            <h1 className="text-2xl font-bold text-[#1c2b33]">Tagihan & Pembayaran Terkunci</h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">
              Anda wajib membuat <strong className="font-bold text-gray-800">Portofolio Bisnis</strong> terlebih dahulu sebelum diizinkan mengatur Tagihan & Pembayaran.
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
          <Link href="/dashboard/hub" className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Langkah 4 dari 4</span>
            <h1 className="text-xl font-bold text-[#1c2b33] flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-amber-600" />
              Simulasi Setup Pembayaran & Top Up
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Education on Payments */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-[#1c2b33] flex items-center gap-2 text-sm border-b border-gray-100 pb-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Metode Pembayaran Meta Ads
            </h3>
            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
              <p>
                Meta Ads menawarkan 2 jenis metode pembayaran utama untuk beriklan di Indonesia:
              </p>
              <div>
                <p className="font-semibold text-gray-700">1. Prabayar (Prepaid / Saldo Manual)</p>
                <p className="text-gray-500">Anda melakukan transfer dana terlebih dahulu ke akun iklan (via Virtual Account Mandiri, BNI, Danamon, OVO, DOKU, atau Gopay). Iklan akan berhenti otomatis jika saldo habis.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">2. Pascabayar (Postpaid / Auto Debit)</p>
                <p className="text-gray-500">Anda mendaftarkan Kartu Kredit atau Kartu Debit (Jenius, Jago, dll.) yang mendukung transaksi online. Meta akan mendebit saldo kartu Anda setelah tagihan mencapai batas ambang tertentu (Billing Threshold).</p>
              </div>
              <p className="bg-amber-50 text-amber-700 p-2.5 rounded-lg border border-amber-100 font-medium">
                ⚠️ <strong className="font-bold text-amber-900">Penting:</strong> Sekali akun iklan dibuat dengan tipe Prabayar (Transfer Manual), akun tersebut <strong className="font-bold text-amber-900">tidak bisa</strong> diubah menjadi Pascabayar (Kartu Kredit), dan sebaliknya.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Billing Dashboard & Forms */}
        <div className="lg:col-span-2 space-y-6">
          {fetching ? (
            <div className="bg-white border border-[#dddfe2] rounded-xl p-8 text-center flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#dddfe2] p-4 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-2 rounded-lg mb-2 text-[#0866FF] bg-[#e7f0ff]">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Saldo Tersedia (Simulasi)</p>
                  </div>
                  <p className="text-lg font-bold text-[#1c2b33] mt-2">
                    {adAccount ? formatCurrency(adAccount.balance) : "Rp 0"}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#dddfe2] p-4 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-2 rounded-lg mb-2 text-red-500 bg-red-50">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Total Dibelanjakan</p>
                  </div>
                  <p className="text-lg font-bold text-[#1c2b33] mt-2">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#dddfe2] p-4 flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-2 rounded-lg mb-2 text-emerald-600 bg-emerald-50">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Jenis Akun Iklan</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-700 mt-2 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 self-start">
                    {cardSaved ? "Pascabayar (Kartu)" : "Prabayar (Manual)"}
                  </p>
                </div>
              </div>

              {/* Interaction Panel */}
              <div className="bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
                <div className="border-b border-[#dddfe2] bg-gray-50 flex">
                  <button
                    onClick={() => { setActivePaymentType("prepaid"); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
                      activePaymentType === "prepaid" 
                        ? "border-[#0866FF] text-[#0866FF] bg-white" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    1. Prabayar: Isi Saldo Instan (Top Up)
                  </button>
                  <button
                    onClick={() => { setActivePaymentType("postpaid"); setErrorMsg(""); setSuccessMsg(""); }}
                    className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-colors ${
                      activePaymentType === "postpaid" 
                        ? "border-[#0866FF] text-[#0866FF] bg-white" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    2. Pascabayar: Setup Kartu Debit/Kredit
                  </button>
                </div>

                <div className="p-6">
                  {activePaymentType === "prepaid" ? (
                    <form onSubmit={handleTopUp} className="space-y-4">
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2.5 text-xs text-blue-700 leading-relaxed">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Simulasi Top Up Saldo:</strong> Pilih nominal di bawah untuk langsung menambahkan saldo simulasi akun iklan Anda. Ini berguna untuk melatih budget harian tanpa batasan saldo.
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase">Pilih / Input Nominal Top Up</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[100000, 250000, 500000, 1000000].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setAmount(val)}
                              className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all ${
                                amount === val 
                                  ? "border-[#0866FF] bg-blue-50 text-[#0866FF]" 
                                  : "border-gray-300 hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              Rp {val.toLocaleString("id-ID")}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 relative">
                          <span className="absolute left-3 top-2 text-sm font-semibold text-gray-500">Rp</span>
                          <input
                            type="number"
                            min="10000"
                            placeholder="Nominal custom lainnya"
                            value={amount || ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
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
                        className="w-full bg-[#0866FF] hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Simulasikan Pembayaran & Tambah Saldo
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleAddCard} className="space-y-4">
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-2.5 text-xs text-amber-700 leading-relaxed">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Simulasi Postpaid:</strong> Hubungkan kartu kredit/debit virtual untuk simulasi pembayaran otomatis. Saldo tetap disimulasikan dari sistem tetapi metode pembayaran akan berstatus "Kartu Terhubung".
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase">Nama di Kartu</label>
                          <input
                            type="text"
                            placeholder="Contoh: John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase">Nomor Kartu (16 Digit)</label>
                          <input
                            type="text"
                            maxLength={16}
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">Masa Berlaku (MM/YY)</label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="12/30"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0866FF]"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {errorMsg && <p className="text-red-500 text-xs font-medium">{errorMsg}</p>}
                      {successMsg && <p className="text-emerald-600 text-xs font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> {successMsg}</p>}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0866FF] hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Hubungkan Kartu (Pascabayar)
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-xl border border-[#dddfe2] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#dddfe2]">
                  <h2 className="font-semibold text-sm text-[#1c2b33]">Riwayat transaksi (simulasi)</h2>
                </div>
                {statements.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 text-sm">Belum ada transaksi.</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#f0f2f5] bg-gray-50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Periode</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Keterangan</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statements.map(([month, amountSpent]) => (
                        <tr key={month} className="border-b border-[#f0f2f5]">
                          <td className="px-5 py-3 text-[#1c2b33]">{month}</td>
                          <td className="px-5 py-3 text-gray-500">Belanja iklan kampanye</td>
                          <td className="px-5 py-3 text-right font-medium text-[#1c2b33]">{formatCurrency(amountSpent)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Actions to next step */}
          <div className="flex justify-between items-center">
            <Link
              href="/dashboard/pixels"
              className="text-gray-600 hover:text-gray-800 text-sm font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <Link
              href="/dashboard/ads-manager"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              Lanjut ke Ads Manager
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
