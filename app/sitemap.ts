import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://azeonics.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/capabilities', '/skilling', '/catalog', '/contact'];
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8
  }));
}
