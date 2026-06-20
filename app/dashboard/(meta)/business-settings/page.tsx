"use client";

import { useState, useEffect } from "react";
import { 
  Building, 
  Users, 
  Flag, 
  Cpu, 
  CreditCard, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Lock, 
  Check, 
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  FileText,
  AlertCircle,
  MoreVertical,
  Upload,
  Loader2
} from "lucide-react";
import Link from "next/link";

// Local SVG component for Instagram logo to bypass older package exports
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface Portfolio {
  id: string;
  name: string;
  businessEmail: string;
  createdAt: string;
}

interface Fanspage {
  id: string;
  name: string;
  category: string;
}

interface Pixel {
  id: string;
  name: string;
  websiteUrl: string;
}

interface AdAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

interface SocialAsset {
  id: string;
  type: "instagram" | "whatsapp";
  name: string; // @username or phone number
  status: string;
}

export default function BusinessSettingsPage() {
  const [activeMenu, setActiveMenu] = useState<string>("info-bisnis");
  const [menuExpanded, setMenuExpanded] = useState<Record<string, boolean>>({
    pengguna: true,
    akun: true,
    sumber_data: true,
  });

  // DB Data States
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
  const [fanspages, setFanspages] = useState<Fanspage[]>([]);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [adAccount, setAdAccount] = useState<AdAccount | null>(null);

  // Simulated Asset States (stored in localStorage)
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [socialAssets, setSocialAssets] = useState<SocialAsset[]>([]);
  const [businessVerified, setBusinessVerified] = useState(false);

  // Form states
  const [loading, setLoading] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newPortfolioEmail, setNewPortfolioEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"ADMIN" | "EMPLOYEE">("EMPLOYEE");
  const [newSocialName, setNewSocialName] = useState("");
  const [socialType, setSocialType] = useState<"instagram" | "whatsapp">("instagram");

  // Load Data
  const loadData = async () => {
    try {
      // Semua fetch dijalankan PARALEL lewat API server ber-auth & difilter userId
      const [resPortfolio, resPages, resPixels, resAccount] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/pages"),
        fetch("/api/pixels"),
        fetch("/api/account"),
      ]);

      if (resPortfolio.ok) {
        const data = await resPortfolio.json();
        setPortfolios(data);
        if (data.length > 0 && !activePortfolio) {
          setActivePortfolio(data[0]);
        }
      }
      if (resPages.ok) {
        const data = await resPages.json();
        if (Array.isArray(data)) setFanspages(data);
      }
      if (resPixels.ok) {
        const data = await resPixels.json();
        if (Array.isArray(data)) setPixels(data);
      }
      if (resAccount.ok) {
        const data = await resAccount.json();
        setAdAccount(data ?? null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();

    // Fetch logged in user session to set default user name & email
    const initUsers = async () => {
      let currentUser = { name: "Pengguna Simulator", email: "user@simulator.com" };
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            currentUser = {
              name: session.user.name || "Pengguna Simulator",
              email: session.user.email || "user@simulator.com"
            };
          }
        }
      } catch (e) {
        console.error("Failed to fetch session", e);
      }

      if (typeof window !== "undefined") {
        const users = localStorage.getItem("AdSimulator_sim_users");
        if (users) {
          // Update Budiman dummy if still present in storage
          const parsedUsers = JSON.parse(users) as SystemUser[];
          const updatedUsers = parsedUsers.map(u => {
            if (u.id === "1" && (u.name === "Budiman Hendry" || u.email === "budiman@idnetworkers.com")) {
              return { ...u, name: currentUser.name, email: currentUser.email };
            }
            return u;
          });
          localStorage.setItem("AdSimulator_sim_users", JSON.stringify(updatedUsers));
          setSystemUsers(updatedUsers);
        } else {
          const defaultUsers: SystemUser[] = [
            { id: "1", name: currentUser.name, email: currentUser.email, role: "ADMIN" }
          ];
          localStorage.setItem("AdSimulator_sim_users", JSON.stringify(defaultUsers));
          setSystemUsers(defaultUsers);
        }
      }
    };

    initUsers();

    // Muat akun sosial dari DB (bukan localStorage)
    const loadSocials = async () => {
      try {
        const res = await fetch("/api/social-accounts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setSocialAssets(data);
        }
      } catch (e) {
        console.error("Failed to load social accounts", e);
      }
    };

    loadSocials();

    if (typeof window !== "undefined") {
      const verified = localStorage.getItem("AdSimulator_sim_verified");
      if (verified) setBusinessVerified(JSON.parse(verified));
    }
  }, []);

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioName || !newPortfolioEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPortfolioName, businessEmail: newPortfolioEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolios([data, ...portfolios]);
        setActivePortfolio(data);
        setNewPortfolioName("");
        setNewPortfolioEmail("");
        alert("Portofolio Bisnis berhasil dibuat!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: SystemUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole
    };

    const updated = [...systemUsers, newUser];
    localStorage.setItem("AdSimulator_sim_users", JSON.stringify(updated));
    setSystemUsers(updated);
    setNewUserName("");
    setNewUserEmail("");
  };

  const handleDeleteUser = (userId: string) => {
    const updated = systemUsers.filter(u => u.id !== userId);
    localStorage.setItem("AdSimulator_sim_users", JSON.stringify(updated));
    setSystemUsers(updated);
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialName) return;

    try {
      // Normalisasi "@" dilakukan di server, jadi kirim name apa adanya
      const res = await fetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: socialType, name: newSocialName }),
      });
      if (res.ok) {
        const created = await res.json();
        setSocialAssets([...socialAssets, created]);
        setNewSocialName("");
      }
    } catch (err) {
      console.error("Failed to add social account", err);
    }
  };

  const handleDeleteSocial = async (assetId: string) => {
    try {
      const res = await fetch(`/api/social-accounts/${assetId}`, { method: "DELETE" });
      if (res.ok) {
        setSocialAssets(socialAssets.filter(a => a.id !== assetId));
      }
    } catch (err) {
      console.error("Failed to delete social account", err);
    }
  };

  const handleVerifyBusiness = () => {
    setLoading(true);
    setTimeout(() => {
      setBusinessVerified(true);
      localStorage.setItem("AdSimulator_sim_verified", JSON.stringify(true));
      setLoading(false);
      alert("Selamat! Portofolio Bisnis Anda telah terverifikasi secara resmi (Simulasi).");
    }, 1500);
  };

  const toggleSubmenu = (menu: string) => {
    setMenuExpanded(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      
      {/* LEFT COLUMN: Business Manager Navigation (Simulated Sidebar) */}
      <div className="w-64 bg-white border-r border-[#dddfe2] flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header Portfolio Selector */}
          <div className="p-4 border-b border-[#e9ebee] bg-slate-50">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Portofolio Aktif</label>
            {portfolios.length === 0 ? (
              <span className="text-xs text-gray-400 italic block mt-1">Belum ada Portofolio</span>
            ) : (
              <select
                value={activePortfolio?.id}
                onChange={(e) => {
                  const found = portfolios.find(p => p.id === e.target.value);
                  if (found) setActivePortfolio(found);
                }}
                className="w-full mt-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs font-bold focus:outline-none bg-white text-gray-800"
              >
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Sidebar Menu Links */}
          <div className="py-2 text-xs space-y-0.5">
            {/* Info Bisnis (Top Level) */}
            <button
              onClick={() => setActiveMenu("info-bisnis")}
              className={`w-full flex items-center gap-2.5 px-4 py-2 text-left font-semibold ${
                activeMenu === "info-bisnis" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Info bisnis</span>
            </button>

            {/* Pengguna Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("pengguna")}
                className="w-full flex items-center justify-between px-4 py-2 text-left font-bold text-gray-500 hover:text-gray-800"
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-gray-500" />
                  Pengguna
                </span>
                {menuExpanded.pengguna ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {menuExpanded.pengguna && (
                <div className="pl-9 space-y-0.5">
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("orang");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "orang" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Orang</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => alert("Fitur Mitra disimulasikan")}
                    className="w-full py-2 text-left font-medium text-gray-400 cursor-not-allowed block"
                  >
                    Mitra <Lock className="w-3 h-3 inline ml-1" />
                  </button>
                </div>
              )}
            </div>

            {/* Akun Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("akun")}
                className="w-full flex items-center justify-between px-4 py-2 text-left font-bold text-gray-500 hover:text-gray-800"
              >
                <span className="flex items-center gap-2.5">
                  <Flag className="w-4 h-4 text-gray-500" />
                  Akun
                </span>
                {menuExpanded.akun ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {menuExpanded.akun && (
                <div className="pl-9 space-y-0.5">
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("halaman");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "halaman" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Halaman (Fanspage)</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("akun-iklan");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "akun-iklan" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Akun iklan</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("akun-instagram");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "akun-instagram" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Akun Instagram</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("akun-whatsapp");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "akun-whatsapp" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Akun WhatsApp</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Sumber Data Section */}
            <div>
              <button
                onClick={() => toggleSubmenu("sumber_data")}
                className="w-full flex items-center justify-between px-4 py-2 text-left font-bold text-gray-500 hover:text-gray-800"
              >
                <span className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  Sumber Data
                </span>
                {menuExpanded.sumber_data ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {menuExpanded.sumber_data && (
                <div className="pl-9 space-y-0.5">
                  <button
                    onClick={() => {
                      if (portfolios.length === 0) {
                        alert("Silakan buat Portofolio Bisnis terlebih dahulu.");
                        return;
                      }
                      setActiveMenu("pixel");
                    }}
                    className={`w-full py-2 text-left font-medium block flex items-center justify-between pr-4 ${
                      portfolios.length === 0 ? "text-gray-400 cursor-not-allowed" :
                      activeMenu === "pixel" ? "text-blue-600 font-bold" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span>Pixel / Dataset</span>
                    {portfolios.length === 0 && <Lock className="w-3 h-3 text-gray-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Billing & Payments Link */}
            <Link
              href="/dashboard/billing"
              className="w-full flex items-center gap-2.5 px-4 py-2 text-left font-semibold text-gray-700 hover:bg-gray-100 block"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>Tagihan & pembayaran</span>
            </Link>
          </div>
        </div>

        {/* Back Link to Hub Utama */}
        <div className="p-3 border-t border-[#dddfe2]">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-1.5 w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Hub Utama
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* INFO BISNIS VIEW */}
        {activeMenu === "info-bisnis" && (
          <div className="space-y-6 max-w-4xl">
            {portfolios.length > 0 ? (
              <>
                {/* Header info */}
                <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xl border border-indigo-200">
                      {activePortfolio?.name.substring(0, 2).toUpperCase() || "MB"}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-[#1c2b33]">{activePortfolio?.name || "Nama Portofolio"}</h1>
                      <span className="text-xs text-gray-500 block">ID portofolio bisnis: {activePortfolio?.id || "N/A"}</span>
                      <span className="text-xs text-gray-500 block mt-1">Halaman Utama: <strong className="text-gray-800">{fanspages.length > 0 ? fanspages[0].name : "Tidak Ada"}</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyBusiness()}
                      disabled={businessVerified || loading}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border ${
                        businessVerified 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-[#0866FF] hover:bg-blue-700 text-white border-transparent shadow-sm"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {businessVerified ? "Terverifikasi" : "Verifikasi Bisnis"}
                    </button>
                  </div>
                </div>

                {/* Detail Bisnis */}
                <div className="bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-[#e9ebee] flex justify-between items-center bg-slate-55">
                    <h3 className="font-bold text-[#1c2b33] text-sm">Detail bisnis</h3>
                    <button className="text-xs font-bold text-[#0866FF] flex items-center gap-1 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 bg-white">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>

                  <div className="p-6 text-xs text-gray-700 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 font-bold block">Nama bisnis resmi</span>
                        <span className="font-semibold text-gray-800 mt-0.5 block">{activePortfolio?.name || "Tidak ada"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Situs Web Resmi</span>
                        <a
                          href={activePortfolio?.businessEmail 
                            ? `https://www.${activePortfolio.businessEmail.split("@")[1]}` 
                            : `https://www.${activePortfolio?.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "bisnisanda"}.com`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#0866FF] hover:underline mt-0.5 block flex items-center gap-1 cursor-pointer"
                        >
                          {activePortfolio?.businessEmail 
                            ? `https://www.${activePortfolio.businessEmail.split("@")[1]}` 
                            : `https://www.${activePortfolio?.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "bisnisanda"}.com`
                          } <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Email Bisnis</span>
                        <span className="font-semibold text-gray-800 mt-0.5 block">{activePortfolio?.businessEmail || "Tidak ada"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">Alamat</span>
                        <span className="font-semibold text-gray-800 mt-0.5 block">Indonesia</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <span className="text-gray-400 font-bold block">Status verifikasi bisnis</span>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${businessVerified ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className="font-bold text-gray-800">{businessVerified ? "Terverifikasi" : "Tidak Terverifikasi"}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {businessVerified 
                          ? "Portofolio bisnis Anda telah diverifikasi oleh AdSimulator Simulator untuk mendapatkan akses penuh." 
                          : "Meta belum memverifikasi detail bisnis ini. Klik tombol Verifikasi Bisnis di atas untuk memproses."}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <span className="text-gray-400 font-bold block">Batas pembuatan akun iklan</span>
                      <span className="font-semibold text-gray-850 mt-0.5 block text-sm font-bold">3</span>
                      <p className="text-[11px] text-gray-500">Anda dapat membuat hingga maksimal 3 akun iklan dalam portofolio bisnis ini.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center space-y-3">
                <Building className="w-12 h-12 text-[#0866FF] mx-auto" />
                <h3 className="font-bold text-gray-800 text-base">Belum Ada Portofolio Bisnis</h3>
                <p className="text-xs text-gray-605 max-w-md mx-auto leading-relaxed">
                  Silakan buat Portofolio Bisnis (Simulator) pertama Anda menggunakan formulir di bawah ini untuk membuka kunci semua pengaturan aset lainnya.
                </p>
              </div>
            )}

            {/* Create New Business Portfolio Form */}
            <div className="bg-white border border-[#dddfe2] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-[#1c2b33] text-sm">Buat Portofolio Bisnis (Simulator) Baru</h3>
              <form onSubmit={handleCreatePortfolio} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Nama Bisnis</label>
                  <input
                    type="text"
                    placeholder="Contoh: Creative Studio Nusantara"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Email Bisnis</label>
                  <input
                    type="email"
                    placeholder="nama@bisnis.com"
                    value={newPortfolioEmail}
                    onChange={(e) => setNewPortfolioEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Tambah Portofolio
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ORANG (USERS) VIEW */}
        {activeMenu === "orang" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#dddfe2] pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  Orang (Pengguna Sistem)
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Kelola orang-orang yang memiliki akses ke aset bisnis Anda di portofolio ini.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Add User Form */}
              <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4 self-start">
                <h3 className="font-bold text-[#1c2b33] text-sm">Tambahkan Orang Baru</h3>
                <form onSubmit={handleAddUser} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-650 uppercase">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Contoh: Ikhwanul Rahman"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-655 uppercase">Alamat Email Kerja</label>
                    <input
                      type="email"
                      placeholder="nama@perusahaan.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-660 uppercase">Peran Bisnis (Role)</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800"
                    >
                      <option value="EMPLOYEE">Akses Karyawan (Lolos Iklan)</option>
                      <option value="ADMIN">Akses Admin (Full Kontrol)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0866FF] hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Undang Orang
                  </button>
                </form>
              </div>

              {/* Users list */}
              <div className="md:col-span-2 bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50">
                  <h3 className="font-bold text-[#1c2b33] text-sm">Daftar Pengguna Aktif</h3>
                </div>
                
                <div className="divide-y divide-gray-150 text-xs">
                  {systemUsers.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {user.name}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                              user.role === "ADMIN" ? "bg-red-50 text-red-650 border border-red-100" : "bg-gray-100 text-gray-600"
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500">{user.email}</span>
                        </div>
                      </div>

                      {user.id !== "1" && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-gray-400 hover:text-red-650 p-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HALAMAN (PAGES) VIEW */}
        {activeMenu === "halaman" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#dddfe2] pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-emerald-600" />
                  Halaman Facebook (Fanspage)
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Aset halaman Fanspage resmi yang terhubung ke portofolio bisnis Anda untuk pengiriman materi iklan.
                </p>
              </div>
              <Link
                href="/dashboard/pages"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Kelola Fanspage
              </Link>
            </div>

            <div className="bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50">
                <h3 className="font-bold text-[#1c2b33] text-sm">Fanspage Terdaftar ({fanspages.length})</h3>
              </div>

              {fanspages.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <Flag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  Belum ada Halaman Fanspage. Buat satu di menu Fanspage.
                </div>
              ) : (
                <div className="divide-y divide-gray-150 text-xs">
                  {fanspages.map((fp) => (
                    <div key={fp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Flag className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{fp.name}</h4>
                          <span className="text-[10px] text-gray-500">Kategori: {fp.category} | ID Halaman: {fp.id}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded font-bold uppercase">
                        Aktif
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AKUN IKLAN VIEW */}
        {activeMenu === "akun-iklan" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#dddfe2] pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Akun Iklan (Ad Accounts)
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Akun iklan yang digunakan untuk melakukan pembayaran campaign dan menyimpan saldo virtual beriklan.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50">
                <h3 className="font-bold text-[#1c2b33] text-sm">Akun Iklan Virtual</h3>
              </div>

              {!adAccount ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  Tidak ada Akun Iklan aktif ditemukan.
                </div>
              ) : (
                <div className="p-6 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{adAccount.name}</h4>
                        <span className="text-[10px] text-gray-500">ID Akun Iklan: {adAccount.id}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">
                      Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border rounded-xl p-4 space-y-1">
                      <span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Saldo Virtual Saat Ini</span>
                      <span className="text-2xl font-black text-[#0866FF]">
                        {adAccount.currency} {adAccount.balance.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="bg-slate-50 border rounded-xl p-4 flex flex-col justify-center">
                      <span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px] mb-1">Status Penagihan</span>
                      <p className="text-[11px] text-gray-600 leading-normal">
                        Semua tagihan berjalan lancar. Pembayaran iklan di simulator akan terpotong dari saldo iklan virtual ini.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t">
                    <Link
                      href="/dashboard/billing"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
                    >
                      Top Up Saldo Virtual →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AKUN INSTAGRAM & WHATSAPP VIEW */}
        {(activeMenu === "akun-instagram" || activeMenu === "akun-whatsapp") && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#dddfe2] pb-4">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {activeMenu === "akun-instagram" ? (
                  <>
                    <InstagramIcon className="w-5 h-5 text-pink-600" />
                    Akun Instagram Bisnis
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                    Akun WhatsApp Business
                  </>
                )}
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Hubungkan aset media sosial resmi ke portofolio bisnis untuk opsi penempatan penargetan iklan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Connect Social Asset Form */}
              <div className="bg-white border border-[#dddfe2] rounded-xl p-5 shadow-sm space-y-4 self-start">
                <h3 className="font-bold text-[#1c2b33] text-sm">
                  {activeMenu === "akun-instagram" ? "Hubungkan Akun Instagram" : "Hubungkan Nomor WhatsApp"}
                </h3>
                
                <form onSubmit={handleAddSocial} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">
                      {activeMenu === "akun-instagram" ? "Username Instagram (@)" : "Nomor WhatsApp (dengan kode negara)"}
                    </label>
                    <input
                      type="text"
                      placeholder={activeMenu === "akun-instagram" ? "Contoh: @creative_studio" : "Contoh: 628123456789"}
                      value={newSocialName}
                      onChange={(e) => {
                        setNewSocialName(e.target.value);
                        setSocialType(activeMenu === "akun-instagram" ? "instagram" : "whatsapp");
                      }}
                      className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0866FF] bg-white text-gray-800 font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0866FF] hover:bg-blue-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Hubungkan Aset
                  </button>
                </form>
              </div>

              {/* Connected Assets List */}
              <div className="md:col-span-2 bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-[#1c2b33] text-sm">Aset Terkoneksi</h3>
                </div>

                <div className="divide-y divide-gray-150 text-xs">
                  {socialAssets.filter(a => a.type === (activeMenu === "akun-instagram" ? "instagram" : "whatsapp")).length === 0 ? (
                    <div className="text-center py-16 text-gray-500 italic">
                      Belum ada aset sosial terhubung.
                    </div>
                  ) : (
                    socialAssets.filter(a => a.type === (activeMenu === "akun-instagram" ? "instagram" : "whatsapp")).map((asset) => (
                      <div key={asset.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            asset.type === "instagram" ? "bg-pink-50 text-pink-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {asset.type === "instagram" ? <InstagramIcon className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 font-mono">{asset.name}</h4>
                            <span className="text-[10px] text-gray-400">Status: {asset.status}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSocial(asset.id)}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIXEL VIEW */}
        {activeMenu === "pixel" && (
          <div className="space-y-6 max-w-4xl">
            <div className="border-b border-[#dddfe2] pb-4 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  Meta Pixel / Dataset Tracker
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Sumber Data pelacak aktivitas pengunjung untuk merekam kejadian penting (konversi) di landing page Anda.
                </p>
              </div>
              <Link
                href="/dashboard/pixels"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Setup Pixel Tracker
              </Link>
            </div>

            <div className="bg-white border border-[#dddfe2] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#e9ebee] bg-slate-50">
                <h3 className="font-bold text-[#1c2b33] text-sm">Pixel yang Tersedia ({pixels.length})</h3>
              </div>

              {pixels.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  <Cpu className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  Belum ada Pixel dataset yang dibuat. Setup satu di menu Pixel Tracker.
                </div>
              ) : (
                <div className="divide-y divide-gray-150 text-xs font-mono">
                  {pixels.map((px) => (
                    <div key={px.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 font-sans">{px.name}</h4>
                          <span className="text-[10px] text-gray-500">ID: {px.id} | Website: {px.websiteUrl}</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-150 px-2.5 py-0.5 rounded font-bold uppercase font-sans">
                        Aktif
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
