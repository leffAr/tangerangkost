'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export function FavoriteButton({ kosId, className = "" }: { kosId: string, className?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => setIsMounted(true), []);

  const cookies = parseCookies();
  const isLoggedIn = !!cookies.accessToken;

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await api.get('/users/favorites');
      return data;
    },
    enabled: isMounted && isLoggedIn,
  });

  const isFavorited = favorites.some((fav: any) => fav.id === kosId);

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        throw new Error('UNAUTHORIZED');
      }
      const { data } = await api.post(`/users/favorites/${kosId}`);
      return data;
    },
    onMutate: async () => {
      if (!isLoggedIn) {
        toast.error('Silakan masuk ke akun Anda terlebih dahulu');
        router.push('/login');
        throw new Error('UNAUTHORIZED');
      }
      
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previousFavorites = queryClient.getQueryData(['favorites']) as any[];
      
      if (isFavorited) {
        queryClient.setQueryData(['favorites'], previousFavorites.filter(f => f.id !== kosId));
      } else {
        queryClient.setQueryData(['favorites'], [...(previousFavorites || []), { id: kosId }]);
      }
      
      return { previousFavorites };
    },
    onError: (err, newTodo, context) => {
      if (err.message !== 'UNAUTHORIZED') {
        toast.error('Gagal menyimpan kos');
        queryClient.setQueryData(['favorites'], context?.previousFavorites);
      }
    },
    onSettled: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
  });

  if (!isMounted) return <div className="w-9 h-9"></div>;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMutation.mutate();
      }}
      className={`p-2 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center ${
        isFavorited ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white backdrop-blur-sm'
      } ${className}`}
      title={isFavorited ? 'Hapus dari Tersimpan' : 'Simpan Kos'}
    >
      <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
    </button>
  );
}
