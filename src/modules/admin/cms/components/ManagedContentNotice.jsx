import CmsModuleShortcut from './CmsModuleShortcut';
import styles from './ManagedContentNotice.module.css';

export default function ManagedContentNotice({
  title,
  description,
  managePath,
  manageLabel,
  icon = 'external',
  children,
}) {
  return (
    <div className={styles.notice}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
      {children ? <div className={styles.preview}>{children}</div> : null}
      <CmsModuleShortcut
        title={manageLabel}
        description={`Edit this content in its dedicated module.`}
        path={managePath}
        icon={icon}
      />
    </div>
  );
}
