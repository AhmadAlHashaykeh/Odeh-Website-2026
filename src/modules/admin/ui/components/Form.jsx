import styles from './Form.module.css';

export function Form({ children, className = '', onSubmit, ...rest }) {
  return (
    <form
      className={`${styles.form} ${className}`}
      onSubmit={onSubmit}
      noValidate
      {...rest}
    >
      {children}
    </form>
  );
}

export function FormSection({ title, children, className = '' }) {
  return (
    <div className={`${styles.section} ${className}`}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

export function FormDivider({ className = '' }) {
  return <hr className={`${styles.divider} ${className}`} />;
}

export function FormField({ label, required, helper, error, children, className = '', htmlFor }) {
  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
      {!error && helper && (
        <span className={styles.helper}>{helper}</span>
      )}
    </div>
  );
}

export function FormRow({ children, className = '' }) {
  return <div className={`${styles.row} ${className}`}>{children}</div>;
}

export function FormActions({ children, className = '' }) {
  return <div className={`${styles.actions} ${className}`}>{children}</div>;
}

const FormCompound = Object.assign(Form, {
  Section: FormSection,
  Divider: FormDivider,
  Field: FormField,
  Row: FormRow,
  Actions: FormActions,
});

export default FormCompound;
