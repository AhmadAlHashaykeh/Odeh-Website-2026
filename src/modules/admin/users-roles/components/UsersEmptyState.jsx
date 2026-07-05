import { EmptyState } from '../../ui';
import AdminIcon from '../../components/AdminIcons';

export default function UsersEmptyState() {
  return (
    <EmptyState
      icon={<AdminIcon name="users" size={32} />}
      title="No admin users found"
      description="Try adjusting your search or filters, or invite a new team member to get started."
    />
  );
}
