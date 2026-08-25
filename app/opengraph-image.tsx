import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — From Earth Intelligence to Space Excellence. Under one roof.';

export default function Image() {
  return renderOgImage({ eyebrow: 'Idea 2 Orbit', title: 'From Earth Intelligence to Space Excellence. Under one roof.' });
}
