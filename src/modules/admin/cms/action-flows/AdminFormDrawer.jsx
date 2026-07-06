import { useMemo, useRef } from 'react';
import { Modal, Button, Form, Badge, Input, Select } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import { SeoDelegationNotice } from '../components';
import { CoverImageField, GalleryPlaceholder } from './PlaceholderFieldGroup';
import { MODULE_FORM_SCHEMAS } from './moduleFormSchemas';
import { mapItemToFormValues } from './mapItemToForm';
import { getFirstFieldError } from './formErrors';
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

function renderSelect(field, value, error, disabled) {
  const options = (field.options || []).map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt,
  );

  return (
    <Select
      id={field.name}
      name={field.name}
      defaultValue={value || options[0]?.value}
      options={options}
      ariaLabel={field.label}
      disabled={disabled}
      error={error}
    />
  );
}

function renderField(field, values, fieldErrors, disabled) {
  const value = values[field.name] ?? '';
  const error = getFirstFieldError(fieldErrors, field.name);

  switch (field.type) {
    case 'textarea':
      return (
        <Input.Field error={error}>
          <textarea
            id={field.name}
            name={field.name}
            className={`${inputStyles.input} ${inputStyles.textarea}`}
            defaultValue={value}
            rows={field.rows || 4}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
          />
        </Input.Field>
      );
    case 'select':
      return renderSelect(field, value, error, disabled);
    case 'number':
      return (
        <Input.Field error={error}>
          <input
            id={field.name}
            name={field.name}
            type="number"
            className={inputStyles.input}
            defaultValue={value}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
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
        <Input.Field error={error}>
          <input
            id={field.name}
            name={field.name}
            type="text"
            className={inputStyles.input}
            defaultValue={value}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
          />
        </Input.Field>
      );
  }
}

function renderFieldGroup(field, values, fieldErrors, disabled) {
  const error = getFirstFieldError(fieldErrors, field.name);

  if (field.type === 'cover' || field.type === 'gallery') {
    return (
      <div key={field.name} className={styles.mediaField}>
        {renderField(field, values, fieldErrors, disabled)}
      </div>
    );
  }

  return (
    <Form.Field
      key={field.name}
      label={field.label}
      required={field.required}
      helper={field.helper}
      error={error}
      htmlFor={field.name}
    >
      {renderField(field, values, fieldErrors, disabled)}
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
  fieldErrors = {},
  submitting = false,
  fieldOptions = {},
}) {
  const formRef = useRef(null);
  const schema = MODULE_FORM_SCHEMAS[moduleKey];
  const values = useMemo(
    () => (mode === 'edit' ? mapItemToFormValues(moduleKey, item) : {}),
    [moduleKey, mode, item],
  );

  const resolvedSchema = useMemo(() => {
    if (!schema) return null;

    return {
      ...schema,
      sections: schema.sections.map((section) => ({
        ...section,
        fields: section.fields.map((field) => {
          if (fieldOptions[field.name]) {
            return { ...field, options: fieldOptions[field.name] };
          }
          return field;
        }),
      })),
    };
  }, [schema, fieldOptions]);

  const title = mode === 'edit' ? resolvedSchema?.editTitle : resolvedSchema?.addTitle;
  const formKey = `${moduleKey}-${mode}-${item?.id ?? 'new'}`;

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.(formRef.current);
  };

  if (!resolvedSchema) return null;

  const modalHeader = (
    <div className={styles.modalHeader}>
      <div className={styles.headerContent}>
        {resolvedSchema.badge && (
          <Badge variant="info" className={styles.moduleBadge}>
            {resolvedSchema.badge}
          </Badge>
        )}
        <h2 id="admin-form-modal-title" className={styles.modalTitle}>
          {title}
        </h2>
        {resolvedSchema.subtitle && (
          <p className={styles.modalSubtitle}>{resolvedSchema.subtitle}</p>
        )}
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close modal"
        disabled={submitting}
      >
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={submitting}>
        Cancel
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="check" size={16} />}
        onClick={handleSave}
        loading={submitting}
        disabled={submitting}
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
      <Form
        key={formKey}
        ref={formRef}
        onSubmit={handleSave}
        className={styles.form}
      >
        {resolvedSchema.sections.map((section) => (
          <Form.Section key={section.title} title={section.title}>
            {groupFieldsIntoRows(section.fields).map((row, rowIndex) => {
              if (row.length === 1) {
                return renderFieldGroup(row[0], values, fieldErrors, submitting);
              }

              return (
                <Form.Row key={`${section.title}-row-${rowIndex}`}>
                  {row.map((field) =>
                    renderFieldGroup(field, values, fieldErrors, submitting),
                  )}
                </Form.Row>
              );
            })}
          </Form.Section>
        ))}
        {resolvedSchema.seoDelegation && (
          <Form.Section title="SEO">
            <SeoDelegationNotice seoStatus={item?.seoStatus ?? 'pending'} compact />
          </Form.Section>
        )}
      </Form>
    </Modal>
  );
}
