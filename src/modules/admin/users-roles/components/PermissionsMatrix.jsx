import AdminIcon from '../../components/AdminIcons';
import { Select } from '../../ui';
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from '../mock/usersRolesData';
import { roleOptions } from '../mock/usersRolesConfig';
import PermissionsEmptyState from './PermissionsEmptyState';
import styles from './PermissionsMatrix.module.css';

const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  publish: 'Publish',
  manage: 'Manage',
};

function PermissionCell({ state }) {
  if (state === 'granted') {
    return (
      <span className={`${styles.cell} ${styles.granted}`} title="Granted">
        <AdminIcon name="check" size={14} />
      </span>
    );
  }
  if (state === 'partial') {
    return (
      <span className={`${styles.cell} ${styles.partial}`} title="Partial">
        <span className={styles.partialDot} />
      </span>
    );
  }
  if (state === 'denied') {
    return (
      <span className={`${styles.cell} ${styles.denied}`} title="Denied">
        <AdminIcon name="close" size={12} />
      </span>
    );
  }
  return (
    <span className={`${styles.cell} ${styles.na}`} title="Not applicable">
      —
    </span>
  );
}

export default function PermissionsMatrix({ role, matrixRoleId, onRoleChange }) {
  if (!role) {
    return <PermissionsEmptyState />;
  }

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Permissions Matrix</h2>
          <p className={styles.subtitle}>
            Visual map of module access for the selected role. Hover cells for interaction preview.
          </p>
        </div>

        <Select
          id="matrix-role-select"
          label="Role"
          value={matrixRoleId}
          onChange={onRoleChange}
          options={roleOptions}
          className={styles.roleSelect}
          ariaLabel="Select role for permissions matrix"
        />
      </header>

      <div className={styles.roleBanner}>
        <span className={styles.roleName}>{role.name}</span>
        <span className={styles.roleMeta}>
          {role.accessLevel} access · {role.permissionCount} permissions
        </span>
      </div>

      <div className={styles.matrixWrap}>
        <table className={styles.matrix}>
          <thead>
            <tr>
              <th className={styles.moduleCol}>Module</th>
              {PERMISSION_ACTIONS.map((action) => (
                <th key={action} className={styles.actionCol}>
                  {ACTION_LABELS[action]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_MODULES.map((mod) => {
              const perms = role.permissions[mod.id] || {};
              return (
                <tr key={mod.id} className={styles.row}>
                  <td className={styles.moduleCell}>{mod.label}</td>
                  {PERMISSION_ACTIONS.map((action) => (
                    <td key={action} className={styles.actionCell}>
                      <PermissionCell state={perms[action] || 'denied'} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendIcon} ${styles.granted}`}>
            <AdminIcon name="check" size={12} />
          </span>
          Granted
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendIcon} ${styles.partial}`}>
            <span className={styles.partialDot} />
          </span>
          Partial
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendIcon} ${styles.denied}`}>
            <AdminIcon name="close" size={10} />
          </span>
          Denied
        </span>
      </div>
    </div>
  );
}
