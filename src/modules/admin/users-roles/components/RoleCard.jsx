import { Badge } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import RoleQuickActions from './RoleQuickActions';
import styles from './RoleCard.module.css';

const ACCESS_LEVEL_TONES = {
  Full: 'published',
  Elevated: 'info',
  Standard: 'draft',
  Limited: 'neutral',
};

export default function RoleCard({ role, onAction, onEdit }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <AdminIcon name="users" size={18} />
        </div>
        <RoleQuickActions role={role} onAction={onAction} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{role.name}</h3>
        <p className={styles.description}>{role.description}</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{role.userCount}</span>
          <span className={styles.statLabel}>Users</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{role.permissionCount}</span>
          <span className={styles.statLabel}>Permissions</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Badge variant={ACCESS_LEVEL_TONES[role.accessLevel] || 'neutral'}>
          {role.accessLevel} Access
        </Badge>
        <Badge variant={role.status === 'active' ? 'success' : 'archived'}>
          {role.status === 'active' ? 'Active' : 'Disabled'}
        </Badge>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={() => onAction('view', role)}>
          <AdminIcon name="eye" size={14} />
          View Matrix
        </button>
        <button type="button" className={styles.actionBtnPrimary} onClick={() => onEdit(role.id)}>
          <AdminIcon name="edit" size={14} />
          Edit Role
        </button>
      </div>
    </article>
  );
}
