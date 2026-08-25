import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Capabilities';

export default function Image() {
  return renderOgImage({ eyebrow: 'Capabilities', title: 'Six capabilities, one integrated floor.' });
}
