"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, UserX, UserCheck, RefreshCw, MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/simulate";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  adAccount: {
    balance: number;
    currency: string;
    _count: { campaigns: number };
  } | null;
}

interface Props {
  initialUsers: UserRow[];
}

export default function UserManagement({ initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleStatus = async (user: UserRow) => {
    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setActionLoading(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Hapus user ini? Semua data campaign mereka akan ikut terhapus.")) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1c2b33]">Manajemen Pengguna</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-[#0866FF] hover:bg-[#0757d4] text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" /> Buat pengguna
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengguna..."
            className="w-full pl-9 pr-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0866FF]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="ALL">Semua peran</option>
          <option value="USER">Pengguna</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="ALL">Semua status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="SUSPENDED">Ditangguhkan</option>
        </select>
        <span className="text-sm text-gray-500">{filtered.length} pengguna</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dddfe2] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#dddfe2] bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Peran</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Saldo</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Kampanye</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Login terakhir</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Bergabung</th>
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-[#f0f2f5] hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#0866FF] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-[#1c2b33]">{user.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500">{user.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role === "ADMIN" ? "Admin" : "Pengguna"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`} />
                    {user.status === "ACTIVE" ? "Aktif" : "Ditangguhkan"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-medium text-[#1c2b33]">
                  {user.adAccount ? formatCurrency(user.adAccount.balance, user.adAccount.currency) : "—"}
                </td>
                <td className="px-5 py-3 text-right text-[#1c2b33]">
                  {user.adAccount?._count.campaigns ?? 0}
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })
                    : "Belum pernah"}
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditUser(user)}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-[#1c2b33]"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user)}
                      disabled={actionLoading === user.id}
                      className={`p-1.5 rounded hover:bg-gray-100 ${
                        user.status === "ACTIVE" ? "text-orange-400 hover:text-orange-600" : "text-green-500 hover:text-green-700"
                      }`}
                      title={user.status === "ACTIVE" ? "Tangguhkan" : "Aktifkan"}
                    >
                      {user.status === "ACTIVE" ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={actionLoading === user.id || user.role === "ADMIN"}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 disabled:opacity-30"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit user modal */}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={(updated) => {
          setUsers((prev) => prev.map((u) => u.id === updated.id ? { ...u, ...updated } : u));
          setEditUser(null);
        }} />
      )}

      {/* Create user modal */}
      {showCreate && (
        <CreateUserModal onClose={() => setShowCreate(false)} onCreate={(user) => {
          setUsers((prev) => [user as UserRow, ...prev]);
          setShowCreate(false);
        }} />
      )}
    </div>
  );
}

function EditUserModal({ user, onClose, onSave }: {
  user: UserRow;
  onClose: () => void;
  onSave: (u: Partial<UserRow>) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [balance, setBalance] = useState(user.adAccount?.balance ?? 0);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role, balance }),
    });
    setLoading(false);
    if (res.ok) {
      onSave({ id: user.id, name, email, role, adAccount: user.adAccount ? { ...user.adAccount, balance } : null });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-[#1c2b33] mb-4">Edit Pengguna</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Peran</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none">
              <option value="USER">Pengguna</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Saldo simulasi (IDR)</label>
            <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-[#dddfe2] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
          <button onClick={save} disabled={loading} className="px-4 py-2 bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg text-sm font-semibold disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onCreate }: { onClose: () => void; onCreate: (u: unknown) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const create = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, balance }),
    });
    setLoading(false);
    if (res.ok) {
      const user = await res.json();
      onCreate(user);
    } else {
      const data = await res.json();
      setError(data.error || "Gagal membuat pengguna");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-[#1c2b33] mb-4">Buat Pengguna</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata sandi</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Peran</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm bg-white focus:outline-none">
              <option value="USER">Pengguna</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Saldo awal (IDR)</label>
            <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full px-3 py-2 border border-[#dddfe2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0866FF]" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-[#dddfe2] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
          <button onClick={create} disabled={loading || !name || !email || !password} className="px-4 py-2 bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-lg text-sm font-semibold disabled:opacity-60">
            {loading ? "Membuat..." : "Buat"}
          </button>
        </div>
      </div>
    </div>
  );
}
