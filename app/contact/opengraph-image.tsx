import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Contact';

export default function Image() {
  return renderOgImage({ eyebrow: 'Global Footprint', title: 'Built in India. Going global.' });
}
