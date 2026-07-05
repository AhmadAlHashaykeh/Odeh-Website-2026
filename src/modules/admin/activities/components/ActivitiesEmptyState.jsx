import { EmptyState } from '../../ui';

export default function ActivitiesEmptyState({ onAddActivity }) {
  return (
    <EmptyState
      variant="featured"
      icon="activities"
      title="No activities found"
      description="Your activities library is empty or no entries match the current filters. Start documenting company events, visits, and milestones by creating your first activity."
      action={{
        label: 'Create First Activity',
        icon: 'add',
        onClick: onAddActivity,
      }}
    />
  );
}
