import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Catalog';

export default function Image() {
  return renderOgImage({ eyebrow: 'Catalog', title: 'Space-ready hardware, available now.' });
}
