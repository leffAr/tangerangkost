'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function OwnerBookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['owner-bookings'],
    queryFn: async () => {
      const { data } = await api.get('/owner/bookings');
      return data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/owner/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Status pesanan berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
    },
    onError: () => {
      toast.error('Gagal memperbarui status pesanan');
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manajemen Pesanan</h1>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {bookings?.map((b: any) => (
            <Card key={b.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={b.status === 'PENDING' ? 'secondary' : 'default'} className="bg-yellow-100 text-yellow-800">
                      {b.status}
                    </Badge>
                    <span className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <h3 className="font-bold text-lg">{b.room.name} - {b.room.kos.name}</h3>
                  <p className="text-gray-600 text-sm mb-1">Penyewa: {b.user.name} ({b.user.email})</p>
                  <p className="font-semibold text-[#00288E]">Rp {Number(b.totalPrice).toLocaleString('id-ID')} untuk {b.durationMonths} bulan</p>
                </div>
                
                {b.status === 'PENDING' && (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                      onClick={() => statusMutation.mutate({ id: b.id, status: 'APPROVED' })}
                      disabled={statusMutation.isPending}
                    >
                      Setujui
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 w-full sm:w-auto"
                      onClick={() => statusMutation.mutate({ id: b.id, status: 'REJECTED' })}
                      disabled={statusMutation.isPending}
                    >
                      Tolak
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {(!bookings || bookings.length === 0) && (
            <p className="text-gray-500">Belum ada pesanan yang masuk.</p>
          )}
        </div>
      )}
    </div>
  );
}
