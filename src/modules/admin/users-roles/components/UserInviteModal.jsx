import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Select } from '../../ui';
import {
  departmentOptions,
  accessScopeOptions,
} from '../mock/usersRolesConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';

export default function UserInviteModal({ open, onClose, onSave, roleOptions = [] }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.namedItem('password')?.value ?? '';
    const confirmPassword = form.elements.namedItem('confirmPassword')?.value ?? '';

    if (password !== confirmPassword) {
      form.elements.namedItem('confirmPassword')?.setCustomValidity('Passwords do not match.');
      form.elements.namedItem('confirmPassword')?.reportValidity();
      return;
    }

    form.elements.namedItem('confirmPassword')?.setCustomValidity('');
    onSave(form);
  };

  const modalHeader = (
    <div className={drawerStyles.header}>
      <div>
        <h2 id="add-admin-title" className={drawerStyles.title}>
          Add Admin
        </h2>
        <p className={drawerStyles.subtitle}>
          Create a new admin account with immediate access to the CMS.
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
        form="add-admin-form"
        icon={<AdminIcon name="add" size={14} />}
      >
        Add Admin
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
      ariaLabelledBy="add-admin-title"
    >
      <form id="add-admin-form" onSubmit={handleSubmit}>
        <Form.Section title="Account Details">
          <Form.Field label="Full Name" htmlFor="add-full-name" required>
            <Input.Field>
              <input
                id="add-full-name"
                name="fullName"
                type="text"
                className={inputStyles.input}
                placeholder="Enter full name"
                required
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Email" htmlFor="add-email" required>
            <Input.Field>
              <input
                id="add-email"
                name="email"
                type="email"
                className={inputStyles.input}
                placeholder="user@odeh.com"
                required
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Password" htmlFor="add-password" required>
            <Input.Field>
              <input
                id="add-password"
                name="password"
                type="password"
                className={inputStyles.input}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Confirm Password" htmlFor="add-confirm-password" required>
            <Input.Field>
              <input
                id="add-confirm-password"
                name="confirmPassword"
                type="password"
                className={inputStyles.input}
                placeholder="Re-enter password"
                minLength={8}
                required
                autoComplete="new-password"
                onChange={(event) => event.currentTarget.setCustomValidity('')}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Role" htmlFor="add-role" required>
            <Select
              id="add-role"
              name="roleId"
              defaultValue={roleOptions[0]?.value}
              options={roleOptions}
              ariaLabel="Role"
            />
          </Form.Field>
          <Form.Field label="Department" htmlFor="add-department">
            <Select
              id="add-department"
              name="department"
              defaultValue={departmentOptions[0]?.value}
              options={departmentOptions}
              ariaLabel="Department"
            />
          </Form.Field>
          <Form.Field label="Access Scope" htmlFor="add-scope">
            <Select
              id="add-scope"
              name="accessScope"
              defaultValue={accessScopeOptions[0]?.value}
              options={accessScopeOptions}
              ariaLabel="Access scope"
            />
          </Form.Field>
        </Form.Section>
      </form>
    </Modal>
  );
}
