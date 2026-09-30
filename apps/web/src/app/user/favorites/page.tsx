'use client';

import { useQuery } from '@tanstack/react-query';
import { getImageUrl } from '@/lib/image';

import { api } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Heart, ArrowLeft } from 'lucide-react';
import { FavoriteButton } from '@/components/kos/FavoriteButton';
 // Note: if hook doesn't exist, I will use nookies
import { parseCookies } from 'nookies';

export default function UserFavoritesPage() {
  const cookies = parseCookies();
  const isLoggedIn = !!cookies.accessToken;

  const { data: koses, isLoading } = useQuery({
    queryKey: ['favorites-list'],
    queryFn: async () => {
      const { data } = await api.get('/users/favorites');
      return data;
    },
    enabled: isLoggedIn,
  });

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Heart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Silakan Masuk</h2>
        <p className="text-gray-500 mb-6">Anda harus login terlebih dahulu untuk melihat Kos Tersimpan Anda.</p>
        <Link href="/login" className="bg-[#00288E] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#001859]">
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/user" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Dashboard
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Kos Tersimpan
        </h1>
        <p className="text-gray-500">Daftar kos yang telah Anda simpan sebagai favorit.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : koses?.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada kos tersimpan</h3>
          <p className="text-gray-500 mb-6">Mulai jelajahi kos impian Anda dan simpan ke daftar favorit.</p>
          <Link href="/search" className="bg-[#00288E] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#001859]">
            Cari Kos Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {koses?.map((kos: any) => (
            <Link key={kos.id} href={`/kos/${kos.slug}`} className="group block">
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white hover:-translate-y-1 h-full relative">
                <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                  {kos.kosImages?.[0] ? (
                    <img src={getImageUrl(kos.kosImages[0].url)} alt={kos.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-300 to-indigo-200"></div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#00288E] uppercase">
                    {kos.genderType}
                  </div>
                  <FavoriteButton kosId={kos.id} className="absolute bottom-3 right-3 z-20 hover:scale-110" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#00288E] transition-colors line-clamp-1">{kos.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    <span className="truncate">{kos.village}, {kos.district}</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Mulai dari</p>
                      <p className="font-extrabold text-[#00288E] text-lg">Rp {Number(kos.priceFrom).toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-500">/ bln</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
