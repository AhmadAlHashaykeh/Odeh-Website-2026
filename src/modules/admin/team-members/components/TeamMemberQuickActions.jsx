import { OverflowMenu } from '../../ui';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'toggle-visibility', label: 'Hide / Show', icon: 'external' },
  { id: 'copy-email', label: 'Copy Email', icon: 'copy' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function TeamMemberQuickActions({ member, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(member.id);
    else onAction?.(actionId, member);
  };

  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${member.fullName}`}
      onAction={handleAction}
    />
  );
}
