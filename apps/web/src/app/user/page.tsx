'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

export default function UserBookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await api.get('/bookings/my-bookings');
      return data;
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold hidden md:block mb-2">Pesanan Saya</h1>
        <p className="text-gray-500">Pantau status pesanan kost Anda di sini.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#00288E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings?.map((b: any) => (
            <Card key={b.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={
                        b.status === 'APPROVED' ? 'default' : 
                        b.status === 'REJECTED' ? 'destructive' : 
                        b.status === 'PAID' ? 'outline' : 'secondary'
                      } className={
                        b.status === 'APPROVED' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        b.status === 'PAID' ? 'bg-[#00288E] text-white' :
                        b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''
                      }>
                        {b.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <Link href={`/kos/${b.room.kos.slug}`} className="hover:underline">
                      <h3 className="font-bold text-lg text-gray-900">{b.room.kos.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-1">Tipe Kamar: {b.room.name}</p>
                    <p className="font-semibold text-[#00288E]">Rp {Number(b.totalPrice).toLocaleString('id-ID')} untuk {b.durationMonths} bulan</p>
                  </div>
                  
                  {b.status === 'APPROVED' && (
                    <div className="bg-blue-50 p-4 rounded-lg w-full md:w-auto text-center border border-blue-100">
                      <p className="text-sm text-blue-800 font-medium mb-2">Pesanan Disetujui!</p>
                      <Link href={`/user/payment/${b.id}`} className="block bg-[#00288E] text-white px-4 py-2 rounded-md font-medium hover:bg-[#001859] transition-colors text-sm">
                        Lanjut Pembayaran
                      </Link>
                    </div>
                  )}
                  {b.status === 'PAID' && (
                    <div className="bg-green-50 p-4 rounded-lg w-full md:w-auto text-center border border-green-100">
                      <p className="text-sm text-green-800 font-medium mb-1">Pembayaran Lunas</p>
                      <p className="text-xs text-green-600">Terima kasih telah menyewa.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!bookings || bookings.length === 0) && (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium mb-4">Anda belum memiliki pesanan kost.</p>
              <Link href="/search" className="inline-flex items-center text-sm font-medium text-white bg-[#00288E] px-4 py-2 rounded-md hover:bg-[#001859] transition-colors">
                Cari Kost Sekarang
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
