import type { Metadata } from 'next';

type PageMetaArgs = { title: string; description: string; path: string };

export function pageMetadata({ title, description, path }: PageMetaArgs): Metadata {
  const fullTitle = `${title} | Azeonics`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'Azeonics',
      title: fullTitle,
      description,
      url: path,
      locale: 'en_IN'
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description
    }
  };
}
