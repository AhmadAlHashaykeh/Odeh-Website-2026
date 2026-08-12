import { useMemo, useRef, useState } from 'react';
import { Modal, Button, Form, Badge, Input, Select } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import { SeoDelegationNotice } from '../components';
import { CoverImageField, GalleryPlaceholder } from './PlaceholderFieldGroup';
import { MODULE_FORM_SCHEMAS } from './moduleFormSchemas';
import { mapItemToFormValues } from './mapItemToForm';
import { getFirstFieldError } from './formErrors';
import { resolveUploadModule } from './uploadModuleMap';
import inputStyles from '../../ui/components/Input.module.css';
import styles from './AdminFormDrawer.module.css';

const FULL_WIDTH_TYPES = new Set(['textarea', 'cover', 'gallery', 'notice', 'color']);

function parseGalleryValue(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

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

function ColorBorderField({ field, value, values, error, disabled }) {
  const initial = value || '#7a7f85';
  const [color, setColor] = useState(initial);
  const [previewTitle, setPreviewTitle] = useState(
    values[field.previewTitleField] || values.name || 'Category Name',
  );

  return (
    <div className={styles.colorField}>
      <Input.Field error={error}>
        <div className={styles.colorControls}>
          <input
            type="color"
            className={styles.colorPicker}
            value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#7a7f85'}
            disabled={disabled}
            aria-label={`${field.label} picker`}
            onChange={(event) => {
              setColor(event.target.value);
              const nameInput = document.getElementById(field.previewTitleField || 'name');
              if (nameInput?.value) setPreviewTitle(nameInput.value);
            }}
          />
          <input
            id={field.name}
            name={field.name}
            type="text"
            className={inputStyles.input}
            value={color}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            onChange={(event) => {
              setColor(event.target.value);
              const nameInput = document.getElementById(field.previewTitleField || 'name');
              if (nameInput?.value) setPreviewTitle(nameInput.value);
            }}
            placeholder="#c9a66b"
          />
        </div>
      </Input.Field>

      <div
        className={styles.borderPreview}
        style={{ '--preview-border': color || '#7a7f85' }}
        aria-live="polite"
      >
        <p className={styles.borderPreviewTitle}>{previewTitle || 'Category Name'}</p>
        <div className={styles.borderPreviewBar} aria-hidden="true" />
        <p className={styles.borderPreviewHint}>Border Preview</p>
      </div>
    </div>
  );
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

function renderField(field, values, fieldErrors, disabled, uploadModule, onUploadingChange) {
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
    case 'color':
      return (
        <ColorBorderField
          field={field}
          value={value}
          values={values}
          error={error}
          disabled={disabled}
        />
      );
    case 'cover':
      return (
        <CoverImageField
          label={field.label}
          name={field.name}
          src={typeof value === 'string' ? value : ''}
          alt={values.title || values.fullName || values.name || 'Cover'}
          uploadModule={uploadModule}
          uploadField={field.name}
          disabled={disabled}
          onUploadingChange={onUploadingChange}
        />
      );
    case 'gallery':
      return (
        <GalleryPlaceholder
          label={field.label}
          name={field.name}
          images={Array.isArray(value) ? value : parseGalleryValue(value)}
          uploadModule={uploadModule}
          uploadField={field.name}
          disabled={disabled}
          onUploadingChange={onUploadingChange}
        />
      );
    case 'notice':
      return (
        <div className={styles.fieldNotice} role="note">
          {field.title && <p className={styles.fieldNoticeTitle}>{field.title}</p>}
          <p className={styles.fieldNoticeText}>{field.content}</p>
        </div>
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
            onInput={
              field.name === 'name'
                ? (event) => {
                    const preview = document.querySelector(`.${styles.borderPreviewTitle}`);
                    if (preview) preview.textContent = event.target.value || 'Category Name';
                  }
                : undefined
            }
          />
        </Input.Field>
      );
  }
}

function renderFieldGroup(field, values, fieldErrors, disabled, uploadModule, onUploadingChange) {
  const error = getFirstFieldError(fieldErrors, field.name);

  if (field.type === 'cover' || field.type === 'gallery') {
    return (
      <div key={field.name} className={styles.mediaField}>
        {renderField(field, values, fieldErrors, disabled, uploadModule, onUploadingChange)}
      </div>
    );
  }

  if (field.type === 'notice') {
    return (
      <div key={field.name || field.title} className={styles.mediaField}>
        {renderField(field, values, fieldErrors, disabled, uploadModule, onUploadingChange)}
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
      {renderField(field, values, fieldErrors, disabled, uploadModule, onUploadingChange)}
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
  const [activeUploads, setActiveUploads] = useState(0);
  const schema = MODULE_FORM_SCHEMAS[moduleKey];
  const uploadModule = resolveUploadModule(moduleKey);
  const isUploading = activeUploads > 0;
  const saveDisabled = submitting || isUploading;

  const handleUploadingChange = (uploading) => {
    setActiveUploads((count) => Math.max(0, count + (uploading ? 1 : -1)));
  };
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
        disabled={saveDisabled}
      >
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={saveDisabled}>
        Cancel
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="check" size={16} />}
        onClick={handleSave}
        loading={submitting}
        disabled={saveDisabled}
      >
        {isUploading ? 'Uploading Image…' : mode === 'edit' ? 'Save Changes' : 'Save Item'}
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
                return renderFieldGroup(
                  row[0],
                  values,
                  fieldErrors,
                  saveDisabled,
                  uploadModule,
                  handleUploadingChange,
                );
              }

              return (
                <Form.Row key={`${section.title}-row-${rowIndex}`}>
                  {row.map((field) =>
                    renderFieldGroup(
                      field,
                      values,
                      fieldErrors,
                      saveDisabled,
                      uploadModule,
                      handleUploadingChange,
                    ),
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
