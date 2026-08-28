import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — About';

export default function Image() {
  return renderOgImage({ eyebrow: 'About', title: 'One roof for India’s idea-to-orbit ambition.' });
}
