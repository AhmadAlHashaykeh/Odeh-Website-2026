import { EmptyState } from '../../ui';

export default function TeamMembersEmptyState({ onAddMember }) {
  return (
    <EmptyState
      variant="featured"
      icon="team"
      title="No team members found"
      description="Your team directory is empty or no members match the current filters. Add your first profile to showcase the people behind ODEH & PARTNERS DESIGN."
      action={{
        label: 'Add First Team Member',
        icon: 'add',
        onClick: onAddMember,
      }}
    />
  );
}
