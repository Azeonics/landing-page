import type { Metadata } from 'next';
import SiteChrome from '@/components/layout/SiteChrome';
import Hero from '@/components/hero/Hero';
import Ticker from '@/components/sections/Ticker';
import About from '@/components/sections/About';
import PipelineScrolly from '@/components/sections/PipelineScrolly';
import CapabilitiesGrid from '@/components/sections/CapabilitiesGrid';
import Maas from '@/components/sections/Maas';
import Gsaas from '@/components/sections/Gsaas';
import ManhaSpotlight from '@/components/sections/ManhaSpotlight';
import Audience from '@/components/sections/Audience';
import Partners from '@/components/sections/Partners';

export const metadata: Metadata = {
  title: { absolute: 'Azeonics | Idea 2 Orbit Innovation Hub' },
  description:
    "India's first integrated precision manufacturing, testing and innovation facility for drones, satellites and aerospace systems — delivered as a pay-per-use, manufacturing-as-a-service model.",
  alternates: { canonical: '/' }
};

export default function Page() {
  return (
    <SiteChrome>
      <Hero />
      <Ticker />
      <About id="hub" />
      <PipelineScrolly />
      <CapabilitiesGrid preview />
      <Maas />
      <Gsaas />
      <ManhaSpotlight />
      <Audience />
      <Partners />
    </SiteChrome>
  );
}
