import styles from './PublicSectionSkeleton.module.css';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function SkeletonBlock({ className, style, 'aria-hidden': ariaHidden = true }) {
  return <div className={joinClasses(styles.block, className)} style={style} aria-hidden={ariaHidden} />;
}

export function SkeletonLine({ width = '100%', className, style }) {
  return (
    <SkeletonBlock
      className={joinClasses(styles.line, className)}
      style={{ width, ...style }}
    />
  );
}

export function SkeletonCircle({ size = 48, className, style }) {
  return (
    <SkeletonBlock
      className={joinClasses(styles.circle, className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export function SkeletonCard({ className, style, children }) {
  return (
    <div className={joinClasses(styles.card, className)} style={style} aria-hidden="true">
      {children}
    </div>
  );
}

export function PublicSectionSkeleton({ type = 'lines', lines = 3, className }) {
  if (type === 'lines') {
    const widths = ['38%', '72%', '58%', '64%', '48%'];
    return (
      <div className={className} aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => (
          <SkeletonLine
            key={index}
            width={widths[index % widths.length]}
            style={{ marginBottom: index < lines - 1 ? '0.75rem' : 0 }}
          />
        ))}
      </div>
    );
  }

  if (type === 'heading') {
    return (
      <div className={className} aria-hidden="true">
        <SkeletonLine width="28%" style={{ height: '0.65rem', marginBottom: '0.85rem' }} />
        <SkeletonLine width="52%" style={{ height: '1.75rem', marginBottom: '0.85rem' }} />
        <SkeletonLine width="68%" />
        <SkeletonLine width="58%" style={{ marginTop: '0.55rem' }} />
      </div>
    );
  }

  return null;
}

export default PublicSectionSkeleton;
