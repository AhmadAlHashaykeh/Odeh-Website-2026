import { EmptyState } from '../../ui';

export default function ProjectsEmptyState({ onAddProject }) {
  return (
    <EmptyState
      variant="featured"
      icon="projects"
      title="No projects found"
      description="Your portfolio is empty or no projects match the current filters. Start building your architectural showcase by adding your first project."
      action={{
        label: 'Add Project',
        icon: 'add',
        onClick: onAddProject,
      }}
    />
  );
}
