import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Services from '../components/Services/Services';
import Projects from '../components/Projects/Projects';
import Footer from '../components/Footer/Footer';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './HomePage.module.css';

export default function HomePage() {
  usePageMeta({
    title: 'ODEH & PARTNERS DESIGN',
    description:
      'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
  });

  return (
    <div className={styles.home}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
