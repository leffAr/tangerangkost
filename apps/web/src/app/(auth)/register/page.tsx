'use client';

import { useState, useEffect, Suspense } from 'react';
import { api } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const OWNER_QUESTIONS = [
  "Saya berjanji untuk memberikan informasi dan harga kost yang sebenar-benarnya tanpa unsur penipuan.",
  "Saya bersedia menjaga kebersihan dan keamanan lingkungan kost yang saya kelola.",
  "Saya siap mematuhi peraturan dan hukum yang berlaku terkait penyewaan properti di daerah Tangerang.",
  "Saya mengizinkan pihak Admin untuk memblokir akun saya apabila ditemukan pelanggaran atau laporan penipuan.",
  "Saya memahami bahwa sistem ini hanya perantara, dan segala transaksi pembayaran merupakan tanggung jawab saya dengan pihak penyewa."
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'USER';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Array of 5 booleans for the owner questions
  const [agreements, setAgreements] = useState([false, false, false, false, false]);
  const allAgreed = agreements.every(Boolean);

  const router = useRouter();

  useEffect(() => {
    if (defaultRole === 'OWNER' || defaultRole === 'USER') {
      setRole(defaultRole);
    }
  }, [defaultRole]);

  const toggleAgreement = (index: number) => {
    const newAgreements = [...agreements];
    newAgreements[index] = !newAgreements[index];
    setAgreements(newAgreements);
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'OWNER') {
      // Show modal instead of submitting immediately
      setShowModal(true);
    } else {
      // Submit immediately for USER
      executeRegistration();
    }
  };

  const executeRegistration = async () => {
    setIsLoading(true);
    setShowModal(false);
    const toastId = toast.loading('Memproses pendaftaran...');
    try {
      await api.post('/auth/register', { email, password, name, role });
      toast.success('Pendaftaran berhasil! Mengarahkan ke halaman login...', { id: toastId });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.';
      toast.error(msg, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-10 px-4">
        <form onSubmit={handleInitialSubmit} className="flex flex-col gap-5 p-6 md:p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border border-gray-100 my-auto">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900">Buat Akun Baru</h1>
            <p className="text-gray-500 mt-2 text-sm">
              {role === 'OWNER' ? 'Daftar sebagai pemilik properti kost.' : 'Daftar untuk mencari dan menyimpan kost impianmu.'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input 
              type="text" placeholder="Masukkan nama lengkap" value={name} required
              onChange={e => setName(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" placeholder="contoh@email.com" value={email} required
              onChange={e => setEmail(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none transition-all" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" placeholder="Minimal 6 karakter" value={password} required
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none transition-all" 
            />
          </div>
          
          {/* Hidden role input based on URL */}
          <input type="hidden" value={role} />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white p-3 rounded-lg font-bold shadow-md transition-all mt-2 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00288E] hover:bg-[#001859]'
            }`}
          >
            {isLoading ? 'Memproses...' : role === 'OWNER' ? 'Daftar Sebagai Pemilik' : 'Daftar Sebagai Pencari Kost'}
          </button>

          <div className="flex items-center gap-4 my-1">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Atau</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button 
            type="button" 
            onClick={() => window.location.href = 'http://192.168.137.1:3000/api/v1/auth/google'}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 p-3 rounded-lg font-semibold transition-all hover:shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-1">
            Sudah punya akun? <Link href="/login" className="text-[#00288E] font-semibold hover:underline">Masuk di sini</Link>
          </p>
        </form>
      </div>

      {/* MODAL PERSETUJUAN OWNER */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 bg-[#00288E] text-white">
              <h2 className="text-xl font-bold">Pernyataan Kesediaan Owner</h2>
              <p className="text-blue-100 text-sm mt-1">Mohon baca dan setujui persyaratan berikut untuk melanjutkan pendaftaran.</p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {OWNER_QUESTIONS.map((question, idx) => (
                <label key={idx} className="flex items-start gap-4 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div className="relative flex items-start pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={agreements[idx]}
                      onChange={() => toggleAgreement(idx)}
                      className="peer w-5 h-5 text-[#00288E] border-gray-300 rounded focus:ring-[#00288E] cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-700 font-medium leading-relaxed group-hover:text-gray-900">
                    {question}
                  </span>
                </label>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={executeRegistration}
                disabled={!allAgreed}
                className={`px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all ${
                  !allAgreed ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#00288E] hover:bg-[#001859]'
                }`}
              >
                Setuju & Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50">Memuat form...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
