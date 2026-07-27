import { OverflowMenu } from '../../ui';

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
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(user.id);
    else onAction?.(actionId, user);
  };

  return (
    <OverflowMenu
      items={getActions(user)}
      ariaLabel={`Actions for ${user.fullName}`}
      onAction={handleAction}
    />
  );
}
