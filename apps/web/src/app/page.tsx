'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Star, Sparkles, Building, ArrowRight, Navigation, MessageCircle, CheckCircle, Smartphone, UserCheck, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}



function PopularAreasGrid() {
  const { data: areas, isLoading } = useQuery({
    queryKey: ['popular-areas'],
    queryFn: async () => {
      const { data } = await api.get('/kos/popular-areas');
      return data;
    },
  });

  const defaultAreas = [
    { name: 'Kost Kelapa Dua', imageUrl: 'https://picsum.photos/seed/kelapadua/600/400' },
    { name: 'Kost Balaraja', imageUrl: 'https://picsum.photos/seed/balaraja/600/400' },
    { name: 'Kost Cikupa', imageUrl: 'https://picsum.photos/seed/cikupa/600/400' },
    { name: 'Kost Curug', imageUrl: 'https://picsum.photos/seed/curug/600/400' },
    { name: 'Kost Pasar Kemis', imageUrl: 'https://picsum.photos/seed/pasarkemis/600/400' },
    { name: 'Kost Pagedangan', imageUrl: 'https://picsum.photos/seed/pagedangan/600/400' },
    { name: 'Kost Cisauk', imageUrl: 'https://picsum.photos/seed/cisauk/600/400' },
  ];

  const displayAreas = areas && areas.length > 0 ? areas : defaultAreas;

  if (isLoading) return <div className="col-span-2 md:col-span-4 py-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <>
      {displayAreas.map((area: any, idx: number) => (
        <Link key={idx} href={`/search?location=${encodeURIComponent(area.name.replace('Kost ', '').replace('Kos ', ''))}`} className="group relative h-40 md:h-56 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          <img src={area.imageUrl.startsWith('/') ? `http://192.168.137.1:3000${area.imageUrl}` : area.imageUrl} alt={area.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white font-bold text-lg md:text-xl text-center px-4 drop-shadow-md">{area.name}</h3>
          </div>
        </Link>
      ))}
    </>
  );
}

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState('');

  const { data: contactSettings } = useQuery({
    queryKey: ['contact-settings'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/contact');
        return res.data;
      } catch (error) {
        return null;
      }
    },
  });

  const { data: heroSlidesData } = useQuery({
    queryKey: ['hero-slides'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings/hero');
        return res.data.slides || [];
      } catch (e) {
        return [];
      }
    }
  });
  
  const BACKGROUND_IMAGES: string[] = heroSlidesData && heroSlidesData.length > 0 
    ? heroSlidesData 
    : [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1e50bb3b37?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop"
      ];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['koses-home'],
    queryFn: async () => {
      const res = await api.get('/kos');
      return res.data || [];
    },
  });

  const featuredKoses = data?.slice(0, 4) || [];
  // Extract unique districts from all available koses
  const dynamicLocations = Array.from(new Set(data?.map((k: any) => k.district) || [])).filter(Boolean) as string[];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [isDetecting, setIsDetecting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const ALL_KECAMATAN_TANGERANG = [
    "Balaraja", "Cikupa", "Cisauk", "Cisoka", "Curug", "Gunung Kaler", 
    "Jambe", "Jayanti", "Kelapa Dua", "Kemiri", "Kosambi", "Kresek", 
    "Kronjo", "Legok", "Mauk", "Mekar Baru", "Pagedangan", "Pakuhaji", 
    "Panongan", "Pasar Kemis", "Rajeg", "Sepatan", "Sepatan Timur", 
    "Sindang Jaya", "Solear", "Sukamulya", "Teluknaga", "Tigaraksa"
  ].sort();

  const handleNearestSearch = () => {
    setIsDetecting(true);
    
    const simulateLocation = () => {
      setIsDetecting(false);
      alert("Sistem mengaktifkan lokasi simulasi (Pusat Tangerang) karena akses GPS dilarang oleh browser pada jaringan lokal.");
      router.push(`/search?lat=-6.178306&lng=106.631889`);
    };

    const fallbackToIP = async () => {
      try {
        const res = await fetch('http://ip-api.com/json/');
        const data = await res.json();
        if (data.lat && data.lon) {
          setIsDetecting(false);
          router.push(`/search?lat=${data.lat}&lng=${data.lon}`);
        } else {
          simulateLocation();
        }
      } catch (e) {
        simulateLocation();
      }
    };

    if (!navigator.geolocation) {
      fallbackToIP();
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetecting(false);
        router.push(`/search?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
      },
      (error) => {
        fallbackToIP();
      },
      { timeout: 3000, enableHighAccuracy: false }
    );
  };

  const handleSearch = () => {
    if (location.trim()) {
      router.push(`/search?location=${encodeURIComponent(location.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative text-white pt-28 pb-32 px-4 min-h-[70vh] flex flex-col justify-center z-50">
        {/* Background Slider */}
        {BACKGROUND_IMAGES.map((img: string, index: number) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img.startsWith('http') ? img : `http://192.168.137.1:3000${img}`} alt={`Slide ${index}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#00288E]/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#001859] via-transparent to-[#00288E]/50"></div>
          </div>
        ))}
        
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          <div className="absolute top-48 right-0 w-[500px] h-[500px] rounded-full bg-blue-300 blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center gap-8 z-10">
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mt-6">
            Temukan Hunian <br className="hidden md:block"/> Ideal Anda.
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-light leading-relaxed">
            Eksplorasi ribuan kost murah, eksklusif, dan strategis di seluruh Kabupaten Tangerang untuk mahasiswa dan profesional.
          </p>
          
          <div className="w-full max-w-3xl mt-8 relative" ref={suggestionRef}>
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 flex flex-col md:flex-row items-center shadow-2xl shadow-blue-900/50 border border-white/40 gap-3 relative z-20">
              <div className="flex-1 flex items-center bg-gray-100/80 rounded-xl px-4 py-3 w-full border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all relative">
                <MapPin className="text-gray-400 w-5 h-5 mr-3" />
                <input 
                  type="text" 
                  placeholder="Lokasi kost, misal: Kelapa Dua..." 
                  className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full md:w-auto bg-[#00288E] hover:bg-[#001859] text-white px-8 py-6 text-lg rounded-xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Cari Kos <Search className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-10 text-left animate-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between text-sm font-semibold text-gray-500">
                    <div className="flex items-center truncate mr-2">
                      <Navigation className="w-4 h-4 mr-2 shrink-0" /> <span className="hidden sm:inline">Area Kabupaten Tangerang</span><span className="sm:hidden">Tangerang</span>
                    </div>
                    <button 
                      onClick={handleNearestSearch}
                      disabled={isDetecting}
                      className="flex items-center text-[#00288E] hover:text-[#001859] font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                    >
                    <Navigation className={`w-4 h-4 mr-1.5 ${isDetecting ? 'animate-spin' : ''}`} /> 
                    {isDetecting ? 'Mencari...' : 'Cari Kost Terdekat'}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                  {ALL_KECAMATAN_TANGERANG.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowSuggestions(false);
                        router.push(`/search?location=${encodeURIComponent(loc)}`);
                      }}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-[#00288E] text-gray-700 font-medium transition-colors flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-3 opacity-40" /> Kecamatan {loc}
                    </button>
                  ))}
                  {ALL_KECAMATAN_TANGERANG.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).length === 0 && (
                    <div className="col-span-2 px-4 py-3 text-gray-500 text-sm">Kecamatan tidak ditemukan di Kabupaten Tangerang.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
            {/* Quick Stats */}
          <div className="flex gap-3 sm:gap-8 mt-12 text-center text-blue-50">
            <div>
              <p className="text-2xl sm:text-3xl font-bold"><AnimatedCounter end={1200} suffix="+" duration={2000} /></p>
              <p className="text-xs sm:text-sm font-light opacity-80">Kost Tersedia</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/20"></div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold"><AnimatedCounter end={5000} suffix="+" duration={2500} /></p>
              <p className="text-xs sm:text-sm font-light opacity-80">Penyewa Aktif</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/20"></div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold"><AnimatedCounter end={100} suffix="%" duration={3000} /></p>
              <p className="text-xs sm:text-sm font-light opacity-80">Terverifikasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 bg-gray-50 flex-1 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Rekomendasi Terbaik</h2>
              <p className="text-gray-500 text-lg">Pilihan kost terpopuler yang paling banyak dicari bulan ini.</p>
            </div>
            <Link href="/search" className="hidden md:flex items-center text-[#00288E] font-semibold hover:gap-2 transition-all group">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredKoses?.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              Belum ada kost terdaftar saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredKoses?.map((kos: any) => (
                <Link key={kos.id} href={`/kos/${kos.slug}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1 h-full">
                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                      {kos.kosImages?.[0] ? (
                        <img src={`http://192.168.137.1:3000${kos.kosImages[0].url}`} alt={kos.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-indigo-200 group-hover:scale-105 transition-transform duration-500"></div>
                      )}
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#00288E] shadow-sm uppercase">
                        {kos.genderType}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[#00288E] transition-colors">{kos.name}</h3>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md text-yellow-600 text-xs font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="ml-1">4.8</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mb-5 line-clamp-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" /> {kos.village}, {kos.district}
                      </p>
                      
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Mulai dari</p>
                          <p className="font-extrabold text-[#00288E] text-xl">Rp {Number(kos.priceFrom).toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-400">/ bln</span></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="flex justify-center mt-12 md:hidden">
            <Link href="/search" className="w-full">
              <Button variant="outline" className="w-full border-2 border-[#00288E] text-[#00288E] px-8 py-6 rounded-xl hover:bg-blue-50 font-bold">
                Lihat Semua Kost
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Area Kost Terpopuler */}
      <section className="py-20 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">Area Kost Terpopuler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <PopularAreasGrid />
            <Link href="/search" className="group flex items-center justify-center h-40 md:h-56 rounded-xl border-2 border-gray-200 hover:border-[#00288E] bg-white transition-all shadow-sm">
              <span className="font-bold text-gray-900 group-hover:text-[#00288E] group-hover:underline underline-offset-4 decoration-2 flex items-center">
                Lihat semua <ArrowRight className="w-5 h-5 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section / Mengapa TangerangKost */}
      <section className="py-24 px-4 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00288E] to-blue-500">TangerangKost?</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Platform pencarian kost terbaik yang menghubungkan Anda langsung dengan pemilik kost di seluruh wilayah Kabupaten Tangerang.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-0">
            {/* Card 1 */}
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 text-[#00288E] rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-all">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00288E] transition-colors">Pilihan Terlengkap</h3>
                <p className="text-gray-500 leading-relaxed text-base">
                  Dari kos standar hingga eksklusif, temukan ribuan pilihan kamar kost yang sesuai dengan anggaran dan kebutuhan Anda di wilayah Tangerang.
                </p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-all">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">Pencarian Pintar & Akurat</h3>
                <p className="text-gray-500 leading-relaxed text-base">
                  Gunakan filter cerdas kami untuk menemukan kost berdasarkan area, harga, fasilitas unggulan, maupun tipe kost (Putra/Putri/Campur).
                </p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md transition-all">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors">Tanpa Perantara</h3>
                <p className="text-gray-500 leading-relaxed text-base">
                  Nikmati kemudahan berdiskusi dan negosiasi secara langsung dengan pemilik kost melalui WhatsApp tanpa adanya biaya perantara tambahan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Pemesanan Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Cara Mudah Pesan Kost</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Hanya butuh 4 langkah mudah untuk mendapatkan kamar kost impian Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -z-0 -translate-y-1/2"></div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white border-4 border-blue-100 text-[#00288E] rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">1. Cari & Filter</h4>
              <p className="text-sm text-gray-500">Temukan kos yang sesuai dengan lokasi dan anggaran Anda.</p>
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white border-4 border-blue-100 text-[#00288E] rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">2. Pilih Kamar</h4>
              <p className="text-sm text-gray-500">Lihat foto, fasilitas, dan detail tipe kamar yang tersedia.</p>
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-white border-4 border-blue-100 text-[#00288E] rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-sm">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">3. Hubungi Owner</h4>
              <p className="text-sm text-gray-500">Klik tombol WhatsApp untuk langsung bertanya pada pemilik.</p>
            </div>
            
            <div className="text-center relative z-10">
              <div className="w-16 h-16 bg-[#00288E] border-4 border-blue-100 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-md shadow-blue-500/20">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">4. Deal & Pindah</h4>
              <p className="text-sm text-gray-500">Selesaikan pembayaran secara langsung dan tempati kos baru Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-500 text-lg">Punya pertanyaan? Kami punya jawabannya.</p>
          </div>
          
          <div className="space-y-6">
            <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md open:shadow-lg open:border-[#00288E]/20 transition-all cursor-pointer overflow-hidden">
              <summary className="font-bold text-gray-900 text-lg flex justify-between items-center p-6 outline-none bg-gray-50 group-open:bg-gradient-to-r group-open:from-[#00288E] group-open:to-blue-600 group-open:text-white transition-all">
                Apakah ada biaya admin dari TangerangKost?
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:text-white group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 text-gray-600 leading-relaxed bg-white text-base">
                Tidak ada sama sekali. Platform TangerangKost <strong>100% gratis</strong> digunakan oleh penyewa. Seluruh transaksi dan pembayaran dilakukan langsung antara Anda dengan pemilik kost tanpa perantara.
              </div>
            </details>
            
            <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md open:shadow-lg open:border-[#00288E]/20 transition-all cursor-pointer overflow-hidden">
              <summary className="font-bold text-gray-900 text-lg flex justify-between items-center p-6 outline-none bg-gray-50 group-open:bg-gradient-to-r group-open:from-[#00288E] group-open:to-blue-600 group-open:text-white transition-all">
                Bagaimana cara membayar sewa kost?
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:text-white group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 text-gray-600 leading-relaxed bg-white text-base">
                Karena kami tidak memungut biaya, proses pembayaran (baik DP maupun lunas) dilakukan di luar platform. Silakan diskusikan metode pembayaran yang disepakati langsung dengan pemilik kost melalui WhatsApp.
              </div>
            </details>
            
            <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md open:shadow-lg open:border-[#00288E]/20 transition-all cursor-pointer overflow-hidden">
              <summary className="font-bold text-gray-900 text-lg flex justify-between items-center p-6 outline-none bg-gray-50 group-open:bg-gradient-to-r group-open:from-[#00288E] group-open:to-blue-600 group-open:text-white transition-all">
                Apakah semua kost di sini terverifikasi?
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:text-white group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 text-gray-600 leading-relaxed bg-white text-base">
                Tim admin kami secara ketat meninjau dan memverifikasi setiap properti kost yang didaftarkan demi menjaga keamanan serta kenyamanan calon penyewa. Kami berupaya memastikan kualitas dan keakuratan informasi yang ditampilkan.
              </div>
            </details>
            
            <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md open:shadow-lg open:border-[#00288E]/20 transition-all cursor-pointer overflow-hidden">
              <summary className="font-bold text-gray-900 text-lg flex justify-between items-center p-6 outline-none bg-gray-50 group-open:bg-gradient-to-r group-open:from-[#00288E] group-open:to-blue-600 group-open:text-white transition-all">
                Bagaimana jika kos yang saya tempati tidak sesuai foto?
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:text-white group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 text-gray-600 leading-relaxed bg-white text-base">
                Kami sangat menyarankan Anda untuk <strong>mengatur jadwal survei secara langsung</strong> (bertemu pemilik dan mengecek kamar fisik) sebelum mengirimkan pembayaran apapun (DP/Lunas). Jika Anda merasa ada indikasi penipuan dari oknum, abaikan permintaannya dan cari kost lain yang lebih terpercaya.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
        <footer className="bg-slate-950 text-slate-300 py-16 px-4 border-t-4 border-[#00288E] relative overflow-hidden">
          {/* Decorative background gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-[80px]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Brand Col */}
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-white mb-4">Tangerang<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Kost</span></h2>
                <p className="text-slate-400 leading-relaxed font-light">
                  Platform direktori kost nomor satu di Kabupaten Tangerang. Temukan hunian nyaman, aman, dan strategis dengan mudah hanya dalam genggaman.
                </p>
                <div className="flex gap-4 pt-4">
                  <a href={contactSettings?.instagram || "#"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                  <a href={contactSettings?.tiktok || "#"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                    </a>
                  <a href={`https://wa.me/${contactSettings?.whatsapp?.replace(/\D/g,'') || ''}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white hover:scale-110 transition-all shadow-lg text-slate-300">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Pintasan Cepat</h3>
                <ul className="space-y-3 font-medium text-slate-400">
                  <li><Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Beranda</Link></li>
                  <li><Link href="/search" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Cari Kos Terdekat</Link></li>
                  <li><Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Tentang Kami</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Hubungi Admin</Link></li>
                </ul>
              </div>

              {/* For Owners */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Untuk Pemilik Kos</h3>
                <ul className="space-y-3 font-medium text-slate-400">
                  <li><Link href="/register?role=OWNER" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Daftar Menjadi Mitra</Link></li>
                  <li><Link href="/login" className="hover:text-blue-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4"/> Login Owner Dashboard</Link></li>
                  <li><button onClick={() => setShowTermsModal(true)} className="hover:text-blue-400 transition-colors flex items-center gap-2 outline-none"><ArrowRight className="w-4 h-4"/> Syarat & Ketentuan</button></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Kontak Kami</h3>
                <ul className="space-y-4 font-medium text-slate-400">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{contactSettings?.address || 'Jl. Raya Pemda Tigaraksa, Kabupaten Tangerang, Banten 15720'}</span>
                  </li>
                  <li className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366] shrink-0"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                      <a href={`https://wa.me/${(contactSettings?.whatsapp || '6281234567890').replace(/\D/g,'')}`}  target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors">{contactSettings?.whatsapp || '+62 812-3456-7890'}</a>
                    </li>
                    <li className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-blue-400 shrink-0" />
                      <a href={`mailto:${contactSettings?.email || 'halo@tangerangkost.com'}`} className="hover:text-blue-400 transition-colors">{contactSettings?.email || 'halo@tangerangkost.com'}</a>
                    </li>
                    
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-500 text-sm font-medium">
                &copy; {new Date().getFullYear()} TangerangKost. Seluruh hak cipta dilindungi.
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-white transition-colors">Syarat Penggunaan</a>
              </div>
            </div>
          </div>
        </footer>

      {/* Syarat & Ketentuan Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#00288E] text-white rounded-t-2xl">
              <h2 className="text-xl font-bold">Syarat & Ketentuan Pemilik Kos</h2>
              <button onClick={() => setShowTermsModal(false)} className="text-white hover:text-gray-200 bg-white/20 px-3 py-1 text-sm rounded-full transition-colors outline-none font-medium">Tutup</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5 text-gray-700">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">1. Tanggung Jawab Informasi</h3>
                <p className="leading-relaxed">Pemilik wajib memberikan informasi, foto, dan harga kost yang sesuai dengan kondisi sebenarnya. Penipuan informasi akan mengakibatkan akun diblokir permanen dari sistem TangerangKost.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">2. Transaksi & Pembayaran</h3>
                <p className="leading-relaxed">TangerangKost hanya bertindak sebagai platform direktori/perantara informasi. Seluruh transaksi pembayaran (DP, Lunas, Bulanan) dilakukan secara langsung antara penyewa dan pemilik kost. TangerangKost tidak bertanggung jawab atas kerugian finansial yang terjadi.</p>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">3. Kebersihan & Keamanan</h3>
                <p className="leading-relaxed">Pemilik bertanggung jawab penuh untuk menjaga keamanan properti serta kenyamanan lingkungan kost. Pemilik berhak membuat peraturan internal (jam malam, tamu, larangan merokok, dll) yang harus disepakati oleh penyewa di awal.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 mt-2">4. Hak Akses & Penghapusan</h3>
                <p className="leading-relaxed">Tim admin TangerangKost berhak penuh untuk menghapus atau menyembunyikan iklan kost jika terdapat laporan penipuan beruntun, konten tidak pantas, atau kost yang sudah tidak beroperasi tanpa pemberitahuan sebelumnya.</p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-2xl">
              <button onClick={() => setShowTermsModal(false)} className="px-6 py-2.5 bg-[#00288E] text-white font-bold rounded-xl hover:bg-[#001859] transition-colors shadow-md outline-none">Saya Mengerti</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
