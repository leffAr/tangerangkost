'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Info } from 'lucide-react';

export default function OwnerDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['ownerStats'],
    queryFn: async () => {
      const res = await api.get('/owner/stats');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Pemilik Kos</h1>

      {stats?.verificationStatus === 'PENDING' && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex gap-3 items-start">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Menunggu Verifikasi</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Akun Anda sedang ditinjau oleh Admin. Anda belum bisa menambahkan properti kos hingga akun diverifikasi.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2 font-medium">Total Kos</p>
            <p className="text-3xl font-bold text-[#00288E]">{stats?.totalKos || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2 font-medium">Total Semua Kamar</p>
            <p className="text-3xl font-bold text-green-600">{stats?.totalRooms || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2 font-medium">Total Ulasan</p>
            <p className="text-3xl font-bold text-amber-500">{stats?.totalReviews || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
