import { OverflowMenu } from '../../ui';

export default function TeamCategoryQuickActions({ category, onView, onAction }) {
  const actions = [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    {
      id: 'toggle-visibility',
      label: category.isActive ? 'Deactivate' : 'Activate',
      icon: 'eye',
    },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  ];

  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(category.id);
    else onAction?.(actionId, category);
  };

  return (
    <OverflowMenu
      items={actions}
      ariaLabel={`Actions for ${category.name}`}
      onAction={handleAction}
    />
  );
}
