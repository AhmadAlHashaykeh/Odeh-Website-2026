import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { usePageMeta } from '../hooks/usePageMeta';
import styles from './PlaceholderPage.module.css';

function formatPageName(pathname) {
  return (
    pathname
      .replace(/^\//, '')
      .replace(/\//g, ' / ')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Page'
  );
}

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = formatPageName(location.pathname);

  usePageMeta({
    title: `${pageName} | ODEH & PARTNERS DESIGN`,
    description: `${pageName} — coming soon at ODEH & PARTNERS DESIGN.`,
  });

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.content}>
          <span className="section-label">Coming Soon</span>
          <h1 className={styles.title}>{pageName}</h1>
          <p className={styles.text}>
            This page is under development. Return to the home page to explore ODEH & PARTNERS
            DESIGN.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
