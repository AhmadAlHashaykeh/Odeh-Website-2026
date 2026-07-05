import styles from './Input.module.css';

const SIZES = ['sm', 'md', 'lg'];

function InputField({
  label,
  required = false,
  helper,
  error,
  size = 'md',
  state,
  icon,
  iconRight,
  className = '',
  inputClassName = '',
  id,
  children,
  ...inputProps
}) {
  const safeSize = SIZES.includes(size) ? size : 'md';
  const fieldId = id || inputProps.name;

  const fieldClasses = [
    styles.field,
    styles[safeSize],
    state === 'error' || error ? styles.error : '',
    state === 'success' ? styles.success : '',
    icon ? styles.withIcon : '',
    iconRight ? styles.withIconRight : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children || (
          <input
            id={fieldId}
            className={`${styles.input} ${inputClassName}`}
            aria-invalid={!!error || undefined}
            aria-describedby={
              error ? `${fieldId}-error` : helper ? `${fieldId}-helper` : undefined
            }
            {...inputProps}
          />
        )}
        {iconRight && <span className={`${styles.icon} ${styles.iconRight}`}>{iconRight}</span>}
      </div>
      {error && (
        <span id={`${fieldId}-error`} className={styles.errorMsg} role="alert">
          {error}
        </span>
      )}
      {!error && helper && (
        <span id={`${fieldId}-helper`} className={styles.helper}>
          {helper}
        </span>
      )}
    </div>
  );
}

export default function Input({
  type = 'text',
  size = 'md',
  ...props
}) {
  const isSearch = type === 'search';

  return (
    <InputField
      size={size}
      className={isSearch ? styles.search : ''}
      {...props}
    >
      <input
        type={type}
        className={styles.input}
        {...(props.id ? { id: props.id } : {})}
        {...(props.name ? { name: props.name } : {})}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
        aria-label={props['aria-label']}
        aria-invalid={props.error ? true : undefined}
      />
    </InputField>
  );
}

function Textarea({ rows = 4, size = 'md', className = '', ...props }) {
  return (
    <InputField size={size} className={className} {...props}>
      <textarea
        rows={rows}
        className={`${styles.input} ${styles.textarea}`}
        {...(props.id ? { id: props.id } : {})}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        readOnly={props.readOnly}
      />
    </InputField>
  );
}

Input.Textarea = Textarea;
Input.Field = InputField;
