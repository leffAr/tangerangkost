'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getImageUrl } from '@/lib/image';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Trash2, Edit3, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OwnerKosListPage() {
  const queryClient = useQueryClient();
  const { data: koses, isLoading } = useQuery({
    queryKey: ['owner-koses'],
    queryFn: async () => {
      const { data } = await api.get('/owner/kos');
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['owner-stats'],
    queryFn: async () => {
      const { data } = await api.get('/owner/stats');
      return data;
    },
  });

  const isVerified = stats?.verificationStatus === 'VERIFIED';

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Kos "${name}"?`)) return;
    
    const toastId = toast.loading('Menghapus...');
    try {
      await api.delete(`/kos/${id}`);
      toast.success('Kos berhasil dihapus', { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['owner-koses'] });
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus kos', { id: toastId });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/owner" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manajemen Kos</h1>
          {isVerified ? (
            <Link href="/owner/kos/create">
              <Button className="bg-[#00288E]"><Plus className="w-4 h-4 mr-2" /> Tambah Kos Baru</Button>
            </Link>
          ) : (
            <Button 
              type="button"
              className="bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-white" 
              onClick={() => toast.error("Akun Anda belum diverifikasi Admin. Anda tidak dapat memposting Kos.")}
            >
              <Plus className="w-4 h-4 mr-2" /> Tambah Kos Baru
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : koses?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">Anda belum memiliki kos yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {koses?.map((kos: any) => (
            <Card key={kos.id} className="overflow-hidden hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 bg-white">
              {kos.kosImages?.[0] ? (
                <div className="aspect-[4/3] sm:aspect-video w-full bg-gray-100 overflow-hidden relative">
                  <img src={getImageUrl(kos.kosImages[0].url)} alt={kos.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-[4/3] sm:aspect-video w-full bg-gray-50 flex items-center justify-center text-gray-300 border-b border-gray-100">
                  <ImageIcon className="w-10 h-10 opacity-40" />
                </div>
              )}
              <CardContent className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-gray-900 line-clamp-1 mb-1">{kos.name}</h3>
                <p className="text-gray-500 text-sm mb-5 line-clamp-1">{kos.village}, {kos.district}</p>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link href={`/owner/kos/${kos.id}/edit`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-[#00288E] hover:bg-[#00288E] hover:text-white border-[#00288E]/30 transition-colors">
                      <Edit3 className="w-4 h-4 mr-1 sm:mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button onClick={() => handleDelete(kos.id, kos.name)} variant="outline" size="sm" className="w-full text-red-600 hover:bg-red-600 hover:text-white border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4 mr-1 sm:mr-2" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
