import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Careers';

export default function Image() {
  return renderOgImage({ eyebrow: 'Careers', title: 'Build India’s idea-to-orbit future.' });
}
