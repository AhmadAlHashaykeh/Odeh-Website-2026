import { Badge } from '../../ui';
import UserQuickActions from './UserQuickActions';
import styles from './UsersTableView.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function UserStatusBadge({ status }) {
  const variants = {
    active: 'success',
    invited: 'info',
    suspended: 'archived',
  };
  const labels = {
    active: 'Active',
    invited: 'Invited',
    suspended: 'Suspended',
  };
  return <Badge variant={variants[status] || 'neutral'}>{labels[status] || status}</Badge>;
}

function RoleBadge({ role }) {
  return <span className={styles.roleBadge}>{role}</span>;
}

function TwoFaBadge({ enabled }) {
  return enabled ? (
    <span className={styles.twoFaEnabled}>
      <span className={styles.twoFaDot} aria-hidden="true" />
      Enabled
    </span>
  ) : (
    <span className={styles.twoFaDisabled}>Disabled</span>
  );
}

export default function UsersTableView({
  users,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onUserClick,
  onViewUser,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all users"
              />
            </th>
            <th>User</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>2FA</th>
            <th>Last Login</th>
            <th>Access Scope</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`${styles.row} ${selectedIds.has(user.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(user.id)}
                  onChange={() => onToggleSelect(user.id)}
                  aria-label={`Select ${user.fullName}`}
                />
              </td>
              <td>
                <button
                  type="button"
                  className={styles.userCell}
                  onClick={() => onUserClick(user.id)}
                >
                  <span className={styles.avatar} aria-hidden="true">
                    {user.initials}
                  </span>
                  <span className={styles.userInfo}>
                    <span className={styles.userName}>{user.fullName}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </span>
                </button>
              </td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>{user.department}</td>
              <td>
                <UserStatusBadge status={user.status} />
              </td>
              <td>
                <TwoFaBadge enabled={user.twoFactorEnabled} />
              </td>
              <td className={styles.muted}>{formatDate(user.lastLogin)}</td>
              <td>
                <span className={styles.scopeChip}>{user.accessScope}</span>
              </td>
              <td className={styles.actionsCol}>
                <UserQuickActions user={user} onView={onViewUser} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
