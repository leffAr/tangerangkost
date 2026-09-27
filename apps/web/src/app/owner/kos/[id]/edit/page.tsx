'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter, useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Building, Info, DollarSign, Image as ImageIcon, Map, Crosshair, Snowflake, BedDouble, Bath, Server, Monitor, Sparkles, CheckSquare, Square, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function EditKosPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    village: '',
    district: '',
    regency: 'Kabupaten Tangerang',
    province: 'Banten',
    priceFrom: '',
    priceTo: '',
    genderType: 'CAMPUR',
    latitude: '',
    longitude: '',
    facilities: [] as string[]
  });
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const STANDARD_FACILITIES = [
    { name: 'AC Terpasang', icon: Snowflake },
    { name: 'Springbed & Sprei', icon: BedDouble },
    { name: 'KM Dalam', icon: Bath },
    { name: 'Lemari 2 Pintu', icon: Server },
    { name: 'Meja Belajar', icon: Monitor },
    { name: 'WiFi', icon: Sparkles }
  ];

  const handleFacilityToggle = (facilityName: string) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facilityName);
      if (exists) {
        return { ...prev, facilities: prev.facilities.filter(f => f !== facilityName) };
      } else {
        return { ...prev, facilities: [...prev.facilities, facilityName] };
      }
    });
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser Anda tidak mendukung deteksi lokasi.');
      return;
    }
    const toastId = toast.loading('Mencari lokasi Anda...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        toast.success('Lokasi berhasil didapatkan!', { id: toastId });
      },
      () => {
        toast.error('Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.', { id: toastId });
      }
    );
  };

  const handleExtractFromUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      setFormData(prev => ({
        ...prev,
        latitude: match[1],
        longitude: match[2]
      }));
      toast.success('Kordinat berhasil diekstrak dari URL!');
      e.target.value = '';
    }
  };

  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!id) return;
    const loadKos = async () => {
      try {
        // 1. Get owner koses to find the slug for this ID
        const { data: ownerKoses } = await api.get('/owner/kos');
        const kosMatch = ownerKoses.find((k: any) => k.id === id);
        if (!kosMatch) {
          toast.error('Kos tidak ditemukan');
          router.push('/owner/kos');
          return;
        }

        // 2. Fetch full details by slug
        const { data } = await api.get(`/kos/${kosMatch.slug}`);
          if (data.kosImages) setExistingImages(data.kosImages);
          setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          village: data.village || '',
          district: data.district || '',
          regency: data.regency || 'Kabupaten Tangerang',
          province: data.province || 'Banten',
          priceFrom: data.priceFrom?.toString() || '',
          priceTo: data.priceTo?.toString() || '',
          genderType: data.genderType || 'CAMPUR',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || '',
          facilities: data.facilities?.map((f: any) => f.facility.name) || []
        });
      } catch (err) {
        toast.error('Gagal memuat data kos');
      }
    };
    loadKos();
  }, [id, router]);

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await api.post(`/kos/${id}/images/${imageId}/delete`);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Foto berhasil dihapus!');
    } catch (error) {
      toast.error('Gagal menghapus foto');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Memperbarui data kos...');
    try {
      // Clean string from non-numeric characters before parsing
      const cleanNumber = (val: string) => Number(val.replace(/[^0-9.-]+/g, ''));

      // 1. Update Kos
      const payload: any = {
        ...formData,
        priceFrom: cleanNumber(formData.priceFrom),
        priceTo: cleanNumber(formData.priceTo),
      };
      
      // Remove string empty values for optional number fields
      if (payload.latitude === '') delete payload.latitude;
      else payload.latitude = Number(payload.latitude);
      
      if (payload.longitude === '') delete payload.longitude;
      else payload.longitude = Number(payload.longitude);

      await api.patch(`/kos/${id}`, payload);

      // 2. Upload Images if exist
      if (files.length > 0) {
        for (const f of files) {
          const uploadData = new FormData();
          uploadData.append('file', f);
          await api.post(`/kos/${id}/images`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      toast.success('Kos berhasil diperbarui!', { id: toastId });
      queryClient.invalidateQueries({ queryKey: ['owner-koses'] });
      router.push('/owner/kos');
    } catch (error: any) {
      const apiResponse = error.response?.data;
      const msg = apiResponse?.message;
      let errorMsg = 'Gagal memperbarui kos. Silakan coba lagi.';
      if (Array.isArray(msg)) errorMsg = msg.join(', ');
      else if (typeof msg === 'string') errorMsg = msg;
      
      toast.error(errorMsg, { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/owner/kos" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Manajemen Kos
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Data Kos</h1>
        <p className="text-gray-500 mt-2">Perbarui informasi properti kos Anda di bawah ini.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Info Dasar */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center">
            <Building className="w-5 h-5 text-[#00288E] mr-2" />
            <h2 className="font-bold text-[#00288E]">Informasi Properti</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kos</label>
              <input required type="text" placeholder="Misal: Kos Bintang Harapan" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Kos</label>
                <select className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all bg-white" value={formData.genderType} onChange={e => setFormData({...formData, genderType: e.target.value})}>
                  <option value="PUTRA">Khusus Putra</option>
                  <option value="PUTRI">Khusus Putri</option>
                  <option value="CAMPUR">Campur (Putra & Putri)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Mulai</label>
                  <input required type="number" placeholder="Rp" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" value={formData.priceFrom} onChange={e => setFormData({...formData, priceFrom: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Maksimal</label>
                  <input required type="number" placeholder="Rp" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" value={formData.priceTo} onChange={e => setFormData({...formData, priceTo: e.target.value})} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Location */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center">
            <MapPin className="w-5 h-5 text-[#00288E] mr-2" />
            <h2 className="font-bold text-[#00288E]">Lokasi & Peta</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" rows={2} placeholder="Jalan, RT/RW, Patokan" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Desa / Kelurahan</label>
                <input required type="text" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kecamatan</label>
                <input required type="text" className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-bold text-gray-900 mb-4 flex items-center">
                <Map className="w-4 h-4 mr-2" />
                Titik Kordinat Google Maps (Opsional)
              </label>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                <p className="text-xs text-gray-500 mb-3">Cara instan: Buka Google Maps di browser, cari titik kos Anda, salin URL/Link di atas (misal: google.com/maps/place/...), lalu tempel (paste) di kotak bawah ini.</p>
                <input type="text" placeholder="Paste URL Google Maps di sini..." className="w-full border border-gray-300 p-2.5 rounded-lg text-sm mb-4" onChange={handleExtractFromUrl} />
                
                <div className="flex items-center gap-4">
                  <div className="w-full h-px bg-gray-300"></div>
                  <span className="text-xs text-gray-400 font-bold">ATAU</span>
                  <div className="w-full h-px bg-gray-300"></div>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
                    <input type="text" placeholder="-6.2345" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
                    <input type="text" placeholder="106.1234" className="w-full border border-gray-300 p-2.5 rounded-lg text-sm" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                  </div>
                  <Button type="button" onClick={handleGetLocation} variant="outline" className="w-full md:w-auto flex items-center gap-2 border-blue-200 text-[#00288E] hover:bg-blue-50">
                    <Crosshair className="w-4 h-4" /> Deteksi GPS
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Detail & Media */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center">
            <Info className="w-5 h-5 text-[#00288E] mr-2" />
            <h2 className="font-bold text-[#00288E]">Detail & Media</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Fasilitas Unggulan</label>
              <div className="flex flex-wrap gap-3">
                {STANDARD_FACILITIES.map(fac => {
                  const isSelected = formData.facilities.includes(fac.name);
                  return (
                    <button
                      key={fac.name}
                      type="button"
                      onClick={() => handleFacilityToggle(fac.name)}
                      className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-[#00288E] bg-blue-50 text-[#00288E] font-bold shadow-sm' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-50" />}
                      <fac.icon className="w-4 h-4" />
                      {fac.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap & Peraturan</label>
              <textarea required className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] outline-none transition-all" rows={4} placeholder="Ceritakan keunggulan kos Anda (fasilitas tambahan, jam malam, dll)..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Galeri Foto Kos (Bisa pilih lebih dari 1)</label>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-blue-50 hover:border-[#00288E] transition-all cursor-pointer group">
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-[#00288E] transition-colors" />
                <span className="block text-sm font-bold text-[#00288E] mb-1">Klik untuk memilih foto</span>
                <span className="block text-xs text-gray-500">Atau seret dan lepas foto ke area ini (Format: JPG, PNG. Maksimal 5MB)</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles(prev => [...prev, ...newFiles]);
                    e.target.value = ''; // reset so same file can be selected again
                }} />
              </label>

              {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Foto Saat Ini (Tersimpan):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-gray-50">
                          <img src={`https://tangerangkost.onrender.com${img.url}`} alt="Kos" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              handleDeleteExistingImage(img.id);
                            }} 
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 p-1.5 rounded-full transition-colors shadow-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {files.map((f, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-sm group bg-gray-50">
                      <img src={URL.createObjectURL(f)} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setFiles(files.filter((_, idx) => idx !== i)); 
                        }} 
                        className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-700 p-1.5 rounded-full transition-colors shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="bg-[#00288E] hover:bg-[#001859] w-full text-lg py-6 rounded-xl shadow-lg shadow-blue-900/20">
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}
