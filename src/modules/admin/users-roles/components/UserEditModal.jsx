import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Select } from '../../ui';
import {
  roleOptions,
  departmentOptions,
  accessScopeOptions,
} from '../mock/usersRolesConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'suspended', label: 'Suspended' },
];

const TWO_FA_OPTIONS = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
];

export default function UserEditModal({ open, user, onClose, onSave, roleOptions = [] }) {
  if (!user) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(event.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.header}>
      <div>
        <h2 id="edit-user-title" className={drawerStyles.title}>
          Edit User
        </h2>
        <p className={drawerStyles.subtitle}>Update account details for {user.fullName}.</p>
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
        form="edit-user-form"
        icon={<AdminIcon name="check" size={14} />}
      >
        Save Changes
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
      ariaLabelledBy="edit-user-title"
    >
      <form id="edit-user-form" onSubmit={handleSubmit}>
        <Form.Section title="Account Details">
          <Form.Field label="Full Name" htmlFor="edit-full-name">
            <Input.Field>
              <input
                id="edit-full-name"
                name="fullName"
                type="text"
                className={inputStyles.input}
                defaultValue={user.fullName}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Email" htmlFor="edit-email">
            <Input.Field>
              <input
                id="edit-email"
                name="email"
                type="email"
                className={inputStyles.input}
                defaultValue={user.email}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Role" htmlFor="edit-role">
            <Select
              id="edit-role"
              name="roleId"
              defaultValue={user.roleId}
              options={roleOptions}
              ariaLabel="Role"
            />
          </Form.Field>
          <Form.Field label="Department" htmlFor="edit-department">
            <Select
              id="edit-department"
              name="department"
              defaultValue={user.department}
              options={departmentOptions}
              ariaLabel="Department"
            />
          </Form.Field>
          <Form.Field label="Status" htmlFor="edit-status">
            <Select
              id="edit-status"
              name="status"
              defaultValue={user.status}
              options={STATUS_OPTIONS}
              ariaLabel="Status"
            />
          </Form.Field>
          <Form.Field label="Access Scope" htmlFor="edit-scope">
            <Select
              id="edit-scope"
              name="accessScope"
              defaultValue={user.accessScope}
              options={accessScopeOptions}
              ariaLabel="Access scope"
            />
          </Form.Field>
          <Form.Field label="2FA Status" htmlFor="edit-2fa">
            <Select
              id="edit-2fa"
              name="twoFactor"
              defaultValue={user.twoFactorEnabled ? 'enabled' : 'disabled'}
              options={TWO_FA_OPTIONS}
              ariaLabel="Two-factor authentication status"
            />
          </Form.Field>
        </Form.Section>
      </form>
    </Modal>
  );
}
