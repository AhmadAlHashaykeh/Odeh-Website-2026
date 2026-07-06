import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Services from '../components/Services/Services';
import Projects from '../components/Projects/Projects';
import Footer from '../components/Footer/Footer';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getHome } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { useSeoMeta } from '../hooks/useSeoMeta';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { data, loading, error } = usePublicQuery(() => getHome(), []);
  const home = data?.data;

  useSeoMeta('/', {
    title: 'ODEH & PARTNERS DESIGN',
    description:
      'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
  });

  if (loading) {
    return (
      <div className={styles.home}>
        <Navbar />
        <main>
          <PublicPageSkeleton variant="home" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !home) {
    return (
      <div className={styles.home}>
        <Navbar />
        <main className={styles.error}>Unable to load homepage content.</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <Navbar />
      <main>
        <Hero content={home.hero} />
        <About content={home.about} />
        <Services content={home.services} />
        <Projects content={home.projects} />
      </main>
      <Footer />
    </div>
  );
}
