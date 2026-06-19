# AdSimulator — Meta Ads Manager Simulator

Simulator Meta Ads Manager (Facebook & Instagram Ads) berbahasa Indonesia untuk keperluan **edukasi dan training**. Berlatih membuat campaign, ad set, dan ads seperti di Meta Ads Manager nyata — tanpa biaya asli.

> **Disclaimer**: Tools edukasi independen, **bukan** produk resmi Meta/Facebook.

---

## Fitur

### Portal & Dashboard Pengguna (`/dashboard`)
- AdSimulator Home dengan alur setup bisnis (Portofolio → Fanspage → Pixel → Pembayaran → Ads Manager)
- Create Campaign 3 langkah (Campaign → Ad Set → Ad) dengan pengaturan berbeda per tujuan kampanye, seperti Meta asli
- Penargetan terperinci (Detailed Targeting) bergaya Meta: Minat, Perilaku, Demografi
- Live ad preview Facebook & Instagram Feed
- Tabel Campaign/Ad Set/Ads dengan metrik simulasi + grafik performa
- Pemirsa (Custom / Lookalike / Saved), Pixel, Fanspage, Penagihan
- Panduan Beriklan: istilah & metrik (CPC, CPM, CTR, ROAS, dll), studi kasus + kalkulator, dan aturan Meta
- Profil & pengaturan akun (ganti kata sandi)

### Panel Admin (`/admin`)
- Dashboard statistik (total user, campaign, ad set, ads)
- Manajemen pengguna: buat, edit, suspend/aktifkan, set saldo
- Monitor konten, preset target & aset, kontrol simulasi
- Pengaturan SEO situs (title, deskripsi, keywords, OG, sitemap/robots)

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL) sebagai database
- **NextAuth.js v5 beta** (Credentials provider, JWT)
- **Prisma 5** (skema/migrasi) · **Recharts** (grafik) · **Lucide React** (ikon)

---

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/xibp-dev/<nama-repo>.git
cd <nama-repo>
npm install
```

### 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env`, lalu isi dengan kredensial Supabase milikmu:

```bash
cp .env.example .env
```

Variabel yang dibutuhkan (lihat `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
DIRECT_URL=...
NEXTAUTH_SECRET=...        # buat acak: `openssl rand -base64 32`
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://adsimulator.web.id
```

### 3. Database

Skema ada di `prisma/schema.prisma`. Terapkan ke database Supabase:

```bash
npx prisma db push
npx prisma db seed   # mengisi data demo (opsional)
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Akun Demo (setelah seed)

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@metalabs.id    | admin123 |
| User  | budi@example.com     | user123  |

> Ganti kredensial demo sebelum dipakai di lingkungan publik.

---

## Struktur Folder

```
app/
  api/             # API routes (campaigns, adsets, ads, audiences, dll)
  admin/           # Panel admin
  dashboard/(meta) # Dashboard pengguna (Ads Manager + panduan + profil)
  login/ register/ # Autentikasi
components/
  create/          # Flow create campaign (StepObjective/Campaign/AdSet/Ad)
  dashboard/       # Tabel, chart, views
  layout/          # TopBar, Sidebar, layout
lib/
  supabase.ts      # Supabase client
  simulate.ts      # Mesin simulasi metrik
  mockData.ts      # Data referensi (targeting, placements, dll)
  siteSettings.ts  # Pengaturan SEO (cached)
prisma/
  schema.prisma    # Skema database
  seed.ts          # Seed data demo
types/
  index.ts         # Tipe TypeScript
```

---

## Catatan

Project ini mode simulasi penuh — tidak terhubung ke API Meta asli dan tidak ada transaksi/biaya nyata.
