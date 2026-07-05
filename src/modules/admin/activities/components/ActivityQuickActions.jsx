import { useEffect, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import styles from './ActivityQuickActions.module.css';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'feature', label: 'Feature / Unfeature', icon: 'star' },
  { id: 'publish', label: 'Publish / Unpublish', icon: 'external' },
  { id: 'gallery', label: 'Manage Gallery', icon: 'images' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function ActivityQuickActions({ activity, onView, onAction }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleAction = (actionId) => {
    setOpen(false);
    if (actionId === 'view') onView?.(activity.id);
    else onAction?.(actionId, activity);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${activity.title}`}
        aria-expanded={open}
      >
        <AdminIcon name="more" size={16} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${action.danger ? styles.danger : ''}`}
              onClick={() => handleAction(action.id)}
            >
              <AdminIcon name={action.icon} size={15} />
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
