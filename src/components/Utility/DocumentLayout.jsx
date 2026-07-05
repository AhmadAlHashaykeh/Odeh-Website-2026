import { useEffect, useRef } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './DocumentLayout.module.css';

function TocNav({ sections, className, navRef }) {
  return (
    <nav ref={navRef} className={className}>
      <h2 className={styles.tocTitle}>Contents</h2>
      <ol className={styles.tocList}>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={styles.tocLink}>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function DocumentLayout({
  sections,
  lastUpdated,
  children,
}) {
  const contentRef = useScrollReveal(0.08);
  const tocRef = useRef(null);
  const mobileTocRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const inDesktopToc = tocRef.current?.contains(link);
      const inMobileToc = mobileTocRef.current?.contains(link);
      if (!inDesktopToc && !inMobileToc) return;

      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className={styles.layout}>
      {sections?.length > 0 && (
        <>
          <aside className={styles.tocAside} aria-label="Table of contents">
            <TocNav sections={sections} className={styles.toc} navRef={tocRef} />
          </aside>

          <details className={styles.tocMobile}>
            <summary className={styles.tocMobileToggle}>Table of contents</summary>
            <TocNav sections={sections} className={styles.tocMobilePanel} navRef={mobileTocRef} />
          </details>
        </>
      )}

      <article ref={contentRef} className={`${styles.document} reveal`}>
        {children}
        {lastUpdated && (
          <footer className={styles.updated}>
            <p>Last updated: {lastUpdated}</p>
          </footer>
        )}
      </article>
    </div>
  );
}

export function DocumentSection({ id, title, children }) {
  return (
    <section id={id} className={styles.section} tabIndex={-1}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
