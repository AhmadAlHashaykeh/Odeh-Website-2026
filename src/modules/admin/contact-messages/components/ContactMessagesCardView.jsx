import AdminIcon from '../../components/AdminIcons';
import MessageQuickActions, { MessageStatusBadge, MessagePriorityBadge } from './MessageQuickActions';
import styles from './ContactMessagesCardView.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContactMessagesCardView({
  items,
  onMessageClick,
  onViewMessage,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((msg) => (
        <article key={msg.id} className={styles.card}>
          <div className={styles.header}>
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

            <p className={styles.preview}>{msg.message?.slice(0, 140)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
