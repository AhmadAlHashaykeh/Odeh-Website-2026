import { useEffect, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import styles from './UserQuickActions.module.css';

function getActions(user) {
  const base = [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
  ];

  if (user.status === 'invited') {
    base.push({ id: 'resend-invite', label: 'Resend Invite', icon: 'messages' });
  }

  if (user.status === 'active') {
    base.push({ id: 'suspend', label: 'Suspend', icon: 'external' });
  } else if (user.status === 'suspended') {
    base.push({ id: 'activate', label: 'Activate', icon: 'check' });
  }

  base.push(
    { id: 'reset-password', label: 'Reset Password', icon: 'settings' },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  );

  return base;
}

export default function UserQuickActions({ user, onView, onAction }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const actions = getActions(user);

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
    if (actionId === 'view') onView?.(user.id);
    else onAction?.(actionId, user);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Actions for ${user.fullName}`}
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
