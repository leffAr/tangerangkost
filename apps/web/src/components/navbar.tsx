'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';
import { Menu, X, Mail } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cookies = parseCookies();
  const isLoggedIn = !!cookies.accessToken;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/owner') || pathname.startsWith('/dashboard') || pathname.startsWith('/user');

  if (isDashboardRoute) {
    return null; // Sembunyikan seluruh navbar jika berada di dalam halaman dashboard
  }

  const handleLogout = () => {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/';
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-[#00288E] font-bold text-xl tracking-tight">
                TangerangKost
              </Link>
            </div>
            
            {/* Right side Container (Auth Buttons + Hamburger) */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Auth Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {!isMounted ? (
                   <div className="w-24 h-9 bg-gray-100 animate-pulse rounded"></div>
                ) : !isLoggedIn ? (
                  <>
                    <Link href="/register?role=OWNER">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-[#00288E] transition-colors h-10 px-4">
                        + Pasang Iklan
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-[#00288E] font-semibold h-10 px-4">Masuk</Button>
                    </Link>
                    <Link href="/register?role=USER">
                      <Button size="sm" className="bg-[#00288E] hover:bg-[#001859] text-white h-10 px-6 font-semibold">Daftar</Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                      <Button className="bg-[#00288E] hover:bg-[#001859] text-white">Dashboard</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      Keluar
                    </Button>
                  </div>
                )}
              </div>

              {/* Hamburger Button (Tampil di Semua Layar) */}
              <div className="flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-gray-700 hover:text-[#00288E] p-2 focus:outline-none"
                >
                  <Menu className="w-7 h-7" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Overlay (Drawer on Mobile, Fullscreen on Desktop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end md:justify-center md:items-center">
          {/* Backdrop / Background */}
          <div 
            className="fixed inset-0 bg-black/50 md:bg-white/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Desktop Fullscreen Overlay Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="hidden md:block absolute top-6 right-8 p-2 text-gray-500 hover:text-[#00288E] z-50 transition-colors"
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="hidden md:flex relative z-10 flex-col items-center justify-center gap-10 animate-in fade-in zoom-in-95 duration-300">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-bold text-[#00288E] hover:text-[#001859] transition-colors uppercase tracking-widest">
              BERANDA
            </Link>
            <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-bold text-[#00288E] hover:text-[#001859] transition-colors uppercase tracking-widest">
              CARI KOST
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-bold text-[#00288E] hover:text-[#001859] transition-colors uppercase tracking-widest">
              TENTANG KAMI
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-4xl font-bold text-[#00288E] hover:text-[#001859] transition-colors uppercase tracking-widest">
              HUBUNGI KAMI
            </Link>
          </div>

          {/* Mobile Drawer Panel */}
          <div className="md:hidden relative flex flex-col w-4/5 max-w-sm h-full bg-white text-gray-900 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header & Close Button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="font-bold text-xl tracking-tight text-[#00288E]">TangerangKost</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Auth Buttons */}
              {!isMounted ? null : !isLoggedIn ? (
                <div className="flex flex-col gap-3 mb-8">
                  <Link href="/register?role=USER">
                    <Button variant="outline" className="w-full justify-center text-gray-700 border-gray-300 bg-white hover:bg-gray-50 hover:text-[#00288E] h-12 text-sm font-semibold tracking-wider">
                      DAFTAR
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-center text-gray-700 border-gray-300 bg-white hover:bg-gray-50 hover:text-[#00288E] h-12 text-sm font-semibold tracking-wider">
                      MASUK
                    </Button>
                  </Link>
                  <Link href="/register?role=OWNER" className="mt-2">
                    <Button className="w-full justify-center bg-[#00288E] hover:bg-[#001859] text-white h-12 text-sm font-bold tracking-wider">
                      PASANG IKLAN
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-8">
                  <Link href="/dashboard">
                    <Button className="w-full justify-center bg-[#00288E] hover:bg-[#001859] text-white h-12 text-sm font-bold tracking-wider">
                      DASHBOARD SAYA
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-red-600 border-red-200 bg-white hover:bg-red-50 hover:text-red-700 h-12 text-sm font-semibold tracking-wider mt-2"
                    onClick={handleLogout}
                  >
                    KELUAR
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col gap-6 text-sm font-semibold tracking-wider text-gray-600">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00288E] transition-colors uppercase">BERANDA</Link>
                <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00288E] transition-colors uppercase">CARI KOST</Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00288E] transition-colors uppercase">TENTANG KAMI</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#00288E] transition-colors uppercase">HUBUNGI KAMI</Link>
              </div>

              <hr className="border-gray-200 my-8" />

              {/* Promo Text */}
              <div className="text-gray-500 text-sm leading-relaxed mb-6">
                Cari Kost Terdekat Cepat & Mudah di seluruh area Tangerang bersama TangerangKost.
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-8">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#00288E] hover:border-[#00288E] cursor-pointer transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#00288E] hover:border-[#00288E] cursor-pointer transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
