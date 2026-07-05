import { EmptyState } from '../../ui';

export default function RolesEmptyState({ onAddRole }) {
  return (
    <EmptyState
      icon="team"
      title="No roles defined"
      description="Create role definitions to organize permissions and access levels across the CMS."
      action={
        onAddRole
          ? { label: 'Add Role', icon: 'add', onClick: onAddRole }
          : undefined
      }
    />
  );
}
