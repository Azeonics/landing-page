import SiteChrome from '@/components/layout/SiteChrome';
import SkillingPrograms from '@/components/sections/SkillingPrograms';
import SkillingGallery from '@/components/sections/SkillingGallery';
import ManhaSpotlight from '@/components/sections/ManhaSpotlight';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Skilling',
  description:
    'From classroom to CubeSat — hands-on space-tech training built around the Manha nano-satellite kit. Tiered programs that take learners from satellite concepts to launch and data analysis.',
  path: '/skilling'
});

export default function SkillingPage() {
  return (
    <SiteChrome>
      <SkillingPrograms gallery={<SkillingGallery />} />
      <ManhaSpotlight />
    </SiteChrome>
  );
}
