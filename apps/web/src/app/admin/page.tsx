'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, UserCheck, Home, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    },
    refetchInterval: 10000, // Refresh stats periodically
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00288E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-500">Ringkasan statistik sistem Tangerang Kost.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        
        {/* Pesan Masuk Card (Highlighted) */}
        <Link href="/admin/messages" className="block group">
          <Card className={`border-0 shadow-sm transition-all group-hover:-translate-y-1 ${stats?.unreadMessages > 0 ? 'bg-red-50 hover:bg-red-100 ring-1 ring-red-200' : 'bg-blue-50 hover:bg-blue-100'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stats?.unreadMessages > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#00288E]'}`}>
                  <Mail className="w-6 h-6" />
                </div>
              </div>
              <p className={`font-semibold mb-1 ${stats?.unreadMessages > 0 ? 'text-red-900' : 'text-gray-700'}`}>Pesan Baru</p>
              <div className="flex items-end justify-between">
                <p className={`text-4xl font-black ${stats?.unreadMessages > 0 ? 'text-red-600' : 'text-[#00288E]'}`}>
                  {stats?.unreadMessages || 0}
                </p>
                <ArrowRight className={`w-5 h-5 mb-1 ${stats?.unreadMessages > 0 ? 'text-red-400' : 'text-blue-400'}`} />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Total Users */}
        <Link href="/admin/users" className="block group">
          <Card className="border-0 shadow-sm transition-all hover:bg-gray-50 group-hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-1">Total Pencari Kos</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Owners */}
        <Link href="/admin/users" className="block group">
          <Card className="border-0 shadow-sm transition-all hover:bg-gray-50 group-hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-1">Total Pemilik</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalOwners || 0}</p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Kos */}
        <Link href="/admin/kos" className="block group">
          <Card className="border-0 shadow-sm transition-all hover:bg-gray-50 group-hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <Home className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-500 font-medium mb-1">Kos Terdaftar</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalKos || 0}</p>
            </CardContent>
          </Card>
        </Link>

        {/* Pending Verifications */}
        <Link href="/admin/verifications" className="block group">
          <Card className={`border-0 shadow-sm transition-all group-hover:-translate-y-1 ${stats?.pendingVerifications > 0 ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-gray-50'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stats?.pendingVerifications > 0 ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <p className={`font-medium mb-1 ${stats?.pendingVerifications > 0 ? 'text-yellow-800' : 'text-gray-500'}`}>Menunggu Verifikasi</p>
              <p className={`text-3xl font-bold ${stats?.pendingVerifications > 0 ? 'text-yellow-700' : 'text-gray-900'}`}>{stats?.pendingVerifications || 0}</p>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}
