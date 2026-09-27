'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminVerificationsPage() {
  const queryClient = useQueryClient();

  const { data: verifications, isLoading } = useQuery({
    queryKey: ['admin-verifications'],
    queryFn: async () => {
      const res = await api.get('/admin/verifications');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/admin/verifications/${id}/approve`);
    },
    onSuccess: () => {
      toast.success('Pemilik berhasil diverifikasi!');
      queryClient.invalidateQueries({ queryKey: ['admin-verifications'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
    onError: () => {
      toast.error('Gagal memverifikasi pemilik.');
    }
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Verifikasi Pemilik Kos</h1>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {verifications?.map((v: any) => (
            <Card key={v.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg">{v.user?.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">{v.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => approveMutation.mutate(v.id)}
                    disabled={approveMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Terima
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!verifications || verifications.length === 0) && (
            <p className="text-gray-500">Tidak ada pengajuan verifikasi baru.</p>
          )}
        </div>
      )}
    </div>
  );
}
