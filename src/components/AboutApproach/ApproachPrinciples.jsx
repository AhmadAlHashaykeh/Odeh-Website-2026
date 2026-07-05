import { useEffect, useRef } from 'react';
import styles from './ApproachPrinciples.module.css';

export default function ApproachPrinciples({ label, items }) {
  return (
    <section className={styles.principles} aria-label="Engineering principles">
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>{label}</h2>
          </div>

          <ol className={styles.list}>
            {items.map((item) => (
              <PrincipleItem key={item.number} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PrincipleItem({ item }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => {
      element.classList.add(styles.isVisible);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(element);

    const checkInitialVisibility = () => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top < window.innerHeight - 20 && rect.bottom > 20;
      if (inView) {
        reveal();
        observer.unobserve(element);
      }
    };

    checkInitialVisibility();
    requestAnimationFrame(checkInitialVisibility);

    return () => observer.disconnect();
  }, []);

  return (
    <li ref={ref} className={styles.item}>
      <span className={styles.number} aria-hidden="true">
        {item.number}
      </span>
      <div className={styles.body}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemDesc}>{item.description}</p>
      </div>
    </li>
  );
}
