import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TangerangKost - Cari Kos Lebih Mudah',
    short_name: 'TangerangKost',
    description: 'Aplikasi pencarian dan manajemen kos terbaik di wilayah Tangerang Raya.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00288E',
    icons: [
      {
        src: '/icon.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
      {
        src: '/apple-icon.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      },
    ],
  };
}
