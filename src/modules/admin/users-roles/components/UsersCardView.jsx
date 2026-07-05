import { Badge } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import UserQuickActions from './UserQuickActions';
import styles from './UsersCardView.module.css';

function formatDate(value) {
  if (!value) return 'Never';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function UserStatusBadge({ status }) {
  const variants = { active: 'success', invited: 'info', suspended: 'archived' };
  const labels = { active: 'Active', invited: 'Invited', suspended: 'Suspended' };
  return <Badge variant={variants[status] || 'neutral'}>{labels[status] || status}</Badge>;
}

export default function UsersCardView({
  users,
  selectedIds,
  onToggleSelect,
  onUserClick,
  onViewUser,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {users.map((user) => (
        <article
          key={user.id}
          className={`${styles.card} ${selectedIds.has(user.id) ? styles.selected : ''}`}
        >
          <div className={styles.cardHeader}>
            <label className={styles.checkboxWrap}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(user.id)}
                onChange={() => onToggleSelect(user.id)}
                aria-label={`Select ${user.fullName}`}
              />
            </label>
            <UserQuickActions user={user} onView={onViewUser} onAction={onAction} />
          </div>

          <button type="button" className={styles.profileBtn} onClick={() => onUserClick(user.id)}>
            <span className={styles.avatar}>{user.initials}</span>
            <h3 className={styles.name}>{user.fullName}</h3>
            <p className={styles.email}>{user.email}</p>
          </button>

          <div className={styles.meta}>
            <span className={styles.roleBadge}>{user.role}</span>
            <UserStatusBadge status={user.status} />
          </div>

          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt>Department</dt>
              <dd>{user.department}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>2FA</dt>
              <dd className={user.twoFactorEnabled ? styles.twoFaOn : styles.twoFaOff}>
                {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Last Login</dt>
              <dd>{formatDate(user.lastLogin)}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Access</dt>
              <dd>{user.accessScope}</dd>
            </div>
          </dl>

          <div className={styles.footer}>
            <span className={styles.scopeChip}>
              <AdminIcon name="settings" size={12} />
              {user.accessScope}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
