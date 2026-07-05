import { useScrollReveal } from '../../hooks/useScrollReveal';
import JobSummaryPanel from './JobSummaryPanel';
import styles from './JobDetails.module.css';

function DetailSection({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className={styles.section} aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <h2 id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`} className={styles.sectionTitle}>
        {title}
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function JobDetails({ job }) {
  const sectionRef = useScrollReveal(0.08);

  return (
    <section className={styles.details} aria-label="Role details">
      <div className="container">
        <div ref={sectionRef} className={`${styles.layout} reveal`}>
          <div className={styles.main}>
            <section className={styles.section} aria-labelledby="role-overview">
              <h2 id="role-overview" className={styles.sectionTitle}>
                Role Overview
              </h2>
              <p className={styles.overview}>{job.description}</p>
            </section>

            <DetailSection title="Responsibilities" items={job.responsibilities} />
            <DetailSection title="Requirements" items={job.requirements} />
            <DetailSection title="Preferred Qualifications" items={job.preferredQualifications} />
            <DetailSection title="Benefits" items={job.benefits} />
          </div>

          <JobSummaryPanel job={job} />
        </div>
      </div>
    </section>
  );
}
