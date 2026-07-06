import AdminIcon from '../../components/AdminIcons';
import { Drawer, Button, Badge } from '../../ui';
import { getUserPermissionsSummary } from '../mock/usersRolesConfig';
import { PERMISSION_MODULES } from '../mock/usersRolesConfig';
import styles from './UserDetailsDrawer.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const variants = { active: 'success', invited: 'info', suspended: 'archived' };
  const labels = { active: 'Active', invited: 'Invited', suspended: 'Suspended' };
  return <Badge variant={variants[status] || 'neutral'}>{labels[status] || status}</Badge>;
}

export default function UserDetailsDrawer({ user, roles, onClose }) {
  if (!user) return null;

  const permSummary = getUserPermissionsSummary(user, roles);
  const moduleLabels = PERMISSION_MODULES.filter((m) =>
    permSummary.modules.includes(m.id),
  ).map((m) => m.label);

  const drawerHeader = (
    <Drawer.Header onClose={onClose} sticky>
      <div className={styles.headerContent}>
        <span className={styles.avatar}>{user.initials}</span>
        <div>
          <h2 className={styles.name}>{user.fullName}</h2>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>
    </Drawer.Header>
  );

  const drawerFooter = (
    <Drawer.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Drawer.Footer>
  );

  return (
    <Drawer
      open={Boolean(user)}
      onClose={onClose}
      size="large"
      stickyHeader
      header={drawerHeader}
      footer={drawerFooter}
    >
      <div className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Profile</h3>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Department</span>
              <span className={styles.metaValue}>{user.department}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Access Scope</span>
              <span className={styles.metaValue}>{user.accessScope}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Created</span>
              <span className={styles.metaValue}>{formatDate(user.createdDate)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>User ID</span>
              <span className={styles.metaValueMono}>{user.id}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Role & Permissions</h3>
          <div className={styles.roleBlock}>
            <span className={styles.roleBadge}>{user.role}</span>
            <p className={styles.permCount}>
              {permSummary.count} permissions across {moduleLabels.length} modules
            </p>
          </div>
          <div className={styles.chipList}>
            {moduleLabels.slice(0, 8).map((label) => (
              <span key={label} className={styles.chip}>
                {label}
              </span>
            ))}
            {moduleLabels.length > 8 && (
              <span className={styles.chipMore}>+{moduleLabels.length - 8} more</span>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Account Status</h3>
          <div className={styles.statusRow}>
            <StatusBadge status={user.status} />
            <span className={user.twoFactorEnabled ? styles.twoFaOn : styles.twoFaOff}>
              <AdminIcon name="settings" size={14} />
              2FA {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Login Activity</h3>
          {user.loginActivity.length === 0 ? (
            <p className={styles.emptyActivity}>No login activity recorded yet.</p>
          ) : (
            <ul className={styles.activityList}>
              {user.loginActivity.map((entry) => (
                <li key={entry.date} className={styles.activityItem}>
                  <span className={styles.activityDate}>{formatDate(entry.date)}</span>
                  <span className={styles.activityDevice}>{entry.device}</span>
                  <span className={styles.activityIp}>{entry.ip}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Drawer>
  );
}
