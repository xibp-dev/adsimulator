"use client";

import { useState, useTransition } from "react";
import { QRCodeSVG } from "qrcode.react";
import { isValidQris, generateDynamicQris } from "@/lib/qris";
import { updateSiteSettings } from "@/lib/siteSettings";
import { CheckCircle2, AlertCircle, QrCode, Save, Eye, RotateCcw, Upload, Trash2, Loader2 } from "lucide-react";

interface Props {
  initialQris: string;
  initialQrisImageUrl: string;
}

export default function QrisForm({ initialQris, initialQrisImageUrl }: Props) {
  const [qrisInput, setQrisInput] = useState(initialQris);
  const [qrisImageUrl, setQrisImageUrl] = useState(initialQrisImageUrl);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [previewQris, setPreviewQris] = useState(initialQris);
  const [showPreview, setShowPreview] = useState(!!initialQris);
  const [uploading, setUploading] = useState(false);

  const isValid = qrisInput ? isValidQris(qrisInput) : true;

  function handlePreview() {
    if (!qrisInput || !isValid) return;
    setPreviewQris(qrisInput);
    setShowPreview(true);
  }

  function handleSave() {
    if (qrisInput && !isValid) {
      setError("QRIS tidak valid. Periksa kembali string QRIS Anda.");
      return;
    }
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await updateSiteSettings({ 
        qrisString: qrisInput.trim().toUpperCase(),
        qrisImageUrl: qrisImageUrl.trim()
      });
      if (res.success) {
        setSaved(true);
        if (qrisInput) {
          setPreviewQris(qrisInput.trim().toUpperCase());
          setShowPreview(true);
        } else {
          setShowPreview(false);
        }
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(res.error ?? "Gagal menyimpan.");
      }
    });
  }

  async function handleQrisImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // Step 1: Decode QR string dari gambar
      const decodeForm = new FormData();
      decodeForm.append("file", file);

      const decodeRes = await fetch("/api/admin/decode-qr", {
        method: "POST",
        body: decodeForm,
      });
      const decodeData = await decodeRes.json();

      if (!decodeRes.ok) {
        throw new Error(decodeData.error ?? "Gagal membaca QR dari gambar");
      }

      // Step 2: Upload gambar ke storage
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error ?? "Gagal mengunggah gambar");
      }

      // Set kedua nilai sekaligus
      setQrisImageUrl(uploadData.url);
      setQrisInput(decodeData.qrisString);
      setPreviewQris(decodeData.qrisString);
      setShowPreview(true);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Preview dengan nominal contoh Rp 10.000
  let previewDynamic = "";
  try {
    if (previewQris && isValidQris(previewQris)) {
      previewDynamic = generateDynamicQris(previewQris, 10000);
    }
  } catch {
    previewDynamic = "";
  }

  return (
    <div className="space-y-5">

      {/* === UPLOAD QRIS === */}
      <div>
        <label className="block text-sm font-semibold text-[#1c2b33] mb-1">
          Upload Foto / Gambar QRIS
        </label>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
          Upload foto QRIS kamu — sistem akan otomatis <span className="font-semibold text-[#0866FF]">membaca & mengekstrak string QRIS</span> dari gambar tersebut.
        </p>

        {!qrisImageUrl ? (
          <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${
            uploading
              ? "border-[#0866FF]/50 bg-blue-50/60 cursor-not-allowed"
              : "border-gray-200 hover:border-[#0866FF]/60 hover:bg-blue-50/30 bg-gray-50"
          }`}>
            {uploading ? (
              <>
                <Loader2 className="w-9 h-9 animate-spin text-[#0866FF]" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#0866FF]">Memproses gambar QRIS...</p>
                  <p className="text-xs text-blue-400 mt-1">Mengupload & membaca QR code</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                  <QrCode className="w-7 h-7 text-[#0866FF]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#1c2b33]">Klik untuk upload foto QRIS</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — otomatis terbaca sebagai string QRIS</p>
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleQrisImageUpload}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-xs font-semibold text-gray-600">Gambar QRIS Terunggah</p>
              </div>
              <div className="flex items-center gap-2">
                <label className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer hover:underline ${uploading ? "text-gray-400 cursor-not-allowed" : "text-[#0866FF]"}`}>
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? "Memproses..." : "Ganti"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQrisImageUpload}
                    disabled={uploading}
                  />
                </label>
                <span className="text-gray-200">|</span>
                <button
                  type="button"
                  onClick={() => { setQrisImageUrl(""); setQrisInput(""); setShowPreview(false); }}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:underline"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center p-5">
              <img
                src={qrisImageUrl}
                alt="QRIS Preview"
                className="max-h-44 max-w-full object-contain rounded-xl shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* === STRING QRIS HASIL DECODE === */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-semibold text-[#1c2b33]">
            String QRIS
          </label>
          {qrisInput && (
            <span className={`flex items-center gap-1 text-xs font-medium ${isValid ? "text-emerald-600" : "text-red-500"}`}>
              {isValid
                ? <><CheckCircle2 className="w-3 h-3" /> Terbaca otomatis ✓</>
                : <><AlertCircle className="w-3 h-3" /> Format tidak dikenali</>
              }
            </span>
          )}
        </div>
        <textarea
          value={qrisInput}
          onChange={(e) => {
            setQrisInput(e.target.value.trim());
            setError("");
            setSaved(false);
          }}
          rows={3}
          placeholder="Akan terisi otomatis saat upload foto QRIS di atas..."
          className={`w-full px-3 py-2.5 border rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0866FF] focus:border-transparent resize-none transition-colors ${
            qrisInput && !isValid ? "border-red-300 bg-red-50" : "border-[#dddfe2] bg-gray-50"
          }`}
          spellCheck={false}
          readOnly={uploading}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Terisi otomatis dari scan gambar QRIS. Bisa diedit manual jika perlu.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Saved */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Konfigurasi QRIS berhasil disimpan!
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreview}
          disabled={!qrisInput || !isValid}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-[#dddfe2] rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Eye className="w-4 h-4" />
          Preview QR Dinamis
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid || isPending || uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#0866FF] hover:bg-[#0757d4] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Menyimpan..." : "Simpan Pengaturan QRIS"}
        </button>
        {(qrisInput || qrisImageUrl) && (
          <button
            onClick={() => { setQrisInput(""); setQrisImageUrl(""); setShowPreview(false); setError(""); }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Preview QR Dinamis */}
      {showPreview && previewDynamic && (
        <div className="border border-[#dddfe2] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#dddfe2] bg-white">
            <QrCode className="w-4 h-4 text-[#0866FF]" />
            <p className="text-sm font-semibold text-[#1c2b33]">Preview QR Dinamis</p>
            <span className="text-xs text-gray-400 ml-auto">Contoh nominal: Rp 10.000</span>
          </div>
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#dddfe2]">
              <QRCodeSVG
                value={previewDynamic}
                size={200}
                level="M"
                includeMargin={false}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-gray-500">
                Scan QR ini dengan aplikasi dompet digital
              </p>
              <p className="text-xs font-mono text-gray-300 max-w-xs break-all px-4">
                {previewDynamic.slice(0, 40)}...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200/70 rounded-xl p-4 text-xs text-blue-800 leading-relaxed space-y-1">
        <p className="font-semibold text-blue-900">💡 Cara pakai:</p>
        <ol className="list-decimal list-inside space-y-1 mt-1">
          <li>Screenshot atau foto QR code QRIS dari aplikasi dompet digitalmu</li>
          <li>Upload gambar tersebut di atas</li>
          <li>Sistem otomatis membaca & mengisi string QRIS</li>
          <li>Klik <strong>Simpan Pengaturan QRIS</strong></li>
        </ol>
      </div>
    </div>
  );
}
