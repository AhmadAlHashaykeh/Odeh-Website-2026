import { Link } from 'react-router-dom';
import { getJobPath } from '../../data/careers';
import styles from './JobCard.module.css';

export default function JobCard({ job }) {
  return (
    <article className={styles.card}>
      <Link to={getJobPath(job)} className={styles.cardLink} aria-label={`View role: ${job.title}`}>
        <div className={styles.content}>
          <h3 className={styles.title}>{job.title}</h3>

          <ul className={styles.metaList} aria-label="Job details">
            <li>{job.department}</li>
            <li>{job.location}</li>
            <li>{job.type}</li>
            <li>{job.experienceLevel}</li>
          </ul>

          <p className={styles.description}>{job.shortDescription}</p>
        </div>

        <span className={styles.action}>
          View Role
          <span className={styles.actionArrow} aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}
