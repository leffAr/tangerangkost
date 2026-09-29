'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SearchContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location') || '';
  const latParam = searchParams.get('lat') || '';
  const lngParam = searchParams.get('lng') || '';
  
  const [filters, setFilters] = useState({ 
    genderType: '', 
    priceMax: '', 
    location: locationParam,
    lat: latParam,
    lng: lngParam
  });

  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      location: locationParam,
      lat: latParam,
      lng: lngParam
    }));
  }, [locationParam, latParam, lngParam]);

  const { data: koses, isLoading } = useQuery({
    queryKey: ['koses', filters],
    queryFn: async () => {
      const { data } = await api.get('/kos', { params: filters });
      return data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
          <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter Pencarian
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi / Area</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Ketik lokasi..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Kos</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all cursor-pointer"
                  value={filters.genderType}
                  onChange={(e) => setFilters({ ...filters, genderType: e.target.value })}
                >
                  <option value="">Semua Tipe</option>
                  <option value="PUTRA">Kos Putra</option>
                  <option value="PUTRI">Kos Putri</option>
                  <option value="CAMPUR">Kos Campur</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Harga Maksimal (Bulan)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">Rp</span>
                </div>
                <input 
                  type="number" 
                  placeholder="Contoh: 2000000"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-12 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00288E]/20 focus:border-[#00288E] transition-all"
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Results */}
      <main className="flex-1 min-w-0">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hasil Pencarian</h1>
            <p className="text-gray-500 mt-2 text-lg">
              {koses ? `${koses.length} kos ditemukan` : 'Mencari kos...'}
              {filters.location && ` di area "${filters.location}"`}
              {!filters.location && filters.lat && filters.lng && ` di sekitar lokasi Anda (diurutkan dari yang terdekat)`}
            </p>
          </div>
          <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full font-medium">{koses?.length || 0} properti ditemukan</span>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {koses?.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-300"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <p className="font-semibold text-lg text-gray-700">Tidak ada kos yang cocok</p>
                <p className="text-sm mt-1">Coba kurangi filter atau ubah lokasi pencarian.</p>
              </div>
            )}
            {koses?.map((kos: any) => (
              <Link key={kos.id} href={`/kos/${kos.slug}`} className="group">
                <Card className="overflow-hidden h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                    {kos.kosImages?.[0] ? (
                      <img src={`https://tangerangkost.onrender.com${kos.kosImages[0].url}`} alt={kos.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-indigo-200 group-hover:scale-105 transition-transform duration-500"></div>
                    )}
                    <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#00288E] hover:bg-white shadow-sm border-0 font-bold">
                      {kos.genderType}
                      </Badge>
                      {(kos.availableRooms && kos.availableRooms > 0) ? (
                        <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white hover:bg-green-600 shadow-sm border-0 font-bold">
                          Sisa {kos.availableRooms} Kamar
                        </Badge>
                      ) : null}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[#00288E] transition-colors mb-1">{kos.name}</h3>
                    <div className="flex flex-col gap-1 mb-5">
                      <p className="text-gray-500 text-sm line-clamp-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="truncate">{kos.village}, {kos.district}</span>
                      </p>
                      {kos.distance && kos.distance !== 999999 && (
                        <p className="text-[#00288E] text-xs font-bold flex items-center bg-blue-50 w-fit px-2 py-1 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 3L14.5 21a.55.55 0 0 1-1 0L10 14l-7-3.5a.55.55 0 0 1 0-1L21 3"/></svg>
                          Jarak: {kos.distance < 1 ? `${Math.round(kos.distance * 1000)} m` : `${kos.distance.toFixed(1)} km`}
                        </p>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Mulai dari</p>
                        <p className="font-extrabold text-[#00288E] text-lg">
                          Rp {Number(kos.priceFrom).toLocaleString('id-ID')} <span className="text-xs font-medium text-gray-400">/ bln</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat pencarian...</div>}>
      <SearchContent />
    </Suspense>
  );
}
