import { OverflowMenu } from '../../ui';
import {
  contactMessageStatusLabels,
  contactMessagePriorityLabels,
} from '../mock/contactMessagesConfig';
import styles from './MessageQuickActions.module.css';

function buildActions(message) {
  const statusActions = [
    { id: 'mark-in-progress', label: 'Mark In Progress', icon: 'eye' },
    { id: 'mark-resolved', label: 'Mark as Resolved', icon: 'check' },
  ].filter((action) => {
    if (action.id === 'mark-in-progress' && message.status !== 'new') return false;
    if (action.id === 'mark-resolved' && message.status === 'resolved') return false;
    return true;
  });

  return [
    { id: 'view', label: 'View', icon: 'eye' },
    ...statusActions,
    { id: 'assign', label: 'Assign', icon: 'team' },
    { id: 'add-note', label: 'Add Note', icon: 'edit' },
    { id: 'copy-email', label: 'Copy Email', icon: 'messages' },
  ];
}

export default function MessageQuickActions({ message, onView, onAction }) {
  const handleAction = (actionId) => {
    if (actionId === 'view') {
      onView?.(message.id);
      return;
    }

    onAction?.(actionId, message);
  };

  return (
    <OverflowMenu
      items={buildActions(message)}
      ariaLabel={`Actions for ${message.senderName}`}
      onAction={handleAction}
      triggerVariant="dark"
    />
  );
}

export function MessageStatusBadge({ status }) {
  const label = contactMessageStatusLabels[status] || status;
  const config = {
    new: styles.new,
    in_progress: styles.inProgress,
    resolved: styles.resolved,
  }[status] || styles.inProgress;

  return <span className={`${styles.statusBadge} ${config}`}>{label}</span>;
}

export function MessagePriorityBadge({ priority }) {
  const label = contactMessagePriorityLabels[priority] || priority;
  const config = {
    normal: styles.priorityNormal,
    high: styles.priorityHigh,
    urgent: styles.priorityUrgent,
  }[priority] || styles.priorityNormal;

  return <span className={`${styles.priorityBadge} ${config}`}>{label}</span>;
}
