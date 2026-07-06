import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Select } from '../../ui';
import {
  roleOptions,
  departmentOptions,
  accessScopeOptions,
} from '../mock/usersRolesConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';

export default function UserInviteModal({ open, onClose, onSave, roleOptions = [] }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(event.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.header}>
      <div>
        <h2 id="invite-user-title" className={drawerStyles.title}>
          Invite User
        </h2>
        <p className={drawerStyles.subtitle}>Send an invitation to a new admin user (preview mode).</p>
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
        form="invite-user-form"
        icon={<AdminIcon name="messages" size={14} />}
      >
        Send Invitation
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
      ariaLabelledBy="invite-user-title"
    >
      <form id="invite-user-form" onSubmit={handleSubmit}>
        <Form.Section title="User Details">
          <Form.Field label="Full Name" htmlFor="invite-full-name">
            <Input.Field>
              <input
                id="invite-full-name"
                name="fullName"
                type="text"
                className={inputStyles.input}
                placeholder="Enter full name"
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Email" htmlFor="invite-email">
            <Input.Field>
              <input
                id="invite-email"
                name="email"
                type="email"
                className={inputStyles.input}
                placeholder="user@odeh.com"
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Role" htmlFor="invite-role">
            <Select
              id="invite-role"
              name="roleId"
              defaultValue={roleOptions[0]?.value}
              options={roleOptions}
              ariaLabel="Role"
            />
          </Form.Field>
          <Form.Field label="Department" htmlFor="invite-department">
            <Select
              id="invite-department"
              name="department"
              defaultValue={departmentOptions[0]?.value}
              options={departmentOptions}
              ariaLabel="Department"
            />
          </Form.Field>
          <Form.Field label="Access Scope" htmlFor="invite-scope">
            <Select
              id="invite-scope"
              name="accessScope"
              defaultValue={accessScopeOptions[0]?.value}
              options={accessScopeOptions}
              ariaLabel="Access scope"
            />
          </Form.Field>
          <Form.Field label="Message" htmlFor="invite-message">
            <Input.Field>
              <textarea
                id="invite-message"
                name="message"
                className={`${inputStyles.input} ${inputStyles.textarea}`}
                rows={3}
                placeholder="Optional welcome message..."
              />
            </Input.Field>
          </Form.Field>
        </Form.Section>
      </form>
    </Modal>
  );
}
