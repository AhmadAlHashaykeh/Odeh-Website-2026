import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Badge, Input, Select } from '../../ui';
import { CoverImageField } from '../../cms/action-flows/PlaceholderFieldGroup';
import { panelEditTitles } from '../mock/navigationFooterConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './NavigationFooterEditModal.module.css';

function LogoForm({ data }) {
  return (
    <>
      <Form.Section title="Site Logo">
        <div className={styles.mediaField}>
          <CoverImageField label="Logo Preview" src={data.src} alt={data.alt} />
        </div>
        <Form.Field label="Logo Path" htmlFor="logo-src">
          <Input.Field>
            <input
              id="logo-src"
              name="logo-src"
              type="text"
              className={inputStyles.input}
              defaultValue={data.src}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Alt Text" htmlFor="logo-alt">
          <Input.Field>
            <input
              id="logo-alt"
              name="logo-alt"
              type="text"
              className={inputStyles.input}
              defaultValue={data.alt}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function NavItemForm({ data }) {
  return (
    <>
      <Form.Section title="Navigation Item">
        <Form.Field label="Label" htmlFor="nav-label">
          <Input.Field>
            <input
              id="nav-label"
              name="nav-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.label}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Route" htmlFor="nav-path">
          <Input.Field>
            <input
              id="nav-path"
              name="nav-path"
              type="text"
              className={inputStyles.input}
              defaultValue={data.path}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Status" htmlFor="nav-status">
          <Select
            id="nav-status"
            name="nav-status"
            defaultValue={data.status}
            options={[
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ]}
            ariaLabel="Navigation status"
          />
        </Form.Field>
        <Form.Field label="Order" htmlFor="nav-order">
          <Input.Field>
            <input
              id="nav-order"
              name="nav-order"
              type="number"
              className={inputStyles.input}
              defaultValue={data.order}
              readOnly
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      {data.hasDropdown && data.dropdown?.length > 0 && (
        <Form.Section title="Dropdown Links">
          {data.dropdown.map((sub, index) => (
            <div key={sub.id} className={styles.subItemBlock}>
              <span className={styles.subItemLabel}>Link {index + 1}</span>
              <Form.Field label="Label" htmlFor={`dropdown-label-${index}`}>
                <Input.Field>
                  <input
                    id={`dropdown-label-${index}`}
                    name={`dropdown-label-${index}`}
                    type="text"
                    className={inputStyles.input}
                    defaultValue={sub.label}
                  />
                </Input.Field>
              </Form.Field>
              <Form.Field label="Route" htmlFor={`dropdown-path-${index}`}>
                <Input.Field>
                  <input
                    id={`dropdown-path-${index}`}
                    name={`dropdown-path-${index}`}
                    type="text"
                    className={inputStyles.input}
                    defaultValue={sub.path}
                  />
                </Input.Field>
              </Form.Field>
              <Form.Field label="Description" htmlFor={`dropdown-desc-${index}`}>
                <Input.Field>
                  <input
                    id={`dropdown-desc-${index}`}
                    name={`dropdown-desc-${index}`}
                    type="text"
                    className={inputStyles.input}
                    defaultValue={sub.description}
                  />
                </Input.Field>
              </Form.Field>
            </div>
          ))}
        </Form.Section>
      )}
    </>
  );
}

function FooterBrandForm({ data }) {
  return (
    <>
      <Form.Section title="Footer Brand">
        <div className={styles.mediaField}>
          <CoverImageField label="Footer Logo" src={data.logo.src} alt={data.logo.alt} />
        </div>
        <Form.Field label="Logo Path" htmlFor="footer-logo-src">
          <Input.Field>
            <input
              id="footer-logo-src"
              name="footer-logo-src"
              type="text"
              className={inputStyles.input}
              defaultValue={data.logo.src}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Brand Text" htmlFor="footer-brand-text">
          <Input.Field>
            <textarea
              id="footer-brand-text"
              name="footer-brand-text"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.text}
              rows={4}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function FooterNavGroupForm({ data }) {
  return (
    <Form.Section title={`${data.title} Links`}>
      {data.links.map((link, index) => (
        <div key={link.path} className={styles.subItemBlock}>
          <span className={styles.subItemLabel}>{link.label}</span>
          <Form.Field label="Label" htmlFor={`footer-link-label-${index}`}>
            <Input.Field>
              <input
                id={`footer-link-label-${index}`}
                name={`footer-link-label-${index}`}
                type="text"
                className={inputStyles.input}
                defaultValue={link.label}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Route" htmlFor={`footer-link-path-${index}`}>
            <Input.Field>
              <input
                id={`footer-link-path-${index}`}
                name={`footer-link-path-${index}`}
                type="text"
                className={inputStyles.input}
                defaultValue={link.path}
              />
            </Input.Field>
          </Form.Field>
        </div>
      ))}
    </Form.Section>
  );
}

function FooterContactForm({ data }) {
  return (
    <>
      <Form.Section title="Reach Us Contacts">
        {data.contacts.map((contact, index) => (
          <div key={contact.email} className={styles.subItemBlock}>
            <span className={styles.subItemLabel}>Contact {index + 1}</span>
            <Form.Field label="Email" htmlFor={`footer-email-${index}`}>
              <Input.Field>
                <input
                  id={`footer-email-${index}`}
                  name={`footer-email-${index}`}
                  type="email"
                  className={inputStyles.input}
                  defaultValue={contact.email}
                />
              </Input.Field>
            </Form.Field>
            <Form.Field label="Phone" htmlFor={`footer-phone-${index}`}>
              <Input.Field>
                <input
                  id={`footer-phone-${index}`}
                  name={`footer-phone-${index}`}
                  type="tel"
                  className={inputStyles.input}
                  defaultValue={contact.phone}
                />
              </Input.Field>
            </Form.Field>
          </div>
        ))}
        <Form.Field label="Location" htmlFor="footer-location">
          <Input.Field>
            <input
              id="footer-location"
              name="footer-location"
              type="text"
              className={inputStyles.input}
              defaultValue={data.location}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function CopyrightForm({ data }) {
  return (
    <Form.Section title="Copyright">
      <Form.Field label="Company Name" htmlFor="copyright-company">
        <Input.Field>
          <input
            id="copyright-company"
            name="copyright-company"
            type="text"
            className={inputStyles.input}
            defaultValue={data.companyName}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function ContactOfficeForm({ data }) {
  return (
    <>
      <Form.Section title="Office">
        <Form.Field label="Office Name" htmlFor="office-name">
          <Input.Field>
            <input
              id="office-name"
              name="office-name"
              type="text"
              className={inputStyles.input}
              defaultValue={data.officeName}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Location" htmlFor="office-location">
          <Input.Field>
            <input
              id="office-location"
              name="office-location"
              type="text"
              className={inputStyles.input}
              defaultValue={data.location}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title="Working Hours">
        <Form.Field label="Days" htmlFor="office-days">
          <Input.Field>
            <input
              id="office-days"
              name="office-days"
              type="text"
              className={inputStyles.input}
              defaultValue={data.workingHours.days}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Hours" htmlFor="office-hours">
          <Input.Field>
            <input
              id="office-hours"
              name="office-hours"
              type="text"
              className={inputStyles.input}
              defaultValue={data.workingHours.hours}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function ContactDirectForm({ data }) {
  return (
    <Form.Section title="Direct Contacts">
      {data.map((contact, index) => (
        <div key={contact.email} className={styles.subItemBlock}>
          <span className={styles.subItemLabel}>Contact {index + 1}</span>
          <Form.Field label="Email" htmlFor={`contact-email-${index}`}>
            <Input.Field>
              <input
                id={`contact-email-${index}`}
                name={`contact-email-${index}`}
                type="email"
                className={inputStyles.input}
                defaultValue={contact.email}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Phone" htmlFor={`contact-phone-${index}`}>
            <Input.Field>
              <input
                id={`contact-phone-${index}`}
                name={`contact-phone-${index}`}
                type="tel"
                className={inputStyles.input}
                defaultValue={contact.phone}
              />
            </Input.Field>
          </Form.Field>
        </div>
      ))}
    </Form.Section>
  );
}

function SocialLinkForm({ data }) {
  return (
    <Form.Section title="Social Link">
      <Form.Field label="Platform" htmlFor="social-label">
        <Input.Field>
          <input
            id="social-label"
            name="social-label"
            type="text"
            className={inputStyles.input}
            defaultValue={data.label}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="URL" htmlFor="social-href">
        <Input.Field>
          <input
            id="social-href"
            name="social-href"
            type="url"
            className={inputStyles.input}
            defaultValue={data.href}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Icon Key" htmlFor="social-icon">
        <Input.Field>
          <input
            id="social-icon"
            name="social-icon"
            type="text"
            className={inputStyles.input}
            defaultValue={data.icon}
            readOnly
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function PanelForm({ panelId, data, editingNavItemId }) {
  if (panelId === 'nav-menu' && editingNavItemId && data?.label) {
    return <NavItemForm data={data} />;
  }

  switch (panelId) {
    case 'nav-logo':
      return <LogoForm data={data} />;
    case 'footer-brand':
      return <FooterBrandForm data={data} />;
    case 'footer-nav-get-started':
    case 'footer-nav-about':
      return <FooterNavGroupForm data={data} />;
    case 'footer-reach-us':
      return <FooterContactForm data={data} />;
    case 'footer-copyright':
      return <CopyrightForm data={data} />;
    case 'contact-office':
      return <ContactOfficeForm data={data} />;
    case 'contact-direct':
      return <ContactDirectForm data={data} />;
    default:
      if (panelId.startsWith('social-')) {
        return <SocialLinkForm data={data} />;
      }
      return null;
  }
}

export default function NavigationFooterEditModal({
  open,
  panelId,
  panelData,
  editingNavItemId,
  onClose,
  onSave,
}) {
  if (!panelId || !panelData) return null;

  const title =
    panelId === 'nav-menu' && editingNavItemId
      ? `Edit ${panelData.label}`
      : panelEditTitles[panelId];

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.(panelId);
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <Badge variant="info" className={drawerStyles.moduleBadge}>
          Website Structure
        </Badge>
        <h2 id="nav-footer-modal-title" className={drawerStyles.modalTitle}>
          {title}
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Fields match the current public website components. Changes are preview-only.
        </p>
      </div>
      <button
        type="button"
        className={drawerStyles.closeBtn}
        onClick={onClose}
        aria-label="Close modal"
      >
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="check" size={16} />}
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="nav-footer-modal-title"
    >
      <Form
        key={`${panelId}-${editingNavItemId ?? 'root'}`}
        onSubmit={handleSave}
        className={`${drawerStyles.form} ${styles.form}`}
      >
        <PanelForm panelId={panelId} data={panelData} editingNavItemId={editingNavItemId} />
      </Form>
    </Modal>
  );
}
