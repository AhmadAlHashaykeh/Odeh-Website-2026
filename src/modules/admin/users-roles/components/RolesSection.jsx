import AdminIcon from '../../components/AdminIcons';
import { Button } from '../../ui';
import RoleCard from './RoleCard';
import RolesEmptyState from './RolesEmptyState';
import styles from './RolesSection.module.css';

export default function RolesSection({ roles, onRoleAction, onRoleEdit, onAddRole }) {
  if (roles.length === 0) {
    return <RolesEmptyState onAddRole={onAddRole} />;
  }

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Role Definitions</h2>
          <p className={styles.subtitle}>
            Configure access levels and permission scopes for each admin role.
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.count}>{roles.length} roles</span>
          <Button
            variant="primary"
            size="sm"
            icon={<AdminIcon name="add" size={14} />}
            onClick={onAddRole}
          >
            Add Role
          </Button>
        </div>
      </header>

      <div className={styles.grid}>
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} onAction={onRoleAction} onEdit={onRoleEdit} />
        ))}
      </div>
    </div>
  );
}
