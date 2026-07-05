import { useScrollReveal } from '../../hooks/useScrollReveal';
import ActivityCard from './ActivityCard';
import styles from './ActivitiesGallery.module.css';

export default function ActivitiesGallery({ activities }) {
  const headerRef = useScrollReveal(0.1);
  const gridRef = useScrollReveal(0.06);

  return (
    <section className={styles.gallery} aria-label="Activities gallery">
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">Activities Archive</span>
          <p className={styles.intro}>
            A formal record of company events, site visits, celebrations, and team engagements.
          </p>
        </div>

        <div ref={gridRef} className={`${styles.grid} reveal reveal-delay-1`}>
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.slug}
              slug={activity.slug}
              title={activity.title}
              date={activity.date}
              coverImage={activity.coverImage}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
