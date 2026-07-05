import { Link } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import { InternalPageHero, PageContainer } from '../components/Utility';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const contentRef = useScrollReveal(0.1);

  const meta = {
    title: 'Page Not Found | ODEH & PARTNERS DESIGN',
    description: "The page you're looking for doesn't exist or may have been moved.",
  };

  return (
    <AboutPageShell meta={meta}>
      <InternalPageHero
        label="404"
        title="Page Not Found"
        description="The page you're looking for doesn't exist or may have been moved."
        compact
        showGrid
      />

      <PageContainer className={styles.content} ariaLabel="Page not found">
        <div ref={contentRef} className={`${styles.panel} reveal`}>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <p className={styles.text}>
            The page you requested could not be found. It may have been removed, renamed, or is
            temporarily unavailable.
          </p>
          <div className={styles.actions}>
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              Browse Projects
            </Link>
          </div>
        </div>
      </PageContainer>
    </AboutPageShell>
  );
}
