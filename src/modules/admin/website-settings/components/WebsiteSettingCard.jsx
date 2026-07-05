import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import styles from './WebsiteSettingCard.module.css';

export default function WebsiteSettingCard({
  title,
  description,
  fields = [],
  editable = false,
  onEdit,
  preview,
  managedNote,
  status,
}) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{title}</h2>
            {status && <Badge status={status}>{status}</Badge>}
          </div>
          {description && <p className={styles.desc}>{description}</p>}
        </div>
        {preview && <div className={styles.previewWrap}>{preview}</div>}
      </div>

      {fields.length > 0 && (
        <dl className={styles.fieldList}>
          {fields.map((field) => (
            <div key={field.label} className={styles.field}>
              <dt className={styles.fieldLabel}>{field.label}</dt>
              <dd className={`${styles.fieldValue} ${field.mono ? styles.mono : ''}`}>
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {managedNote && (
        <p className={styles.managedNote}>
          <AdminIcon name="navigation" size={14} />
          {managedNote}
        </p>
      )}

      {editable && onEdit && (
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            icon={<AdminIcon name="edit" size={14} />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      )}
    </article>
  );
}
