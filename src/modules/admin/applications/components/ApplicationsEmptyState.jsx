import { EmptyState } from '../../ui';

export default function ApplicationsEmptyState() {
  return (
    <EmptyState
      variant="featured"
      icon="applications"
      title="No applications yet"
      description="Applications will appear here once candidates submit forms through the public careers pages. When candidates apply, you can review, organize, and track their progress from this workspace."
    />
  );
}
