'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Memproses login...');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      setCookie(null, 'accessToken', data.accessToken, { maxAge: 15 * 60, path: '/' });
      setCookie(null, 'refreshToken', data.refreshToken, { maxAge: 7 * 24 * 60 * 60, path: '/' });
      
      toast.success('Login berhasil! Mengarahkan ke dashboard...', { id: toastId });
      
      if (data.user.role === 'ADMIN') router.push('/admin');
      else if (data.user.role === 'OWNER') router.push('/owner');
      else router.push('/user');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      toast.error(msg, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side: Visual/Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#001859]">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001859] via-[#00288E]/80 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <div>
            <Link href="/" className="inline-flex items-center text-white font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
              <Home className="w-6 h-6 mr-2" /> TangerangKost
            </Link>
          </div>
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
              Selamat Datang Kembali!
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed">
              Temukan ribuan kost idaman Anda atau mulai kelola properti kost Anda dengan mudah di TangerangKost.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Masuk ke Akun</h2>
            <p className="text-gray-500">Silakan masukkan detail akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="email@contoh.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">Kata Sandi</label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#00288E] hover:text-[#001859] hover:underline">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi Anda" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#00288E] hover:bg-[#001859] text-white py-6 rounded-xl font-bold text-base mt-4 shadow-lg shadow-blue-900/20 transition-all"
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">Atau masuk dengan</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="mt-8">
            <button 
              type="button" 
              onClick={() => window.location.href = 'https://tangerangkost.onrender.com/api/v1/auth/google'}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl font-semibold transition-all hover:shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>
          </div>

          <div className="mt-10 text-center text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register?role=USER" className="text-[#00288E] hover:text-[#001859] font-bold hover:underline">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
