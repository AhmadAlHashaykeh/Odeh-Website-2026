import { OverflowMenu } from '../../ui';

function buildActions(job) {
  const statusLabel = job.status === 'open' ? 'Close Job' : 'Open Job';

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'duplicate', label: 'Duplicate', icon: 'copy' },
    { id: 'toggle-status', label: statusLabel, icon: 'external' },
    { id: 'view-applications', label: 'View Applications', icon: 'applications' },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  ];
}

export default function JobQuickActions({ job, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') onView?.(job.id);
    else onAction?.(actionId, job);
  };

  return (
    <OverflowMenu
      items={buildActions(job)}
      ariaLabel={`Actions for ${job.title}`}
      onAction={handleAction}
      triggerVariant="dark"
    />
  );
}
