import { useEffect, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import styles from './JobQuickActions.module.css';

function buildActions(job) {
  const statusLabel = job.status === 'open' ? 'Close Job' : 'Open Job';

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'toggle-status', label: statusLabel, icon: 'external' },
    { id: 'view-applications', label: 'View Applications', icon: 'applications' },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  ];
}

export default function JobQuickActions({ job, onView, onAction }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = buildActions(job);

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
    if (actionId === 'view') onView?.(job.id);
    else onAction?.(actionId, job);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${job.title}`}
        aria-expanded={open}
      >
        <AdminIcon name="more" size={16} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {actions.map((action) => (
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
