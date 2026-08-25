import Nav from './Nav';
import Footer from './Footer';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
