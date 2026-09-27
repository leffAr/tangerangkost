'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { Save, Phone, Mail, MapPin, Image as ImageIcon, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [aboutImage, setAboutImage] = useState('');
  const [heroSlides, setHeroSlides] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [isSavingHero, setIsSavingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const resContact = await api.get('/settings/contact');
      setWhatsapp(resContact.data.whatsapp || '');
      setEmail(resContact.data.email || '');
      setAddress(resContact.data.address || '');
      setInstagram(resContact.data.instagram || '');
      setTiktok(resContact.data.tiktok || '');

      const resAbout = await api.get('/settings/about');
      setAboutImage(resAbout.data.imageUrl || '');
      const resHero = await api.get('/settings/hero');
      setHeroSlides(resHero.data.slides || []);

    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await api.patch('/settings/contact', {
        whatsapp,
        email,
        address,
        instagram,
        tiktok,
      });
      toast.success('Pengaturan kontak berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui pengaturan kontak.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAboutImage(res.data.url);
    } catch (error) {
      alert('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAbout(true);
    setMessage('');
    try {
      await api.patch('/settings/about', { imageUrl: aboutImage });
      toast.success('Gambar Tentang Kami berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui gambar Tentang Kami.');
    } finally {
      setIsSavingAbout(false);
    }
  };
  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    try {
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHeroSlides([...heroSlides, res.data.url]);
    } catch (error) {
      alert('Gagal mengupload gambar');
    } finally {
      setIsUploading(false);
      if (heroFileInputRef.current) heroFileInputRef.current.value = '';
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    setMessage('');
    try {
      await api.patch('/settings/hero', { slides: heroSlides });
      toast.success('Gambar Slide Beranda berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui gambar slide beranda.');
    } finally {
      setIsSavingHero(false);
    }
  };


  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-3">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan Situs</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola informasi kontak dan pengaturan umum situs Anda.</p>
        </div>
      </div>

      

      {/* Contact Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Informasi Kontak (Halaman Hubungi Kami)</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <form onSubmit={handleSaveContact} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                Nomor WhatsApp Admin
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                required
              />
              <p className="text-xs text-gray-500">Format: Gunakan kode negara tanpa tanda + (contoh: 628...)</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Email Layanan
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bantuan@tangerangkost.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                Alamat Kantor
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Jl. Raya Serpong No. 88..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none resize-none"
                required
              ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-pink-600 font-bold">IG</span> Link Instagram
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/tangerangkost"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-black font-bold">TT</span> Link TikTok
                </label>
                <input
                  type="url"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="https://tiktok.com/@tangerangkost"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#00288E] hover:bg-[#001859] text-white font-bold"
              >
                {isSaving ? 'Menyimpan...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>


      {/* Hero Slides Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Gambar Slide Awal (Beranda)</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <form onSubmit={handleSaveHero} className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Atur urutan dan gambar yang akan muncul secara bergiliran pada halaman utama (Beranda).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={slide.startsWith('http') ? slide : `http://192.168.137.1:3000${slide}`} 
                      alt={`Slide ${idx+1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== idx))}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="aspect-video bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => heroFileInputRef.current?.click()}>
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Tambah Slide</span>
                </div>
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={heroFileInputRef}
                onChange={handleHeroFileChange}
                className="hidden" 
              />
              
              <div className="mt-4 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Atau masukkan Link/URL gambar secara manual (contoh: https://unsplash.com/...)"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setHeroSlides([...heroSlides, newImageUrl.trim()]);
                      setNewImageUrl('');
                    }
                  }}
                  className="shrink-0"
                >
                  Tambah dari URL
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSavingHero}
                className="bg-[#00288E] hover:bg-[#001859] text-white font-bold"
              >
                {isSavingHero ? 'Menyimpan...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* About Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Gambar Halaman "Tentang Kami" (About)</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <form onSubmit={handleSaveAbout} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                  {aboutImage ? (
                    <img 
                      src={aboutImage.startsWith('http') ? aboutImage : `http://192.168.137.1:3000${aboutImage}`} 
                      alt="Tentang Kami" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  )}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <p className="text-sm text-gray-600">
                    Gambar ini akan ditampilkan secara dominan pada halaman <a href="/about" target="_blank" className="text-[#00288E] font-medium hover:underline">/about</a>. Gunakan gambar lanskap beresolusi tinggi untuk hasil terbaik.
                  </p>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {isUploading ? 'Mengunggah...' : 'Pilih Gambar Baru'}
                    </Button>
                  </div>
                  <input
                    type="text"
                    value={aboutImage}
                    onChange={(e) => setAboutImage(e.target.value)}
                    placeholder="Atau masukkan URL gambar"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#00288E] focus:border-[#00288E] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button 
                type="submit" 
                disabled={isSavingAbout}
                className="bg-[#00288E] hover:bg-[#001859] text-white font-bold"
              >
                {isSavingAbout ? 'Menyimpan...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
