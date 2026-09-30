'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { UserCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UserProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        toast.error('Gagal memuat profil');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Kata sandi baru dan konfirmasi kata sandi tidak cocok!');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Menyimpan profil...');
    
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      await api.patch('/auth/profile', payload);
      toast.success('Profil berhasil diperbarui!', { id: toastId });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal memperbarui profil';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
        <Link href="/user" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-gray-500">Kelola informasi pribadi dan keamanan akun Anda.</p>
      </div>
      
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-blue-100 text-[#00288E] rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{formData.name}</h2>
              <p className="text-gray-500">{formData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <input 
                required 
                type="text" 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input 
                required
                type="email" 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon / WhatsApp</label>
              <p className="text-xs text-gray-500 mb-2">Opsional, memudahkan pemilik kos menghubungi Anda jika diperlukan.</p>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="08..."
              />
            </div>

            <hr className="border-gray-100 my-6" />
            <h3 className="font-bold text-gray-900">Ubah Kata Sandi</h3>
            <p className="text-sm text-gray-500 mb-4">Kosongkan jika Anda tidak ingin mengubah kata sandi.</p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kata Sandi Baru</label>
              <input 
                type="password" 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="Masukkan kata sandi baru"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
              <input 
                type="password" 
                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" 
                value={formData.confirmPassword} 
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                placeholder="Ketik ulang kata sandi baru"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-[#00288E] hover:bg-[#001859] w-full text-lg py-6 rounded-xl shadow-lg shadow-blue-900/20 mt-8"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
