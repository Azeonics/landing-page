import SiteChrome from '@/components/layout/SiteChrome';
import Catalog from '@/components/catalog/Catalog';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Catalog',
  description:
    'A growing catalog of flight-grade subsystems and ground infrastructure — CubeSat platforms, on-board computers, ADCS, power, comms, structures and test rigs. Available standalone or as a turnkey mission package.',
  path: '/catalog'
});

export default function CatalogPage() {
  return (
    <SiteChrome>
      <Catalog />
    </SiteChrome>
  );
}
