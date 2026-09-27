'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading stats...</div>;

  return (
    <div>
      <h1 className="hidden md:block text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2">Total Pengguna</p>
            <p className="text-3xl font-bold text-[#00288E]">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2">Total Pemilik</p>
            <p className="text-3xl font-bold text-[#00288E]">{stats?.totalOwners || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2">Kos Terdaftar</p>
            <p className="text-3xl font-bold text-[#00288E]">{stats?.totalKos || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 mb-2">Menunggu Verifikasi</p>
            <p className="text-3xl font-bold text-yellow-600">{stats?.pendingVerifications || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
