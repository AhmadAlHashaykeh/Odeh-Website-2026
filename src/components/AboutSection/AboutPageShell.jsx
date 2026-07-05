/**
 * Shared layout shell for all About sub-pages.
 *
 * @param {Object} props
 * @param {{ title: string, description?: string }} props.meta - Page SEO metadata
 * @param {import('react').ReactNode} props.children - Page sections
 */
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { usePageMeta } from '../../hooks/usePageMeta';
import styles from './AboutPageShell.module.css';

export default function AboutPageShell({ meta, children }) {
  usePageMeta(meta);

  return (
    <div className={styles.shell}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
