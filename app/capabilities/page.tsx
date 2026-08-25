import SiteChrome from '@/components/layout/SiteChrome';
import CapabilitiesIntro from '@/components/sections/CapabilitiesIntro';
import CapabilitiesGrid from '@/components/sections/CapabilitiesGrid';
import Maas from '@/components/sections/Maas';
import Gsaas from '@/components/sections/Gsaas';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Capabilities',
  description:
    'Precision manufacturing, metal additive, electronics & sensor fabrication, environmental qualification and cleanroom integration — six capabilities under one roof, available as a service.',
  path: '/capabilities'
});

export default function CapabilitiesPage() {
  return (
    <SiteChrome>
      <CapabilitiesIntro />
      <CapabilitiesGrid withHead={false} />
      <Maas />
      <Gsaas />
    </SiteChrome>
  );
}
