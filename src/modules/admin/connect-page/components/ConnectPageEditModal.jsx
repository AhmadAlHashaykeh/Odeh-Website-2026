import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Select } from '../../ui';
import { CmsModuleShortcut, SeoDelegationNotice } from '../../cms/components';
import { CoverImageField } from '../../cms/action-flows/PlaceholderFieldGroup';
import { getEditModalTitle } from '../mock/connectPageConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './ConnectPageEditModal.module.css';

function HeaderForm({ data }) {
  const { hero } = data;

  return (
    <>
      <Form.Section title="Page Tagline">
        <Form.Field label="Description" htmlFor="hero-description" helper="Connect page tagline — unique to this page">
          <Input.Field>
            <textarea
              id="hero-description"
              name="hero-description"
              className={`${inputStyles.input} ${styles.textarea}`}
              rows={3}
              defaultValue={hero.description}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Brand Assets">
        <div className={styles.mediaField}>
          <CoverImageField label="Logo Preview" src={hero.logoSrc} alt={hero.logoAlt} />
        </div>
        <p className={styles.delegationNote}>
          Logo, company name, and brand text are managed in Navigation &amp; Footer.
        </p>
        <CmsModuleShortcut
          title="Manage Navigation & Footer"
          description="Edit site logo, brand name, and footer brand assets."
          path="/admin/navigation-footer"
          icon="navigation"
        />
      </Form.Section>

      <Form.Section title="SEO">
        <SeoDelegationNotice seoStatus="complete" />
      </Form.Section>
    </>
  );
}

function LinkForm({ data }) {
  return (
    <>
      <Form.Section title="Link Details">
        <Form.Field label="Title" htmlFor="link-title">
          <Input.Field>
            <input
              id="link-title"
              name="link-title"
              type="text"
              className={inputStyles.input}
              defaultValue={data.title}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Subtitle" htmlFor="link-subtitle">
          <Input.Field>
            <input
              id="link-subtitle"
              name="link-subtitle"
              type="text"
              className={inputStyles.input}
              defaultValue={data.subtitle}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="URL" htmlFor="link-url">
          <Input.Field>
            <input
              id="link-url"
              name="link-url"
              type="text"
              className={inputStyles.input}
              defaultValue={data.url}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Icon" htmlFor="link-icon">
          <Input.Field>
            <input
              id="link-icon"
              name="link-icon"
              type="text"
              className={inputStyles.input}
              defaultValue={data.icon}
              readOnly
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Display Order" htmlFor="link-order">
          <Input.Field>
            <input
              id="link-order"
              name="link-order"
              type="number"
              className={inputStyles.input}
              defaultValue={data.order}
              readOnly
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="External Link" htmlFor="link-external">
          <Select
            id="link-external"
            name="link-external"
            defaultValue={data.external ? 'true' : 'false'}
            options={[
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ]}
            ariaLabel="External link"
          />
        </Form.Field>
        <Form.Field label="Enabled" htmlFor="link-enabled">
          <Select
            id="link-enabled"
            name="link-enabled"
            defaultValue={data.enabled ? 'true' : 'false'}
            options={[
              { value: 'true', label: 'Enabled' },
              { value: 'false', label: 'Disabled' },
            ]}
            ariaLabel="Link enabled"
          />
        </Form.Field>
      </Form.Section>
    </>
  );
}

export default function ConnectPageEditModal({
  open,
  editType,
  linkData,
  headerData,
  onClose,
  onSave,
}) {
  const isHeader = editType === 'header';
  const title = getEditModalTitle(editType);
  const formKey = isHeader ? 'header' : linkData?.id;

  const handleSave = (event) => {
    event?.preventDefault?.();
    onSave(event.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <div className={drawerStyles.headerMeta}>
          <span className={drawerStyles.headerIcon} aria-hidden="true">
            <AdminIcon name="connect" size={18} />
          </span>
        </div>
        <h2 id="connect-page-modal-title" className={drawerStyles.modalTitle}>
          {title}
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Update Connect page content. Changes are saved to the CMS.
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

  if (!open) return null;
  if (!isHeader && !linkData) return null;
  if (isHeader && !headerData) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      scrollable
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="connect-page-modal-title"
    >
      <Form
        key={formKey}
        onSubmit={handleSave}
        className={`${drawerStyles.form} ${styles.form}`}
      >
        {isHeader ? <HeaderForm data={headerData} /> : <LinkForm data={linkData} />}
      </Form>
    </Modal>
  );
}
