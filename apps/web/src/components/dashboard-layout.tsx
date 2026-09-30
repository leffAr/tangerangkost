'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Building, ShieldCheck, LogOut, ClipboardList, Star, UserCircle, ArrowLeft, MapPin, Settings, Menu, X, Mail, Heart } from 'lucide-react';
import { destroyCookie } from 'nookies';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { getUnreadMessageCount } from '@/lib/api';

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: 'ADMIN' | 'OWNER' | 'USER';
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Realtime Polling for Unread Messages (only for ADMIN)
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: getUnreadMessageCount,
    enabled: role === 'ADMIN',
    refetchInterval: 5000, // Poll every 5 seconds for real-time feel
  });

  const userLinks = [
    { name: 'Pencarian Kos', href: '/search', icon: Home },
    { name: 'Pesanan Saya', href: '/user', icon: ClipboardList },
    { name: 'Kos Tersimpan', href: '/user/favorites', icon: Heart },
    { name: 'Profil', href: '/user/profile', icon: UserCircle },
  ];

  const ownerLinks = [
    { name: 'Overview', href: '/owner', icon: Home },
    { name: 'Manajemen Kos', href: '/owner/kos', icon: Building },
    { name: 'Profil', href: '/owner/profile', icon: UserCircle },
    { name: 'Ulasan Penyewa', href: '/owner/reviews', icon: Star },
  ];

  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: Home },
    { name: 'Manajemen User', href: '/admin/users', icon: Users },
    { name: 'Verifikasi Owner', href: '/admin/verifications', icon: ShieldCheck },
    { name: 'Manajemen Kos', href: '/admin/kos', icon: Building },
    { name: 'Area Populer', href: '/admin/popular-areas', icon: MapPin },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
    { name: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'OWNER' ? ownerLinks : userLinks;

  const mobileTabLinks = role === 'ADMIN'
    ? [
        { name: 'Overview', href: '/admin', icon: Home },
        { name: 'Kos', href: '/admin/kos', icon: Building },
        { name: 'Pesan', href: '/admin/messages', icon: Mail },
      ]
    : role === 'OWNER'
    ? [
        { name: 'Overview', href: '/owner', icon: Home },
        { name: 'Kos', href: '/owner/kos', icon: Building },
        { name: 'Profil', href: '/owner/profile', icon: UserCircle },
      ]
    : [
        { name: 'Cari Kos', href: '/search', icon: Home },
        { name: 'Pesanan', href: '/user', icon: ClipboardList },
        { name: 'Profil', href: '/user/profile', icon: UserCircle },
      ];

  const handleLogout = () => {
    destroyCookie(null, 'accessToken', { path: '/' });
    destroyCookie(null, 'refreshToken', { path: '/' });
    queryClient.clear();
    router.push('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 md:bg-white w-full overflow-x-hidden">
      
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex justify-between items-center w-full">
        <h1 className="font-bold text-gray-900 text-xl tracking-tight">
          {role === 'ADMIN' ? 'Admin Panel' : role === 'OWNER' ? 'Owner Panel' : 'User Panel'}
        </h1>
        <button 
          onClick={handleLogout} 
          className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        md:relative md:w-64 md:bg-gray-50 md:translate-x-0 md:shadow-none md:sticky md:top-0 md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 md:bg-transparent">
          <h2 className="font-bold text-gray-700">
            {role === 'ADMIN' ? 'Admin Panel' : role === 'OWNER' ? 'Owner Panel' : 'User Panel'}
          </h2>
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isMessageTab = link.name === 'Pesan Masuk';
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#00288E] text-white shadow-sm md:shadow-none'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {link.name}
                </div>
                {isMessageTab && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2 bg-gray-50/50 md:bg-transparent md:pb-4 pb-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 pb-28 md:pb-8 md:p-8 bg-white min-h-screen">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center px-2 py-1">
          {mobileTabLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isMessageTab = link.name === 'Pesan';
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center justify-center min-w-[64px] py-2 px-1 transition-all group relative ${
                  isActive ? 'text-[#00288E]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-blue-100/50' : 'bg-transparent group-hover:bg-gray-50'
                }`}>
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 stroke-[2.5px]' : 'scale-100'}`} />
                  {isMessageTab && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-medium text-center leading-tight truncate w-full px-1 ${
                  isActive ? 'font-bold' : ''
                }`}>
                  {link.name}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-w-[64px] py-2 px-1 transition-all group ${
              isMobileMenuOpen ? 'text-[#00288E]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? 'bg-blue-100/50' : 'bg-transparent group-hover:bg-gray-50'
            }`}>
              <Menu className={`w-5 h-5 transition-transform duration-300 ${isMobileMenuOpen ? 'scale-110 stroke-[2.5px]' : 'scale-100'}`} />
            </div>
            <span className={`text-[10px] mt-1 font-medium text-center leading-tight truncate w-full px-1 ${
              isMobileMenuOpen ? 'font-bold' : ''
            }`}>
              Menu
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
