import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Press & Media';

export default function Image() {
  return renderOgImage({ eyebrow: 'Press & Media', title: 'For the storytellers.' });
}
