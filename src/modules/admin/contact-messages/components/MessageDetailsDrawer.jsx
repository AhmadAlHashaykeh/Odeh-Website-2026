import { useEffect } from 'react';
import AdminIcon from '../../components/AdminIcons';
import {
  contactMessageStatusLabels,
  contactMessagePriorityLabels,
} from '../mock/contactMessagesConfig';
import { MessageStatusBadge, MessagePriorityBadge } from './MessageQuickActions';
import styles from './MessageDetailsDrawer.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimestamp(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function MetaRow({ label, value }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value}</span>
    </div>
  );
}

function TimelineIcon({ type }) {
  const icons = {
    submitted: 'messages',
    in_progress: 'eye',
    resolved: 'check',
    assigned: 'team',
    note: 'edit',
    system: 'sort',
  };

  return <AdminIcon name={icons[type] || 'sort'} size={14} />;
}

export default function MessageDetailsDrawer({
  message,
  onClose,
  onMarkInProgress,
  onMarkResolved,
  onAssign,
  onAddNote,
  onCopyEmail,
}) {
  useEffect(() => {
    if (!message) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    const adminScroll = document.querySelector('[data-admin-scroll]');
    const previousAdminOverflow = adminScroll?.style.overflow ?? '';
    if (adminScroll) adminScroll.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (adminScroll) adminScroll.style.overflow = previousAdminOverflow;
    };
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={styles.heroInfo}>
            <span className={styles.initials}>
              {message.senderName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
            <h2 id="message-drawer-title" className={styles.title}>{message.senderName}</h2>
            <span className={styles.subjectRef}>{message.subject}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <MessageStatusBadge status={message.status} />
            <MessagePriorityBadge priority={message.priority} />
            <span className={styles.sourceBadge}>{message.sourcePage}</span>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <AdminIcon name="messages" size={16} />
                <div>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{message.email}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="connect" size={16} />
                <div>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{message.phone}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="projects" size={16} />
                <div>
                  <span className={styles.infoLabel}>Company</span>
                  <span className={styles.infoValue}>{message.company}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="team" size={16} />
                <div>
                  <span className={styles.infoLabel}>Assigned To</span>
                  <span className={styles.infoValue}>{message.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Inquiry Details</h3>
            <div className={styles.inquiryCard}>
              <span className={styles.inquirySubject}>{message.subject}</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Message</h3>
            <p className={styles.messageBody}>{message.message}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Message Timeline
              <span className={styles.count}>{message.timeline.length}</span>
            </h3>
            <ol className={styles.timeline}>
              {message.timeline.map((event, index) => (
                <li key={event.id} className={styles.timelineItem}>
                  <div className={`${styles.timelineDot} ${index === 0 ? styles.active : ''}`}>
                    <TimelineIcon type={event.type} />
                  </div>
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>{event.label}</span>
                    <span className={styles.timelineDesc}>{event.description}</span>
                    <time className={styles.timelineTime}>{formatTimestamp(event.timestamp)}</time>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {message.notes.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Internal Notes
                <span className={styles.count}>{message.notesCount}</span>
              </h3>
              <ul className={styles.notesList}>
                {message.notes.map((note) => (
                  <li key={note.id} className={styles.noteItem}>
                    <div className={styles.noteHeader}>
                      <span className={styles.noteAuthor}>{note.author}</span>
                      <time className={styles.noteTime}>{formatTimestamp(note.createdAt)}</time>
                    </div>
                    <p className={styles.noteContent}>{note.content}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Message ID" value={`#${message.id}`} />
              <MetaRow label="Priority" value={contactMessagePriorityLabels[message.priority]} />
              <MetaRow label="Status" value={contactMessageStatusLabels[message.status]} />
              <MetaRow label="Source Page" value={message.sourcePage} />
              <MetaRow label="Submitted" value={formatDate(message.submittedDate)} />
              <MetaRow label="Last Updated" value={formatTimestamp(message.lastUpdated)} />
              <MetaRow label="Assigned To" value={message.assignedTo || 'Unassigned'} />
              <MetaRow label="Notes Count" value={message.notesCount} />
            </div>
          </section>

          <div className={styles.drawerActions}>
            {message.status === 'new' && (
              <button
                type="button"
                className={styles.drawerActionBtn}
                onClick={() => onMarkInProgress?.(message)}
              >
                <AdminIcon name="eye" size={15} />
                Mark In Progress
              </button>
            )}
            {message.status !== 'resolved' && (
              <button
                type="button"
                className={styles.drawerActionBtn}
                onClick={() => onMarkResolved?.(message)}
              >
                <AdminIcon name="check" size={15} />
                Mark as Resolved
              </button>
            )}
            <button type="button" className={styles.drawerActionBtn} onClick={() => onAssign?.(message)}>
              <AdminIcon name="team" size={15} />
              Assign
            </button>
            <button type="button" className={styles.drawerActionBtn} onClick={() => onAddNote?.(message)}>
              <AdminIcon name="edit" size={15} />
              Add Note
            </button>
            <button type="button" className={styles.drawerActionBtn} onClick={() => onCopyEmail?.(message)}>
              <AdminIcon name="messages" size={15} />
              Copy Email
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
