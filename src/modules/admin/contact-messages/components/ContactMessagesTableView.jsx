import MessageQuickActions, { MessageStatusBadge, MessagePriorityBadge } from './MessageQuickActions';
import { inquiryTypeLabels } from '../mock/contactMessagesData';
import styles from './ContactMessagesTableView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContactMessagesTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onMessageClick,
  onViewMessage,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all messages on this page"
              />
            </th>
            <th>Sender</th>
            <th>Subject</th>
            <th>Inquiry Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Submitted Date</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((msg) => (
            <tr
              key={msg.id}
              className={`${styles.row} ${selectedIds.has(msg.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(msg.id)}
                  onChange={() => onToggleSelect(msg.id)}
                  aria-label={`Select ${msg.senderName}`}
                />
              </td>
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
              <td className={styles.muted}>
                {inquiryTypeLabels[msg.inquiryType] || msg.inquiryType}
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
