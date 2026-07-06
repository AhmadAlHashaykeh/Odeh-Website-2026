import MessageQuickActions, { MessageStatusBadge, MessagePriorityBadge } from './MessageQuickActions';
import styles from './ContactMessagesTableView.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContactMessagesTableView({
  items,
  onMessageClick,
  onViewMessage,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Submitted Date</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((msg) => (
            <tr key={msg.id} className={styles.row}>
              <td>
                <button
                  type="button"
                  className={styles.senderBtn}
                  onClick={() => onMessageClick(msg.id)}
                >
                  <span className={styles.name}>{msg.senderName}</span>
                  <span className={styles.email}>{msg.email}</span>
                  <span className={styles.phone}>{msg.phone}</span>
                </button>
              </td>
              <td className={styles.subjectCell}>
                <span className={styles.subject}>{msg.subject}</span>
              </td>
              <td><MessagePriorityBadge priority={msg.priority} /></td>
              <td><MessageStatusBadge status={msg.status} /></td>
              <td className={styles.muted}>
                {msg.assignedTo || <span className={styles.unassigned}>Unassigned</span>}
              </td>
              <td className={styles.muted}>{formatDate(msg.submittedDate)}</td>
              <td className={styles.actionsCol}>
                <MessageQuickActions
                  message={msg}
                  onView={onViewMessage}
                  onAction={onAction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
