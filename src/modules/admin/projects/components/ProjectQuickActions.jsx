import { OverflowMenu } from '../../ui';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'gallery', label: 'Manage Gallery', icon: 'images' },
  { id: 'publish', label: 'Publish / Unpublish', icon: 'external' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function ProjectQuickActions({ project, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(project.id);
    else onAction?.(actionId, project);
  };

  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${project.title}`}
      onAction={handleAction}
    />
  );
}
