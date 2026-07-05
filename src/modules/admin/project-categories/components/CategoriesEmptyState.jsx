import { EmptyState } from '../../ui';

export default function CategoriesEmptyState({ onCreateCategory }) {
  return (
    <EmptyState
      variant="featured"
      icon="categories"
      title="No categories match your filters"
      description="Your portfolio organizer is empty or the current search and filters exclude all categories. Create your first category to begin curating the architectural portfolio."
      action={{
        label: 'Create First Category',
        icon: 'add',
        onClick: onCreateCategory,
      }}
    />
  );
}
