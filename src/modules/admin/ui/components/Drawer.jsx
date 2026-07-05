import { useEffect } from 'react';
import AdminIcon from '../../components/AdminIcons';
import styles from './Drawer.module.css';

function useDrawerLock(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
}

export function DrawerHeader({
  title,
  onClose,
  sticky = false,
  children,
  className = '',
}) {
  return (
    <div className={`${styles.header} ${sticky ? styles.headerSticky : ''} ${className}`}>
      {title && <h2 className={styles.headerTitle}>{title}</h2>}
      {children}
      {onClose && (
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={18} />
        </button>
      )}
    </div>
  );
}

export function DrawerFooter({
  children,
  sticky = true,
  className = '',
}) {
  return (
    <div className={`${styles.footer} ${sticky ? styles.footerSticky : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function Drawer({
  open,
  onClose,
  title,
  size = 'default',
  stickyHeader = false,
  stickyFooter = true,
  flush = false,
  header,
  footer,
  children,
  className = '',
}) {
  useDrawerLock(open, onClose);

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} role="presentation" onClick={onClose} />
      <aside
        className={`${styles.drawer} ${size === 'large' ? styles.large : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {header || (title && (
          <DrawerHeader title={title} onClose={onClose} sticky={stickyHeader} />
        ))}
        <div className={`${styles.body} ${flush ? styles.bodyFlush : ''}`}>
          {children}
        </div>
        {footer && (
          <DrawerFooter sticky={stickyFooter}>{footer}</DrawerFooter>
        )}
      </aside>
    </>
  );
}

Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
