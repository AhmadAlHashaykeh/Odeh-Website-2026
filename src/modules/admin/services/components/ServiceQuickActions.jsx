import { OverflowMenu } from '../../ui';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'toggle-visibility', label: 'Show / Hide', icon: 'external' },
  { id: 'toggle-homepage', label: 'Toggle Homepage Visibility', icon: 'home' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function ServiceQuickActions({ service, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(service.id);
    else onAction?.(actionId, service);
  };

  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${service.title}`}
      onAction={handleAction}
      triggerVariant="dark"
    />
  );
}
