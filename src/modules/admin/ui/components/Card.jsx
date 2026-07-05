import styles from './Card.module.css';

const VARIANTS = ['standard', 'statistic', 'interactive', 'glass', 'panel', 'section'];

export default function Card({
  children,
  variant = 'standard',
  title,
  subtitle,
  header,
  footer,
  selected = false,
  onClick,
  className = '',
  ...rest
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'standard';

  const classNames = [
    styles.card,
    styles[safeVariant],
    selected ? styles.selected : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={classNames}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      {...rest}
    >
      {(header || title) && (
        <div className={styles.header}>
          {header || (
            <div>
              {title && <h3 className={styles.title}>{title}</h3>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  );
}

export function StatisticCard({ value, label, className = '', ...rest }) {
  return (
    <Card variant="statistic" className={className} {...rest}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </Card>
  );
}

Card.Statistic = StatisticCard;
