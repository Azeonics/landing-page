import SiteChrome from '@/components/layout/SiteChrome';
import ContactSection from '@/components/sections/ContactSection';
import Footprint from '@/components/sections/Footprint';
import Partners from '@/components/sections/Partners';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Built in India, going global. Reach the Azeonics team in Thane and Navi Mumbai, Maharashtra to book a slot, explore partnerships, or learn about our global footprint.',
  path: '/contact'
});

export default function ContactPage() {
  return (
    <SiteChrome>
      <ContactSection />
      <Footprint />
      <Partners />
    </SiteChrome>
  );
}
