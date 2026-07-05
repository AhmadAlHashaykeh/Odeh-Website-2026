import { useEffect, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input } from '../../ui';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './SeoEditModal.module.css';

function CharCounter({ value, min, max, label }) {
  const length = value?.length ?? 0;
  let tone = 'neutral';

  if (length === 0) tone = 'warn';
  else if (length < min || length > max) tone = 'warn';
  else tone = 'good';

  return (
    <span className={`${styles.counter} ${styles[tone]}`}>
      {length} / {max} {label}
    </span>
  );
}

function SearchSnippet({ title, description, route }) {
  const displayUrl = `odeh-partners.com${route === '/' ? '' : route}`;

  return (
    <div className={styles.snippet} aria-hidden="true">
      <span className={styles.snippetLabel}>Search preview</span>
      <div className={styles.snippetCard}>
        <div className={styles.snippetUrl}>{displayUrl}</div>
        <div className={styles.snippetTitle}>{title || 'Missing meta title'}</div>
        <p className={styles.snippetDescription}>
          {description || 'Missing meta description.'}
        </p>
      </div>
    </div>
  );
}

export default function SeoEditModal({ open, page, onClose, onSave }) {
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  useEffect(() => {
    if (page) {
      setMetaTitle(page.metaTitle ?? '');
      setMetaDescription(page.metaDescription ?? '');
    }
  }, [page]);

  if (!open || !page) return null;

  const handleSave = (event) => {
    event?.preventDefault?.();
    onSave({ metaTitle, metaDescription });
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <div className={drawerStyles.headerMeta}>
          <span className={drawerStyles.headerIcon} aria-hidden="true">
            <AdminIcon name="seo" size={18} />
          </span>
        </div>
        <h2 id="seo-edit-modal-title" className={drawerStyles.modalTitle}>
          Edit SEO
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          {page.name} · <code>{page.route}</code>
        </p>
      </div>
      <button type="button" className={drawerStyles.closeBtn} onClick={onClose} aria-label="Close">
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" icon={<AdminIcon name="check" size={16} />} onClick={handleSave}>
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
      ariaLabelledBy="seo-edit-modal-title"
    >
      <Form onSubmit={handleSave} className={`${drawerStyles.form} ${styles.form}`}>
        <div className={styles.fieldsHeader}>
          <span className={styles.fieldsLabel}>Page metadata</span>
          <p className={styles.fieldsHint}>
            These fields map to the document title and meta description on the public website.
          </p>
        </div>

        <Form.Field label="Meta Title" htmlFor="meta-title">
          <Input.Field>
            <input
              id="meta-title"
              name="meta-title"
              type="text"
              className={inputStyles.input}
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              autoComplete="off"
              autoFocus
            />
          </Input.Field>
          <CharCounter value={metaTitle} min={30} max={60} label="chars · aim for 50–60" />
        </Form.Field>

        <Form.Field label="Meta Description" htmlFor="meta-description">
          <Input.Field>
            <textarea
              id="meta-description"
              name="meta-description"
              className={`${inputStyles.input} ${styles.textarea}`}
              rows={4}
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
            />
          </Input.Field>
          <CharCounter value={metaDescription} min={70} max={160} label="chars · aim for 120–160" />
        </Form.Field>

        <SearchSnippet title={metaTitle} description={metaDescription} route={page.route} />
      </Form>
    </Modal>
  );
}
