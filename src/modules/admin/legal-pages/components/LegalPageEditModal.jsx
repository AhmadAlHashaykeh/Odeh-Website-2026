import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input, Badge, Select } from '../../ui';
import { SeoDelegationNotice } from '../../cms/components';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import { getSectionBody } from '../mock/legalPagesConfig';
import styles from './LegalPageEditModal.module.css';

function SectionFields({ page, section, index }) {
  const { paragraphs, listItems } = getSectionBody(page, section.id);

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionBlockHeader}>
        <span className={styles.sectionIndex}>{index + 1}</span>
        <span className={styles.sectionLabel}>{section.title}</span>
      </div>
      {paragraphs.map((text, paragraphIndex) => (
        <Form.Field
          key={`${section.id}-p-${paragraphIndex}`}
          label={`Paragraph ${paragraphIndex + 1}`}
          htmlFor={`${section.id}-p-${paragraphIndex}`}
        >
          <Input.Field>
            <textarea
              id={`${section.id}-p-${paragraphIndex}`}
              name={`${section.id}-p-${paragraphIndex}`}
              className={`${inputStyles.input} ${styles.textarea}`}
              rows={3}
              defaultValue={text}
            />
          </Input.Field>
        </Form.Field>
      ))}
      {listItems?.map((item, itemIndex) => (
        <Form.Field
          key={`${section.id}-l-${itemIndex}`}
          label={`List item ${itemIndex + 1}`}
          htmlFor={`${section.id}-l-${itemIndex}`}
        >
          <Input.Field>
            <textarea
              id={`${section.id}-l-${itemIndex}`}
              name={`${section.id}-l-${itemIndex}`}
              className={`${inputStyles.input} ${styles.textarea}`}
              rows={2}
              defaultValue={item}
            />
          </Input.Field>
        </Form.Field>
      ))}
    </div>
  );
}

export default function LegalPageEditModal({ open, page, onClose, onSave }) {
  if (!open || !page) return null;

  const handleSave = (event) => {
    event?.preventDefault?.();
    onSave(event.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <div className={drawerStyles.headerMeta}>
          <span className={drawerStyles.headerIcon} aria-hidden="true">
            <AdminIcon name="legal" size={18} />
          </span>
          <Badge status="info">Preview mode</Badge>
        </div>
        <h2 id="legal-page-modal-title" className={drawerStyles.modalTitle}>
          Edit {page.title}
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Fields match the current legal page data model. Changes are preview-only.
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
      scrollable
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="legal-page-modal-title"
    >
      <Form key={page.id} onSubmit={handleSave} className={`${drawerStyles.form} ${styles.form}`}>
        <div className={styles.pageContext}>
          <div className={styles.pageContextMain}>
            <span className={styles.pageContextLabel}>Document</span>
            <span className={styles.pageContextName}>{page.title}</span>
            <code className={styles.pageContextRoute}>/{page.slug}</code>
          </div>
          <Badge status={page.publicationStatus === 'published' ? 'published' : 'draft'}>
            {page.publicationStatus}
          </Badge>
        </div>

        <Form.Section title="Page Details">
          <Form.Field label="Title" htmlFor="page-title">
            <Input.Field>
              <input
                id="page-title"
                name="page-title"
                type="text"
                className={inputStyles.input}
                defaultValue={page.title}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Slug" htmlFor="page-slug">
            <Input.Field>
              <input
                id="page-slug"
                name="page-slug"
                type="text"
                className={`${inputStyles.input} ${styles.readOnly}`}
                defaultValue={page.slug}
                readOnly
              />
            </Input.Field>
          </Form.Field>
          <Form.Row>
            <Form.Field label="Hero Heading" htmlFor="hero-label">
              <Input.Field>
                <input
                  id="hero-label"
                  name="hero-label"
                  type="text"
                  className={inputStyles.input}
                  defaultValue={page.hero.label}
                />
              </Input.Field>
            </Form.Field>
            <Form.Field label="Hero Title" htmlFor="hero-title">
              <Input.Field>
                <input
                  id="hero-title"
                  name="hero-title"
                  type="text"
                  className={inputStyles.input}
                  defaultValue={page.hero.title}
                />
              </Input.Field>
            </Form.Field>
          </Form.Row>
          <Form.Field label="Hero Description" htmlFor="hero-description">
            <Input.Field>
              <textarea
                id="hero-description"
                name="hero-description"
                className={`${inputStyles.input} ${styles.textarea}`}
                rows={3}
                defaultValue={page.hero.description}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Publication Status" htmlFor="publication-status">
            <Select
              id="publication-status"
              name="publication-status"
              defaultValue={page.publicationStatus}
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]}
              ariaLabel="Publication status"
            />
          </Form.Field>
        </Form.Section>

        <Form.Section title="SEO">
          <SeoDelegationNotice seoStatus={page.seoStatus} />
        </Form.Section>

        <Form.Section title="Document Content">
          {page.sections.map((section, index) => (
            <SectionFields key={section.id} page={page} section={section} index={index} />
          ))}
        </Form.Section>
      </Form>
    </Modal>
  );
}
