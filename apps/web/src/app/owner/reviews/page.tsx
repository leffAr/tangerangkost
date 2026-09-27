'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OwnerReviewsPage() {
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['owner-reviews'],
    queryFn: async () => {
      const { data } = await api.get('/owner/reviews');
      return data;
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      await api.patch(`/owner/reviews/${id}/reply`, { reply });
    },
    onSuccess: () => {
      toast.success('Balasan berhasil dikirim!');
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ['owner-reviews'] });
    },
    onError: () => {
      toast.error('Gagal mengirim balasan');
    }
  });

  return (
    <div>
      <div className="mb-6">
        <Link href="/owner" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00288E] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Manajemen Ulasan</h1>
      </div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {reviews?.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{r.kos.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold">{r.user.name}</span>
                      <span className="text-yellow-500">★ {r.rating}</span>
                      <span className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{r.comment}</p>

                {r.reply ? (
                  <div className="p-4 bg-gray-50 border-l-4 border-[#00288E] rounded">
                    <p className="text-sm font-bold text-[#00288E] mb-1">Balasan Anda:</p>
                    <p className="text-gray-700 text-sm">{r.reply}</p>
                  </div>
                ) : (
                  <div>
                    {replyingTo === r.id ? (
                      <div className="mt-4 space-y-2">
                        <textarea
                          rows={3}
                          value={replyText[r.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [r.id]: e.target.value }))}
                          className="w-full border rounded p-2 text-sm"
                          placeholder="Tulis balasan Anda..."
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="bg-[#00288E]"
                            onClick={() => replyMutation.mutate({ id: r.id, reply: replyText[r.id] })}
                            disabled={!replyText[r.id] || replyMutation.isPending}
                          >
                            Kirim
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>Batal</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setReplyingTo(r.id)}>
                        Balas Ulasan
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {(!reviews || reviews.length === 0) && (
            <p className="text-gray-500">Belum ada ulasan yang masuk untuk kos Anda.</p>
          )}
        </div>
      )}
    </div>
  );
}
