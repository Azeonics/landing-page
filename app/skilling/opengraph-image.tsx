import { ogSize as size, ogContentType as contentType, renderOgImage } from '@/lib/og';

export { size, contentType };
export const alt = 'Azeonics — Skilling';

export default function Image() {
  return renderOgImage({ eyebrow: 'Skilling', title: 'From classroom to CubeSat — accessible space-tech training.' });
}
