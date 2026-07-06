import AdminIcon from '../../components/AdminIcons';
import styles from './SecurityOverview.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SecurityCard({ icon, label, value, helper, tone = 'default' }) {
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.cardIcon}>
        <AdminIcon name={icon} size={18} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardValue}>{value}</span>
        <span className={styles.cardLabel}>{label}</span>
        {helper && <span className={styles.cardHelper}>{helper}</span>}
      </div>
    </article>
  );
}

export default function SecurityOverview({ overview }) {
  const twoFaPercent = overview.twoFaTotal
    ? Math.round((overview.twoFaEnabled / overview.twoFaTotal) * 100)
    : 0;

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Security Overview</h2>
          <p className={styles.subtitle}>
            Account health, authentication coverage, and access control status.
          </p>
        </div>
      </header>

      <div className={styles.grid}>
        <SecurityCard
          icon="users"
          label="Active Users"
          value={overview.activeUsers}
          helper="Currently signed in accounts"
          tone="success"
        />
        <SecurityCard
          icon="messages"
          label="Invited Users"
          value={overview.invitedUsers}
          helper="Pending invitation acceptance"
          tone="info"
        />
        <SecurityCard
          icon="external"
          label="Suspended Users"
          value={overview.suspendedUsers}
          helper="Access temporarily revoked"
          tone="warning"
        />
        <SecurityCard
          icon="settings"
          label="2FA Enabled"
          value={`${overview.twoFaEnabled}/${overview.twoFaTotal}`}
          helper={`${twoFaPercent}% coverage`}
          tone="accent"
        />
        <SecurityCard
          icon="dashboard"
          label="Last Admin Activity"
          value={overview.lastAdminActivity?.name?.split(' ')[0] ?? '—'}
          helper={
            overview.lastAdminActivity
              ? formatDate(overview.lastAdminActivity.date)
              : 'No recent activity'
          }
        />
        <SecurityCard
          icon="team"
          label="Role Coverage"
          value={`${overview.roleCoverage.assigned}/${overview.roleCoverage.total}`}
          helper="Roles with assigned users"
        />
      </div>
    </div>
  );
}
