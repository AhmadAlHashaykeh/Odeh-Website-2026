import { useEffect } from 'react';
import AdminIcon from '../../components/AdminIcons';
import { applicationStatusLabels } from '../mock/applicationsConfig';
import { ApplicationStatusBadge } from './ApplicationQuickActions';
import styles from './ApplicationDetailsDrawer.module.css';

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
    submitted: 'applications',
    reviewed: 'eye',
    shortlisted: 'star',
    rejected: 'close',
    hired: 'check',
    note: 'edit',
    system: 'sort',
  };

  return <AdminIcon name={icons[type] || 'sort'} size={14} />;
}

export default function ApplicationDetailsDrawer({ application, onClose, onStatusAction, onDownloadCv, onOpenLinkedIn, onAddNote }) {
  useEffect(() => {
    if (!application) return undefined;

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
  }, [application, onClose]);

  if (!application) return null;

  const linkedInValid = application.linkedInUrl?.startsWith('http');

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={styles.heroInfo}>
            <span className={styles.initials}>
              {application.applicantName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
            <h2 id="application-drawer-title" className={styles.title}>{application.applicantName}</h2>
            <span className={styles.jobRef}>{application.jobTitle}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <ApplicationStatusBadge status={application.status} />
            <span className={styles.sourceBadge}>{application.source}</span>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <AdminIcon name="messages" size={16} />
                <div>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{application.email}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="connect" size={16} />
                <div>
                  <span className={styles.infoLabel}>Phone</span>
                  <span className={styles.infoValue}>{application.phone}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="home" size={16} />
                <div>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>{application.location}</span>
                </div>
              </div>
              <div className={styles.infoCard}>
                <AdminIcon name="external" size={16} />
                <div>
                  <span className={styles.infoLabel}>LinkedIn</span>
                  {linkedInValid ? (
                    <a
                      href={application.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkValue}
                    >
                      View Profile
                    </a>
                  ) : (
                    <span className={styles.infoValue}>Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Applied Position</h3>
            <div className={styles.jobCard}>
              <span className={styles.jobCardTitle}>{application.jobTitle}</span>
              <span className={styles.jobCardDept}>{application.department}</span>
              <span className={styles.jobCardExp}>
                {application.yearsOfExperience} {application.yearsOfExperience === 1 ? 'year' : 'years'} experience
              </span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cover Letter</h3>
            <p className={styles.coverLetter}>{application.coverLetterPreview}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>CV / Resume</h3>
            <div className={styles.cvCard}>
              <div className={styles.cvIcon}>
                <AdminIcon name="export" size={20} />
              </div>
              <div className={styles.cvInfo}>
                <span className={styles.cvName}>{application.cvFileName}</span>
                <span className={styles.cvSize}>{application.cvFileSize}</span>
              </div>
              <button type="button" className={styles.cvBtn} onClick={() => onDownloadCv?.(application)}>
                Download
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Application Timeline
              <span className={styles.count}>{application.timeline.length}</span>
            </h3>
            <ol className={styles.timeline}>
              {application.timeline.map((event, index) => (
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

          {application.notes.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Internal Notes
                <span className={styles.count}>{application.notesCount}</span>
              </h3>
              <ul className={styles.notesList}>
                {application.notes.map((note) => (
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
            <h3 className={styles.sectionTitle}>Status Actions</h3>
            <div className={styles.statusActions}>
              {['reviewed', 'shortlisted', 'hired', 'rejected', 'new']
                .filter((s) => s !== application.status)
                .map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={styles.statusActionBtn}
                    onClick={() => onStatusAction?.(`status-${status}`, application)}
                  >
                    {status === 'new' ? 'Reset to New' : applicationStatusLabels[status]}
                  </button>
                ))}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Application ID" value={`#${application.id}`} />
              <MetaRow label="Job ID" value={application.jobId} />
              <MetaRow label="Department" value={application.department} />
              <MetaRow label="Source" value={application.source} />
              <MetaRow label="Submitted" value={formatDate(application.submittedDate)} />
              <MetaRow label="Last Updated" value={formatTimestamp(application.lastUpdated)} />
              <MetaRow label="Notes" value={application.notesCount} />
              <MetaRow label="Current Status" value={applicationStatusLabels[application.status]} />
            </div>
          </section>

          <div className={styles.drawerActions}>
            <button type="button" className={styles.drawerActionBtn} onClick={() => onAddNote?.(application)}>
              <AdminIcon name="edit" size={15} />
              Add Note
            </button>
            <button type="button" className={styles.drawerActionBtn} onClick={() => onOpenLinkedIn?.(application)}>
              <AdminIcon name="external" size={15} />
              Open LinkedIn
            </button>
            <button type="button" className={styles.drawerActionBtn} onClick={() => onDownloadCv?.(application)}>
              <AdminIcon name="export" size={15} />
              Download CV
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
