'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, CheckCircle2, X, Star, User, Info, MessageSquare, Sparkles, Snowflake, BedDouble, Bath, Server, Monitor, Search } from 'lucide-react';
import { use, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { parseCookies } from 'nookies';
import Link from 'next/link';

export default function KosDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cookies = parseCookies();
  const isLoggedIn = !!cookies.accessToken;

  const { data: kos, isLoading } = useQuery({
    queryKey: ['kos', resolvedParams.slug],
    queryFn: async () => {
      const { data } = await api.get(`/kos/${resolvedParams.slug}`);
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ['kos-reviews', kos?.id],
    queryFn: async () => {
      if (!kos?.id) return [];
      const { data } = await api.get(`/reviews/${kos.id}`);
      return data;
    },
    enabled: !!kos?.id
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const reviewMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/reviews/${kos.id}`, { rating, comment });
    },
    onSuccess: () => {
      toast.success('Ulasan berhasil ditambahkan!');
      setComment('');
      setRating(5);
    },
    onError: () => {
      toast.error('Gagal menambahkan ulasan. Pastikan Anda sudah login.');
    }
  });

  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!kos) return <div className="max-w-7xl mx-auto p-8 text-center text-gray-500 py-20">Kos tidak ditemukan</div>;

  const mainImage = kos.kosImages?.[0]?.url;
  const otherImages = kos.kosImages?.slice(1, 3) || [];
  const allImages = kos.kosImages || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">

      {/* Lightbox */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div className="absolute top-6 right-6 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-6 h-6 text-white" />
          </div>
          <img 
            src={`https://tangerangkost.onrender.com${activeImage}`} 
            alt="Full screen preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Header Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-blue-100 text-[#00288E] text-xs font-bold rounded-full uppercase tracking-wider">
            {kos.genderType}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {kos.kosType}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">{kos.name}</h1>
        <div className="flex items-center text-gray-500 font-medium text-sm md:text-base">
          <span className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
            4.8 <span className="text-gray-400 ml-1 underline decoration-dotted">({reviews?.length || 0} Ulasan)</span>
          </span>
          <span className="mx-3">•</span>
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" /> {kos.village}, {kos.district}
          </span>
        </div>
      </div>

      {/* Modern Gallery Section */}
      {/* Desktop Image Gallery */}
        <div className="hidden md:grid grid-cols-4 gap-2 h-[450px] rounded-3xl overflow-hidden mb-12 shadow-lg border border-gray-100 relative">
          {mainImage ? (
            <div 
              className="col-span-3 h-full relative group cursor-pointer overflow-hidden bg-gray-100"
              onClick={() => setActiveImage(mainImage)}
            >
              <img src={`https://tangerangkost.onrender.com${mainImage}`} alt="Foto Utama" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg transition-opacity flex items-center gap-2">
                  <Search className="w-4 h-4" /> Perbesar HD
                </span>
              </div>
            </div>
          ) : (
            <div className="col-span-4 h-full bg-gray-200 flex items-center justify-center text-gray-400">Tidak ada foto</div>
          )}
          
          {mainImage && (
            <div className="flex flex-col gap-2 h-full">
              {otherImages.map((img: any, idx: number) => (
                <div 
                  key={img.id} 
                  className="h-1/2 relative group cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => setActiveImage(img.url)}
                >
                  <img src={`https://tangerangkost.onrender.com${img.url}`} alt={`Foto ${idx+2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              ))}
              {otherImages.length < 2 && (
                <div className="h-1/2 bg-gray-100 flex items-center justify-center border border-gray-200">
                  <span className="text-sm text-gray-400">Belum ada foto lain</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Image Gallery (Swipeable) */}
        <div className="md:hidden flex gap-2 h-[250px] overflow-x-auto snap-x snap-mandatory mb-8 rounded-2xl shadow-sm" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {allImages.length > 0 ? (
            allImages.map((img: any, idx: number) => (
              <div 
                key={img.id} 
                className="flex-none w-[85%] h-full snap-center relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                onClick={() => setActiveImage(img.url)}
              >
                <img src={`https://tangerangkost.onrender.com${img.url}`} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-medium">
                  {idx + 1} / {allImages.length}
                </div>
              </div>
            ))
          ) : (
            <div className="flex-none w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">Tidak ada foto</div>
          )}
        </div>
        
        {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Quick Info & Tags */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-[#00288E] hover:bg-[#001859] px-3 py-1 rounded-md text-sm font-bold shadow-sm">{kos.genderType}</Badge>
            {kos.isVerified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-bold flex items-center shadow-sm">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Terverifikasi
              </Badge>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Description */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900">
              <Info className="w-5 h-5 mr-2 text-[#00288E]" /> Informasi Kos
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{kos.description}</p>
          </section>

          <hr className="border-gray-100" />

          {/* Location / Google Maps */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900">
              <MapPin className="w-5 h-5 mr-2 text-[#00288E]" /> Alamat & Lokasi
            </h2>
            <div className="mb-4 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="font-semibold mb-1">Alamat Lengkap:</p>
              <p>{kos.address}</p>
              <p className="text-sm text-gray-500 mt-1">{kos.village}, {kos.district}, {kos.regency}, {kos.province}</p>
            </div>
            
            {kos.latitude && kos.longitude && (
              <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${kos.latitude},${kos.longitude}&hl=id&z=15&output=embed`}
                ></iframe>
              </div>
            )}
          </section>
          
          <hr className="border-gray-100" />

          {/* Facilities */}
          <section>
            <h2 className="text-xl font-bold mb-5 flex items-center text-gray-900">
              <Sparkles className="w-5 h-5 mr-2 text-[#00288E]" /> Fasilitas Kos
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {kos.facilities?.map((f: any) => {
                const name = f.facility.name.toLowerCase();
                let Icon = CheckCircle2;
                if (name.includes('ac') || name.includes('kipas')) Icon = Snowflake;
                else if (name.includes('kasur') || name.includes('springbed') || name.includes('bed')) Icon = BedDouble;
                else if (name.includes('km') || name.includes('mandi') || name.includes('air') || name.includes('kloset')) Icon = Bath; 
                else if (name.includes('lemari') || name.includes('rak')) Icon = Server;
                else if (name.includes('meja') || name.includes('kursi')) Icon = Monitor;
                
                return (
                  <div key={f.facility.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100/80 hover:bg-gray-200 transition-colors px-3.5 py-2 rounded-lg border border-gray-200/60 font-medium">
                    <Icon className="w-4 h-4 text-[#00288E]" />
                    <span>{f.facility.name}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Rooms */}
          <section>
            <h2 className="text-xl font-bold mb-5 text-gray-900">Pilih Tipe Kamar</h2>
            <div className="space-y-4">
              {kos.rooms?.map((room: any) => (
                <Card key={room.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                  <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{room.name}</h3>
                      <div className="inline-flex items-center mt-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600">
                        Sisa {room.stock} kamar
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end w-full sm:w-auto">
                      <p className="text-xs text-gray-500 mb-0.5">Harga Sewa</p>
                      <p className="font-extrabold text-[#00288E] text-2xl">Rp {Number(room.price).toLocaleString('id-ID')}</p>
                      <p className="text-sm text-gray-400 mb-4">per bulan</p>
                      <Button 
                        className="bg-[#25D366] hover:bg-[#1DA851] w-full sm:w-auto px-8 rounded-xl font-semibold shadow-md text-white"
                        onClick={() => {
                          const phone = kos.owner?.user?.phone || '';
                          const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                          const message = encodeURIComponent(`Halo Bapak/Ibu Pemilik Kos,\n\nSaya melihat info properti *Kos ${kos.name}* melalui platform *TangerangKost*.\n\nSaya sangat tertarik dengan kamar tipe *${room.name}* (Harga: Rp ${Number(room.price).toLocaleString('id-ID')}/bulan).\n\nApakah kamar tipe ini masih tersedia? Jika iya, bolehkah saya meminta info lebih detail atau mengatur waktu untuk survei lokasi?\n\nTerima kasih banyak sebelumnya! 🙏`);
                          window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                        }}
                      >
                        Hubungi via WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* REVIEWS SECTION */}
          <section className="pt-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-900">
              <MessageSquare className="w-6 h-6 mr-3 text-[#00288E]" /> Ulasan Penghuni
            </h2>
            
            <Card className="mb-8 border-0 shadow-md rounded-2xl bg-gray-50 overflow-hidden">
              <CardContent className="p-6">
                {!isMounted ? (
                  <div className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
                ) : !isLoggedIn ? (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 mb-2">Ingin membagikan pengalaman Anda?</h3>
                    <p className="text-gray-500 mb-4 text-sm">Silakan masuk ke akun Anda terlebih dahulu untuk memberikan ulasan dan rating pada kost ini.</p>
                    <Link href="/login">
                      <Button className="bg-[#00288E] hover:bg-[#001859] text-white rounded-xl">Masuk ke Akun</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 mb-4">Bagikan pengalaman Anda</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Berapa bintang untuk kos ini?</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(num => (
                        <button key={num} onClick={() => setRating(num)} className={`text-2xl transition-colors ${rating >= num ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ceritakan pengalaman Anda</label>
                    <textarea 
                      rows={3} 
                      value={comment} onChange={(e) => setComment(e.target.value)}
                      className="border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                      placeholder="Apakah kamarnya bersih? Bagaimana dengan fasilitasnya?"
                    />
                  </div>
                  <Button 
                    className="bg-[#00288E] hover:bg-[#001859] rounded-xl font-semibold"
                    onClick={() => reviewMutation.mutate()}
                    disabled={reviewMutation.isPending || !comment}
                  >
                    Kirim Ulasan Anda
                  </Button>
                </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              {reviews?.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 font-medium">Belum ada ulasan.</p>
                  <p className="text-sm text-gray-400">Jadilah yang pertama mengulas kos ini!</p>
                </div>
              ) : (
                reviews?.map((r: any) => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {r.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{r.user.name}</p>
                        <div className="flex items-center text-xs">
                          <span className="text-yellow-500 tracking-widest mr-2">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                          <span className="text-gray-400">{new Date(r.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month:'long', year:'numeric'})}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed ml-13 pl-1">{r.comment}</p>
                    
                    {r.reply && (
                      <div className="mt-4 ml-13 p-4 bg-blue-50/50 rounded-xl border border-blue-100 relative">
                        <div className="absolute -left-2 top-4 w-4 h-4 bg-blue-50/50 border-l border-b border-blue-100 transform rotate-45"></div>
                        <p className="text-sm font-bold text-[#00288E] mb-1 flex items-center"><User className="w-4 h-4 mr-1"/> Respon Pemilik Kos:</p>
                        <p className="text-gray-700 text-sm leading-relaxed">{r.reply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* Sticky Sidebar */}
        <div className="relative">
          <div className="sticky top-24">
            <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden bg-white">
              <div className="h-2 w-full bg-gradient-to-r from-[#00288E] to-blue-400"></div>
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Mulai dari</p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    Rp {Number(kos.priceFrom).toLocaleString('id-ID')}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">per bulan</p>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700 font-bold text-xl">
                      {kos.owner?.user?.name?.charAt(0) || <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dikelola oleh</p>
                      <p className="font-bold text-gray-900">{kos.owner?.user?.name}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-6 rounded-xl shadow-lg shadow-green-500/20 transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    onClick={() => {
                      const phone = kos.owner?.user?.phone || '';
                      if (!phone) {
                        toast.error('Pemilik belum melengkapi nomor WhatsApp');
                        return;
                      }
                      const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
                      const message = encodeURIComponent(`Halo Bapak/Ibu Pemilik Kos,\n\nSaya melihat info properti *Kos ${kos.name}* melalui platform *TangerangKost*.\n\nSaya tertarik untuk menyewa dan ingin menanyakan beberapa hal:\n1. Apakah saat ini masih ada kamar yang kosong?\n2. Jika ada, bolehkah saya meminta info lebih detail atau mengatur waktu untuk survei lokasi?\n\nTerima kasih banyak sebelumnya! 🙏`);
                      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                    }}
                  >
                    <Phone className="w-5 h-5" /> Hubungi Pemilik via WA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
