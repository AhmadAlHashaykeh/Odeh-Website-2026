import { OverflowMenu } from '../../ui';
import { applicationStatusLabels } from '../mock/applicationsConfig';
import styles from './ApplicationQuickActions.module.css';

function buildActions(application) {
  const statusActions = [
    { id: 'status-reviewing', label: 'Mark as Reviewed', icon: 'eye' },
    { id: 'status-shortlisted', label: 'Shortlist', icon: 'star' },
    { id: 'status-hired', label: 'Hire', icon: 'check' },
    { id: 'status-rejected', label: 'Reject', icon: 'close' },
    { id: 'status-new', label: 'Reset to New', icon: 'refresh' },
  ].filter((action) => {
    const target = action.id.replace('status-', '');
    return target !== application.status;
  });

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    { id: 'change-status', label: 'Change Status', icon: 'filter', submenu: statusActions },
    { id: 'download-cv', label: 'Download CV', icon: 'export' },
    { id: 'open-linkedin', label: 'Open LinkedIn', icon: 'external' },
    { id: 'add-note', label: 'Add Note', icon: 'edit' },
    { id: 'delete', label: 'Delete', icon: 'trash', danger: true },
  ];
}

export default function ApplicationQuickActions({ application, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') {
      onView?.(application.id);
      return;
    }

    onAction?.(actionId, application);
  };

  return (
    <OverflowMenu
      items={buildActions(application)}
      ariaLabel={`Actions for ${application.applicantName}`}
      onAction={handleAction}
      triggerVariant="dark"
    />
  );
}

export function ApplicationStatusBadge({ status }) {
  const label = applicationStatusLabels[status] || status;
  const config = {
    new: styles.new,
    reviewing: styles.reviewing,
    shortlisted: styles.shortlisted,
    rejected: styles.rejected,
    hired: styles.hired,
  }[status] || styles.reviewing;

  return <span className={`${styles.statusBadge} ${config}`}>{label}</span>;
}
