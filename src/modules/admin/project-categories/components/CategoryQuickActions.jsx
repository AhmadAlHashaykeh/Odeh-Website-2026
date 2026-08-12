import { OverflowMenu } from '../../ui';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'hide', label: 'Hide', icon: 'eye' },
  { id: 'publish', label: 'Publish', icon: 'external' },
  { id: 'manage', label: 'Manage Projects', icon: 'projects' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function CategoryQuickActions({ category, onView, onAction, variant = 'default' }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(category.id);
    else onAction?.(actionId, category);
  };

  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${category.title}`}
      onAction={handleAction}
      triggerVariant={variant === 'overlay' ? 'overlay' : 'default'}
    />
  );
}
