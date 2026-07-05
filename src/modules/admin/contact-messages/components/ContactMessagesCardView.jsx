import AdminIcon from '../../components/AdminIcons';
import MessageQuickActions, { MessageStatusBadge, MessagePriorityBadge } from './MessageQuickActions';
import { inquiryTypeLabels } from '../mock/contactMessagesData';
import styles from './ContactMessagesCardView.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContactMessagesCardView({
  items,
  selectedIds,
  onToggleSelect,
  onMessageClick,
  onViewMessage,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((msg) => (
        <article
          key={msg.id}
          className={`${styles.card} ${selectedIds.has(msg.id) ? styles.selected : ''}`}
        >
          <div className={styles.header}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedIds.has(msg.id)}
              onChange={() => onToggleSelect(msg.id)}
              aria-label={`Select ${msg.senderName}`}
            />
            <MessageQuickActions
              message={msg}
              onView={onViewMessage}
              onAction={onAction}
            />
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.nameBtn}
              onClick={() => onMessageClick(msg.id)}
            >
              <h3 className={styles.name}>{msg.senderName}</h3>
            </button>

            <span className={styles.subject}>{msg.subject}</span>
            <span className={styles.inquiryType}>
              {inquiryTypeLabels[msg.inquiryType] || msg.inquiryType}
            </span>

            <div className={styles.badges}>
              <MessagePriorityBadge priority={msg.priority} />
              <MessageStatusBadge status={msg.status} />
            </div>

            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <AdminIcon name="sort" size={13} />
                {formatDate(msg.submittedDate)}
              </span>
              <span className={styles.metaItem}>
                <AdminIcon name="team" size={13} />
                {msg.assignedTo || 'Unassigned'}
              </span>
            </div>

            <p className={styles.preview}>{msg.messagePreview}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
