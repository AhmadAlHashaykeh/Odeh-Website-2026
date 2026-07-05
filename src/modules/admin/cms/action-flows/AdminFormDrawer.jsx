import { useMemo } from 'react';
import { Modal, Button, Form, Badge, Input, Select } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import { SeoDelegationNotice } from '../components';
import { CoverImageField, GalleryPlaceholder } from './PlaceholderFieldGroup';
import { MODULE_FORM_SCHEMAS } from './moduleFormSchemas';
import { mapItemToFormValues } from './mapItemToForm';
import inputStyles from '../../ui/components/Input.module.css';
import styles from './AdminFormDrawer.module.css';

const FULL_WIDTH_TYPES = new Set(['textarea', 'cover', 'gallery']);

function isFullWidth(field) {
  return field.fullWidth || FULL_WIDTH_TYPES.has(field.type);
}

function groupFieldsIntoRows(fields) {
  const rows = [];
  let currentRow = [];

  fields.forEach((field) => {
    if (isFullWidth(field)) {
      if (currentRow.length) {
        rows.push(currentRow);
        currentRow = [];
      }
      rows.push([field]);
      return;
    }

    currentRow.push(field);
    if (currentRow.length === 2) {
      rows.push(currentRow);
      currentRow = [];
    }
  });

  if (currentRow.length) rows.push(currentRow);
  return rows;
}

function renderSelect(field, value) {
  const options = (field.options || []).map((opt) => ({ value: opt, label: opt }));

  return (
    <Select
      id={field.name}
      name={field.name}
      defaultValue={value || options[0]?.value}
      options={options}
      ariaLabel={field.label}
    />
  );
}

function renderField(field, values) {
  const value = values[field.name] ?? '';

  switch (field.type) {
    case 'textarea':
      return (
        <Input.Field>
          <textarea
            id={field.name}
            name={field.name}
            className={`${inputStyles.input} ${inputStyles.textarea}`}
            defaultValue={value}
            rows={field.rows || 4}
          />
        </Input.Field>
      );
    case 'select':
      return renderSelect(field, value);
    case 'number':
      return (
        <Input.Field>
          <input
            id={field.name}
            name={field.name}
            type="number"
            className={inputStyles.input}
            defaultValue={value}
          />
        </Input.Field>
      );
    case 'cover':
      return (
        <CoverImageField
          label={field.label}
          src={typeof value === 'string' ? value : ''}
          alt={values.title || values.fullName || 'Cover'}
        />
      );
    case 'gallery':
      return (
        <GalleryPlaceholder
          label={field.label}
          images={Array.isArray(value) ? value : []}
        />
      );
    default:
      return (
        <Input.Field>
          <input
            id={field.name}
            name={field.name}
            type="text"
            className={inputStyles.input}
            defaultValue={value}
          />
        </Input.Field>
      );
  }
}

function renderFieldGroup(field, values) {
  if (field.type === 'cover' || field.type === 'gallery') {
    return (
      <div key={field.name} className={styles.mediaField}>
        {renderField(field, values)}
      </div>
    );
  }

  return (
    <Form.Field
      key={field.name}
      label={field.label}
      required={field.required}
      helper={field.helper}
      htmlFor={field.name}
    >
      {renderField(field, values)}
    </Form.Field>
  );
}

export default function AdminFormDrawer({
  open,
  onClose,
  moduleKey,
  mode = 'add',
  item = null,
  onSave,
}) {
  const schema = MODULE_FORM_SCHEMAS[moduleKey];
  const values = useMemo(
    () => (mode === 'edit' ? mapItemToFormValues(moduleKey, item) : {}),
    [moduleKey, mode, item],
  );

  const title = mode === 'edit' ? schema?.editTitle : schema?.addTitle;
  const formKey = `${moduleKey}-${mode}-${item?.id ?? 'new'}`;

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.();
  };

  if (!schema) return null;

  const modalHeader = (
    <div className={styles.modalHeader}>
      <div className={styles.headerContent}>
        {schema.badge && (
          <Badge variant="info" className={styles.moduleBadge}>
            {schema.badge}
          </Badge>
        )}
        <h2 id="admin-form-modal-title" className={styles.modalTitle}>
          {title}
        </h2>
        {schema.subtitle && (
          <p className={styles.modalSubtitle}>{schema.subtitle}</p>
        )}
      </div>
      <button
        type="button"
        className={styles.closeBtn}
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
        {mode === 'edit' ? 'Save Changes' : 'Save Item'}
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
      ariaLabelledBy="admin-form-modal-title"
    >
      <Form key={formKey} onSubmit={handleSave} className={styles.form}>
        {schema.sections.map((section) => (
          <Form.Section key={section.title} title={section.title}>
            {groupFieldsIntoRows(section.fields).map((row, rowIndex) => {
              if (row.length === 1) {
                return renderFieldGroup(row[0], values);
              }

              return (
                <Form.Row key={`${section.title}-row-${rowIndex}`}>
                  {row.map((field) => renderFieldGroup(field, values))}
                </Form.Row>
              );
            })}
          </Form.Section>
        ))}
        {schema.seoDelegation && (
          <Form.Section title="SEO">
            <SeoDelegationNotice
              seoStatus={item?.seoStatus ?? 'pending'}
              compact
            />
          </Form.Section>
        )}
      </Form>
    </Modal>
  );
}
