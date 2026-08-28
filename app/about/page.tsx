import SiteChrome from '@/components/layout/SiteChrome';
import AboutStory from '@/components/sections/AboutStory';
import TeamPhoto from '@/components/sections/TeamPhoto';
import PeopleGrid from '@/components/sections/PeopleGrid';
import { keyPeopleHead, keyPeople, hodsHead, hods, advisorsHead, advisors } from '@/lib/content/about';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'The story of Azeonics — India’s first integrated idea-to-orbit innovation hub — and the leadership and department heads building it.',
  path: '/about'
});

export default function AboutPage() {
  return (
    <SiteChrome>
      <AboutStory />
      <TeamPhoto />
      <PeopleGrid head={keyPeopleHead} people={keyPeople} id="key-people" band />
      <PeopleGrid head={hodsHead} people={hods} id="hods" />
      <PeopleGrid head={advisorsHead} people={advisors} id="advisors" band />
    </SiteChrome>
  );
}
