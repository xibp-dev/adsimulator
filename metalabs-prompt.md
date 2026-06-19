# PROMPT: Build "MetaLabs" — Meta Ads Manager Simulator (Next.js)

> Copy seluruh isi di bawah ini ke AI coding tool (Claude Code / Cursor / v0 / Bolt). Kamu bisa pangkas bagian yang tidak perlu, atau bangun bertahap per fase.

---

## 0. KONTEKS & TUJUAN

Bangun sebuah web app bernama **MetaLabs**: sebuah **simulator Meta Ads Manager** (Facebook/Instagram Ads) untuk keperluan **edukasi/training**. User berlatih membuat campaign, mengatur objective, menyusun ad set, dan membuat ads — **tanpa benar-benar menjalankan iklan atau mengeluarkan biaya**. Semua data tersimpan di database internal, dan hasil performa (results, reach, CPR, dsb.) **disimulasikan** oleh sistem.

Aplikasi punya 2 sisi:
1. **User Dashboard** — meniru tampilan & alur Meta Ads Manager semirip mungkin.
2. **Admin Panel** — untuk mengelola user yang memakai simulator.

Target rasa visual: **sepersis mungkin dengan Meta Ads Manager 2024–2025** (layout, warna, terminologi, ikon, struktur 3-level Campaign/Ad Set/Ad).

---

## 1. TECH STACK

- **Next.js 14+** (App Router, TypeScript)
- **Tailwind CSS** untuk styling
- **shadcn/ui** untuk komponen (button, dialog, table, tabs, dropdown, toggle, dll.)
- **lucide-react** untuk ikon
- **Prisma** sebagai ORM
- **PostgreSQL** (atau SQLite untuk dev cepat)
- **NextAuth.js (Auth.js)** untuk autentikasi (Credentials provider + role-based access)
- **Zustand** atau React Context untuk state form multi-step
- **react-hook-form + zod** untuk validasi form
- **recharts** untuk grafik performa simulasi

Struktur folder rapi: `app/`, `components/`, `lib/`, `prisma/`, `types/`.

---

## 2. ROLE & AUTH

Dua role: `ADMIN` dan `USER`.

- Login pakai email + password.
- `USER` → diarahkan ke `/dashboard` (Ads Manager simulator).
- `ADMIN` → bisa akses `/admin` (admin panel) dan `/dashboard`.
- Middleware proteksi route: `/admin/*` hanya ADMIN, `/dashboard/*` butuh login.
- Session menyimpan: id, name, email, role.

---

## 3. DATA MODEL (Prisma Schema)

Buat model yang mencerminkan hierarki Meta Ads:

```
User
  id, name, email, passwordHash, role (ADMIN|USER),
  status (ACTIVE|SUSPENDED), createdAt, lastLoginAt

AdAccount        // setiap user punya 1 "akun iklan" simulasi
  id, userId, name, currency (default "IDR"),
  balance (saldo simulasi), createdAt

Campaign
  id, adAccountId, name,
  objective (enum: AWARENESS, TRAFFIC, ENGAGEMENT, LEADS, APP_PROMOTION, SALES),
  buyingType (default "AUCTION"),
  status (ACTIVE|PAUSED|DRAFT),
  specialAdCategories (json: housing/employment/credit/none),
  cboEnabled (bool),  // Advantage Campaign Budget
  budgetType (DAILY|LIFETIME), budgetAmount,
  createdAt, updatedAt

AdSet
  id, campaignId, name,
  performanceGoal (enum sesuai objective),
  conversionLocation (WEBSITE|APP|MESSENGER|WHATSAPP|CALLS|...),
  pixel (string opsional),
  budgetType, budgetAmount,        // jika CBO off
  scheduleStart, scheduleEnd,
  // Audience
  advantageAudienceOn (bool),
  locations (json), ageMin, ageMax, genders (json),
  detailedTargeting (json: interests/behaviors/demographics),
  languages (json),
  // Placements
  advantagePlacementsOn (bool),
  manualPlacements (json: facebook_feed, instagram_feed, stories, reels, ...),
  status, createdAt, updatedAt

Ad
  id, adSetId, name,
  identityPage (string), identityInstagram (string),
  format (SINGLE_IMAGE_VIDEO|CAROUSEL|COLLECTION),
  primaryText, headline, description,
  mediaUrls (json),
  cta (enum: LEARN_MORE, SHOP_NOW, SIGN_UP, BOOK_NOW, ...),
  destinationUrl,
  status, createdAt, updatedAt

SimMetrics      // metrik simulasi per entity (campaign/adset/ad)
  id, entityType, entityId,
  reach, impressions, results, costPerResult,
  amountSpent, ctr, cpm, frequency,
  date
```

Sediakan **seed script** (`prisma/seed.ts`): 1 admin, 2–3 user contoh, beberapa campaign dummy lengkap dengan metrik simulasi.

---

## 4. USER DASHBOARD — MENIRU META ADS MANAGER

### 4.1 Layout global
- **Top bar**: logo "MetaLabs", nama ad account + saldo simulasi, search, ikon notifikasi, avatar user (dropdown: profile, logout).
- **Left sidebar** (collapsible): menu ala Meta — *Campaigns*, *Ad sets*, *Ads*, *Audiences*, *Billing (simulasi)*, *Account overview*.
- Warna & font mendekati Meta: dominan putih/abu terang, aksen biru `#0866FF`, teks `#1c2b33`, border halus `#dddfe2`.

### 4.2 Halaman utama (Manage Ads) — tampilan tabel
- **3 tab horizontal**: `Campaigns` | `Ad sets` | `Ads` (klik baris campaign memfilter ad set di bawahnya — seperti aslinya).
- Tombol hijau **"+ Create"** di kiri atas → buka flow create (lihat 4.3).
- Toolbar: Duplicate, Edit, A/B test, Delete, Export, kolom **Columns: Performance**, date range picker.
- **Tabel** dengan kolom mirip Meta:
  - Toggle On/Off (switch) di kolom paling kiri
  - Name, Delivery (badge: Active/Off/In review), Bid strategy, Budget, Results, Reach, Impressions, Cost per result, Amount spent, Ends
- Baris bisa di-hover, di-select (checkbox), dengan inline status badge berwarna.

### 4.3 FLOW CREATE (multi-step, modal/full-page) — PERSIS ALUR META

**STEP 1 — Campaign level**
1. Pilih **objective** (tampilkan 6 kartu objective dengan ikon + deskripsi singkat persis Meta: Awareness, Traffic, Engagement, Leads, App promotion, Sales).
2. Lanjut → form campaign: nama campaign, toggle **Advantage campaign budget (CBO)**, **Special Ad Categories**, A/B test (opsional).

**STEP 2 — Ad Set level**
- Nama ad set
- **Conversion location** (Website / App / Messenger / WhatsApp / Calls) tergantung objective
- **Performance goal** (dropdown sesuai objective, mis. "Maximize number of link clicks")
- **Budget & schedule**: Daily/Lifetime + amount (format Rp), start/end date
- **Audience**:
  - Toggle **Advantage+ audience** (default on) vs **original audience**
  - Locations (search & pilih negara/kota — cukup mock list Indonesia + global)
  - Age range slider (13–65+)
  - Gender (All / Men / Women)
  - **Detailed targeting** (search interests/behaviors — mock data list, bisa tambah beberapa tag)
  - Languages
  - Panel **Audience size estimate** di kanan (angka estimasi disimulasikan dari pilihan)
- **Placements**:
  - Toggle **Advantage+ placements** vs **Manual placements**
  - Jika manual: checklist Facebook Feed, Instagram Feed, Stories, Reels, Marketplace, Audience Network, dll.
- Panel kanan: **Estimated daily results** (reach & results range, disimulasikan).

**STEP 3 — Ad level**
- Nama ad
- **Identity**: pilih Facebook Page + Instagram account (mock)
- **Format**: Single image/video, Carousel, Collection
- **Media**: upload/placeholder image (boleh dummy upload)
- **Primary text**, **Headline**, **Description**
- **Call to action** (dropdown: Learn More, Shop Now, Sign Up, dll.)
- **Destination**: Website URL
- **Ad preview** di panel kanan: render mockup **Facebook Feed** & **Instagram Feed** secara live mengikuti input (ini penting — preview real-time seperti Meta).

**STEP AKHIR** — tombol **"Publish"** (di simulator: simpan + generate metrik simulasi awal, status jadi "In review" lalu "Active" setelah beberapa detik/aksi admin).

### 4.4 Mesin simulasi metrik
Buat util `lib/simulate.ts`: berdasarkan budget, audience size, objective, dan placement, generate angka yang masuk akal (reach, impressions, results, CPR, CTR, CPM, amount spent) dengan sedikit randomisasi. Update metrik tiap hari (atau saat user buka dashboard) supaya terlihat "berjalan". Tampilkan tren di grafik recharts.

---

## 5. ADMIN PANEL (`/admin`)

Layout terpisah (sidebar admin). Fitur:

### 5.1 Dashboard admin
- Kartu statistik: total user, user aktif, total campaign dibuat, total ad set, total ad.
- Grafik: pendaftaran user per waktu, aktivitas campaign.

### 5.2 Manajemen User (inti permintaan)
- **Tabel user**: name, email, role, status, jumlah campaign, lastLogin, createdAt.
- Aksi: **Create user**, **Edit** (ubah nama/email/role/saldo simulasi), **Suspend/Activate**, **Reset password**, **Delete**, **Impersonate/lihat sebagai user** (opsional, lihat progres mereka).
- Search + filter (role, status) + pagination.

### 5.3 Monitoring konten user
- Lihat campaign/ad set/ad yang dibuat tiap user (read-only) — untuk menilai latihan mereka.
- Set saldo simulasi (top-up "budget" untuk akun latihan user).

### 5.4 Pengaturan
- Atur nilai default simulasi, mata uang, mock data (list interests, placements, pages).

---

## 6. UI/UX REQUIREMENT (akurasi visual)

- Terminologi **persis Meta** (objective names, "Advantage+", "Performance goal", "Cost per result", "Delivery").
- Komponen toggle on/off, badge status berwarna (Active=hijau, Off=abu, In review=kuning).
- Skema warna & spacing rapi, profesional, identik nuansa Meta Business Suite.
- Responsif (minimal desktop-first; sidebar collapsible di layar kecil).
- Empty states & loading skeletons.

> **Disclaimer wajib**: tampilkan banner kecil "Simulator — bukan iklan asli, tidak ada biaya nyata" agar jelas ini tools edukasi dan bukan produk Meta resmi. Jangan gunakan logo/brand resmi Meta; pakai nama & ikon generik "MetaLabs".

---

## 7. URUTAN PEMBANGUNAN (FASE)

1. **Fase 1** — Setup project, Prisma schema, auth + role, layout dashboard & sidebar.
2. **Fase 2** — Tabel Campaigns/Ad sets/Ads + data dummy (read).
3. **Fase 3** — Flow Create 3-step (Campaign → Ad Set → Ad) + ad preview live.
4. **Fase 4** — Mesin simulasi metrik + grafik.
5. **Fase 5** — Admin panel + manajemen user.
6. **Fase 6** — Polish UI agar mirip Meta, empty states, validasi, disclaimer.

Mulai dari Fase 1. Setelah tiap fase selesai, tunggu konfirmasi sebelum lanjut. Tampilkan struktur file yang dibuat di tiap langkah.

---

## 8. DELIVERABLE AKHIR
- Project Next.js jalan dengan `npm run dev`.
- `README.md` berisi cara setup DB, env, seed, dan akun demo (admin & user).
- Kode bersih, ber-TypeScript, komponen reusable.
