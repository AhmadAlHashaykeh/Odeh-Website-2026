import { OverflowMenu } from '../../ui';

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
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(activity.id);
    else onAction?.(actionId, activity);
  };

  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${activity.title}`}
      onAction={handleAction}
    />
  );
}
