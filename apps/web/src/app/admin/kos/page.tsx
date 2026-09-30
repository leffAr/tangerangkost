'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getImageUrl } from '@/lib/image';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Trash2, Image as ImageIcon, MapPin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminKosListPage() {
  const queryClient = useQueryClient();
  const { data: koses, isLoading } = useQuery({
    queryKey: ['admin-koses'],
    queryFn: async () => {
      const { data } = await api.get('/admin/kos');
      return data;
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus Kos "${name}" secara permanen dari sistem?`)) return;
    
    const toastId = toast.loading('Menghapus...');
    try {
      await api.post(`/admin/kos/${id}/delete`);
      toast.success('Kos berhasil dihapus dari sistem', { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['admin-koses'] });
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus kos', { id: toastId });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manajemen Seluruh Kost</h1>
        </div>
        <p className="text-gray-500 mt-2 text-sm">Lihat dan kelola seluruh properti kost yang terdaftar di platform.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : koses?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">Belum ada kost yang terdaftar di sistem.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {koses?.map((kos: any) => (
            <Card key={kos.id} className="overflow-hidden hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 bg-white relative">
              <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${kos.status === 'APPROVED' ? 'bg-green-100 text-green-700' : kos.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {kos.status}
                </span>
              </div>
              
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
                <p className="text-gray-500 text-xs mb-4 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" /> {kos.village}, {kos.district}
                </p>
                <div className="bg-gray-50 p-3 rounded-lg mb-5 border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Pemilik Kos</p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{kos.owner?.user?.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{kos.owner?.user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Link href={`/kos/${kos.slug}`} target="_blank" className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-[#00288E] hover:bg-[#00288E] hover:text-white border-[#00288E]/30 transition-colors px-0">
                      Lihat Halaman
                    </Button>
                  </Link>
                  <Button onClick={() => handleDelete(kos.id, kos.name)} variant="outline" size="sm" className="w-full text-red-600 hover:bg-red-600 hover:text-white border-red-200 transition-colors px-0">
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
