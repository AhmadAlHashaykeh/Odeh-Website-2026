import { EmptyState } from '../../ui';
import AdminIcon from '../../components/AdminIcons';

export default function PermissionsEmptyState() {
  return (
    <EmptyState
      icon={<AdminIcon name="settings" size={32} />}
      title="No permissions data"
      description="Select a role to view its permission matrix across CMS modules."
    />
  );
}
