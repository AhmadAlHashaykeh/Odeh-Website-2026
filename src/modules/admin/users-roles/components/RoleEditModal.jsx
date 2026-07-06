import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Select } from '../../ui';
import { accessLevelOptions } from '../mock/usersRolesConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './RoleEditModal.module.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

export default function RoleEditModal({ open, mode = 'edit', role, onClose, onSave }) {
  if (!open || !role) return null;

  const isCreate = mode === 'create';

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(event.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.header}>
      <div>
        <h2 id="edit-role-title" className={drawerStyles.title}>
          {isCreate ? 'Add Role' : 'Edit Role'}
        </h2>
        <p className={drawerStyles.subtitle}>
          {isCreate
            ? 'Define a new role with access level and permissions scope.'
            : `Configure role settings for ${role.name}.`}
        </p>
      </div>
      <button type="button" className={drawerStyles.closeBtn} onClick={onClose} aria-label="Close">
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <div className={drawerStyles.footer}>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        type="submit"
        form="edit-role-form"
        icon={<AdminIcon name="check" size={14} />}
      >
        {isCreate ? 'Create Role' : 'Save Changes'}
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      centered
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="edit-role-title"
    >
      <form id="edit-role-form" onSubmit={handleSubmit}>
        <Form.Section title="Role Configuration">
          <Form.Field label="Role Name" htmlFor="role-name">
            <Input.Field>
              <input
                id="role-name"
                name="name"
                type="text"
                className={inputStyles.input}
                defaultValue={role.name}
                placeholder="e.g. Content Editor"
                required
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Description" htmlFor="role-description">
            <Input.Field>
              <textarea
                id="role-description"
                name="description"
                className={`${inputStyles.input} ${inputStyles.textarea}`}
                rows={3}
                defaultValue={role.description}
                placeholder="Describe what this role can access..."
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Access Level" htmlFor="role-access-level">
            <Select
              id="role-access-level"
              name="accessLevel"
              defaultValue={role.accessLevel}
              options={accessLevelOptions}
              ariaLabel="Access level"
            />
          </Form.Field>
          <Form.Field label="Status" htmlFor="role-status">
            <Select
              id="role-status"
              name="status"
              defaultValue={role.status}
              options={STATUS_OPTIONS}
              ariaLabel="Status"
            />
          </Form.Field>
        </Form.Section>

        <Form.Section title="Permissions Summary">
          <div className={styles.permSummary}>
            <div className={styles.permStat}>
              <span className={styles.permValue}>{role.permissionCount}</span>
              <span className={styles.permLabel}>Total Permissions</span>
            </div>
            <div className={styles.permStat}>
              <span className={styles.permValue}>{role.userCount}</span>
              <span className={styles.permLabel}>Assigned Users</span>
            </div>
          </div>
          <p className={styles.permNote}>
            {isCreate
              ? 'After creating the role, configure module permissions in the Permissions Matrix section.'
              : 'Permission assignments are managed in the Permissions Matrix section.'}
          </p>
        </Form.Section>
      </form>
    </Modal>
  );
}
