import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Azeonics — Idea 2 Orbit Innovation Hub',
    short_name: 'Azeonics',
    description:
      'Integrated precision manufacturing, testing and innovation facility for drones, satellites and aerospace systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020B1E',
    theme_color: '#020B1E',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' }
    ]
  };
}
