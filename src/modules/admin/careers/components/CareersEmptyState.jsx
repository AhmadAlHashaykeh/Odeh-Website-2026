import { EmptyState } from '../../ui';

export default function CareersEmptyState({ onAddJob }) {
  return (
    <EmptyState
      variant="featured"
      icon="careers"
      title="No job listings found"
      description="Your careers catalog is empty or no jobs match the current filters. Add your first job opening to start building your hiring pipeline."
      action={{
        label: 'Add First Job',
        icon: 'add',
        onClick: onAddJob,
      }}
    />
  );
}
