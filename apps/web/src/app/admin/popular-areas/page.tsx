'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImageUrl } from '@/lib/image';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Edit, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useRef } from 'react';

export default function PopularAreasAdminPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({ name: '', imageUrl: '', order: 0 });

  const { data: areas, isLoading } = useQuery({
    queryKey: ['admin-popular-areas'],
    queryFn: async () => {
      const { data } = await api.get('/admin/popular-areas');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => await api.post('/admin/popular-areas', data),
    onSuccess: () => {
      toast.success('Area berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['admin-popular-areas'] });
      setIsAdding(false);
      setFormData({ name: '', imageUrl: '', order: 0 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => await api.patch(`/admin/popular-areas/${id}`, data),
    onSuccess: () => {
      toast.success('Area berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['admin-popular-areas'] });
      setEditingId(null);
      setFormData({ name: '', imageUrl: '', order: 0 });
      setIsAdding(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/admin/popular-areas/${id}`),
    onSuccess: () => {
      toast.success('Area berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['admin-popular-areas'] });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => await api.patch(`/admin/popular-areas/${id}`, { isActive }),
    onSuccess: () => {
      toast.success('Status visibilitas berhasil diubah');
      queryClient.invalidateQueries({ queryKey: ['admin-popular-areas'] });
    }
  });

  const handleEdit = (area: any) => {
    setEditingId(area.id);
    setFormData({ name: area.name, imageUrl: area.imageUrl, order: area.order });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', imageUrl: '', order: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate({ ...formData, order: Number(formData.order) });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      
      const res = await api.post('/admin/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setFormData(prev => ({ ...prev, imageUrl: `https://tangerangkost.onrender.com${res.data.url}` }));
      toast.success('Foto berhasil diupload');
    } catch (error) {
      toast.error('Gagal upload foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Area Populer</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daftar kecamatan/area yang muncul di Beranda</p>
        </div>
        {!isAdding && (
          <Button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', imageUrl: '', order: 0 }); }} className="bg-[#00288E] text-white">
            <Plus className="w-4 h-4 mr-2" /> Tambah Area
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-8 border-2 border-blue-100">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">{editingId ? 'Edit Area Populer' : 'Tambah Area Baru'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Area</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#00288E]" 
                  placeholder="Misal: Kost Kelapa Dua"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Foto Background</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <input 
                      type="url" 
                      value={formData.imageUrl} 
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
                      className="w-full border border-gray-300 p-3 rounded-md mb-2 focus:ring-2 focus:ring-[#00288E]" 
                      placeholder="Masukkan URL Gambar atau Upload Foto (https://...)"
                      required 
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">ATAU</span>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        <Upload className="w-4 h-4 mr-2" /> {isUploading ? 'Mengupload...' : 'Upload dari Komputer'}
                      </Button>
                    </div>
                  </div>
                  {formData.imageUrl && (
                    <div className="w-32 h-24 border rounded overflow-hidden shadow-sm flex-shrink-0">
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Error')} />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Urutan Tampil (Angka)</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={e => setFormData({ ...formData, order: Number(e.target.value) })} 
                  className="w-full md:w-32 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#00288E]" 
                />
                <p className="text-xs text-gray-500 mt-1">Angka terkecil akan tampil paling pertama di Beranda.</p>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancel}>Batal</Button>
                <Button type="submit" className="bg-[#00288E] text-white px-8">{editingId ? 'Update Area' : 'Simpan Area'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {areas?.map((area: any) => (
            <Card key={area.id} className={`overflow-hidden group border-0 shadow-sm hover:shadow-md transition-all ${!area.isActive && 'opacity-60 grayscale-[50%]'}`}>
              <div className="h-40 w-full bg-gray-100 relative">
                <img src={getImageUrl(area.imageUrl)} alt={area.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <h3 className="text-white font-bold text-center drop-shadow-md mb-2">{area.name}</h3>
                  {!area.isActive && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Disembunyikan</span>}
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  Urutan: {area.order}
                </div>
              </div>
              <CardContent className="p-3 bg-white flex flex-col gap-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Tampil di Beranda?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={area.isActive} onChange={(e) => toggleActiveMutation.mutate({ id: area.id, isActive: e.target.checked })} />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00288E]"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2" onClick={() => handleEdit(area)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2" onClick={() => {
                    if(confirm('Yakin ingin menghapus area ini dari Beranda?')) deleteMutation.mutate(area.id);
                  }}>
                    <Trash2 className="w-4 h-4 mr-1" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {areas?.length === 0 && (
             <div className="col-span-4 p-8 text-center text-gray-500 border-2 border-dashed rounded-xl">
               Belum ada Area Kost yang ditambahkan. Silakan klik "Tambah Area" di atas.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
