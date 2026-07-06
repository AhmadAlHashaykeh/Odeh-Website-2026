import AdminIcon from '../../components/AdminIcons';
import { Select, Button } from '../../ui';
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from '../mock/usersRolesConfig';
import PermissionsEmptyState from './PermissionsEmptyState';
import styles from './PermissionsMatrix.module.css';

const ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
};

function PermissionCell({ state }) {
  if (state === 'granted') {
    return (
      <span className={`${styles.cell} ${styles.granted}`} title="Granted">
        <AdminIcon name="check" size={14} />
      </span>
    );
  }

  return (
    <span className={`${styles.cell} ${styles.denied}`} title="Denied">
      <AdminIcon name="close" size={12} />
    </span>
  );
}

export default function PermissionsMatrix({
  role,
  matrixRoleId,
  roleOptions = [],
  onRoleChange,
  canEdit = false,
  onSave,
  isSaving = false,
}) {
  if (!role) {
    return <PermissionsEmptyState />;
  }

  return (
    <div className={styles.section}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Permissions Matrix</h2>
          <p className={styles.subtitle}>
            Module access for the selected role. Permissions are enforced server-side.
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

      {canEdit && onSave && (
        <div className={styles.saveRow}>
          <Button variant="primary" onClick={() => onSave(role.permissions)} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Permissions'}
          </Button>
        </div>
      )}
    </div>
  );
}
