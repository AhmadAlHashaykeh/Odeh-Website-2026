import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './TeamOverviewCard.module.css';

export default function TeamOverviewCard({ stats }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Team Members</h2>
          <p className={styles.desc}>
            Team profiles are managed in the Team Members module. This section shows a quick overview only.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Members</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.visible}</span>
            <span className={styles.statLabel}>Visible Profiles</span>
          </div>
        </div>
      </div>

      <div className={styles.preview}>
        <span className={styles.previewLabel}>Member Preview</span>
        <div className={styles.memberGrid}>
          {stats.preview.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <img src={resolveMediaUrl(member.photo)} alt={member.fullName} loading="lazy" />
              <div className={styles.memberInfo}>
                <strong>{member.fullName}</strong>
                <span>{member.position}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/admin/team-members" className={styles.manageLink}>
        <AdminIcon name="team" size={14} />
        Manage Team Members
      </Link>
    </article>
  );
}
