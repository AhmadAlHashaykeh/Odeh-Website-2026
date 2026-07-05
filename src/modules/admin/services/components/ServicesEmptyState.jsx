import { EmptyState } from '../../ui';

export default function ServicesEmptyState({ onAddService }) {
  return (
    <EmptyState
      variant="featured"
      icon="services"
      title="No services found"
      description="Your services catalog is empty or no services match the current filters. Add your first service to showcase ODEH & PARTNERS DESIGN engineering offerings."
      action={{
        label: 'Add First Service',
        icon: 'add',
        onClick: onAddService,
      }}
    />
  );
}
