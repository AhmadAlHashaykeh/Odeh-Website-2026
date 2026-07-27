import { OverflowMenu } from '../../ui';

const ACTIONS = [
  { id: 'view', label: 'View', icon: 'eye' },
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
  { id: 'disable', label: 'Disable', icon: 'external' },
  { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
];

export default function RoleQuickActions({ role, onAction }) {
  return (
    <OverflowMenu
      items={ACTIONS}
      ariaLabel={`Actions for ${role.name}`}
      onAction={(actionId) => onAction?.(actionId, role)}
    />
  );
}
