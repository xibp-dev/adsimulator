import Link from "next/link";
import { AlertCircle, Briefcase, Flag, ArrowRight } from "lucide-react";

interface Props {
  hasPortfolio: boolean;
  hasPage: boolean;
}

export default function PrerequisiteWarning({ hasPortfolio, hasPage }: Props) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-[#dddfe2] rounded-xl shadow-sm max-w-2xl w-full p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#1c2b33]">Ads Manager Terkunci</h1>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Sebagai langkah edukasi, Anda wajib mengatur <strong className="font-bold text-gray-800">Portofolio Bisnis</strong> dan <strong className="font-bold text-gray-800">Fanspage</strong> terlebih dahulu sebelum diizinkan membuat iklan pertama Anda.
          </p>
        </div>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className={`p-4 rounded-lg border flex items-center justify-between ${hasPortfolio ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-[#dddfe2]'}`}>
            <div className="flex items-center gap-3">
              <Briefcase className={`w-5 h-5 ${hasPortfolio ? 'text-emerald-600' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm font-semibold ${hasPortfolio ? 'text-emerald-800' : 'text-[#1c2b33]'}`}>1. Portofolio Bisnis</p>
                <p className="text-xs text-gray-500">{hasPortfolio ? 'Selesai' : 'Wajib (Belum diatur)'}</p>
              </div>
            </div>
            {!hasPortfolio && (
              <Link href="/dashboard/business-settings" className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1">
                Atur <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className={`p-4 rounded-lg border flex items-center justify-between ${hasPage ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-[#dddfe2]'}`}>
            <div className="flex items-center gap-3">
              <Flag className={`w-5 h-5 ${hasPage ? 'text-emerald-600' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm font-semibold ${hasPage ? 'text-emerald-800' : 'text-[#1c2b33]'}`}>2. Halaman (Fanspage)</p>
                <p className="text-xs text-gray-500">{hasPage ? 'Selesai' : 'Wajib (Belum diatur)'}</p>
              </div>
            </div>
            {!hasPage && (
              <Link href="/dashboard/pages" className="text-xs font-semibold text-[#0866FF] hover:underline flex items-center gap-1">
                Atur <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
