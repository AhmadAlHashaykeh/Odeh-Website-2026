import { useEffect } from 'react';
import { SeoDelegationNotice } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import { isClosingSoon } from '../utils/jobUtils';
import styles from './JobDetailsDrawer.module.css';

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatUpdated(value) {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
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

function JobStatusBadge({ status }) {
  const config = {
    open: { label: 'Open', className: styles.open },
    closed: { label: 'Closed', className: styles.closed },
    draft: { label: 'Draft', className: styles.draft },
  }[status] || { label: status, className: styles.closed };

  return <span className={`${styles.statusBadge} ${config.className}`}>{config.label}</span>;
}

function PreviewList({ title, items, count }) {
  if (!items?.length) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>
        {title}
        <span className={styles.count}>{count ?? items.length}</span>
      </h3>
      <ul className={styles.previewList}>
        {items.slice(0, 4).map((item) => (
          <li key={item} className={styles.previewItem}>{item}</li>
        ))}
        {items.length > 4 && (
          <li className={styles.previewMore}>+{items.length - 4} more items</li>
        )}
      </ul>
    </section>
  );
}

export default function JobDetailsDrawer({ job, onClose }) {
  useEffect(() => {
    if (!job) return undefined;

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
  }, [job, onClose]);

  if (!job) return null;

  const closingSoon = job.status === 'open' && isClosingSoon(job.closingDate);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
          <AdminIcon name="close" size={20} />
        </button>

        <div className={styles.hero}>
          <div className={styles.heroPattern} aria-hidden="true" />
          <div className={styles.heroInfo}>
            <span className={styles.department}>{job.department}</span>
            <h2 id="job-drawer-title" className={styles.title}>{job.title}</h2>
            <span className={styles.slug}>/{job.slug}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <JobStatusBadge status={job.status} />
            {closingSoon && <span className={styles.closingSoon}>Closing Soon</span>}
            <span className={`${styles.seoBadge} ${styles[job.seoStatus]}`}>
              SEO {job.seoStatus === 'complete' ? 'Ready' : 'Pending'}
            </span>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <AdminIcon name="connect" size={16} />
              <div>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{job.location}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="careers" size={16} />
              <div>
                <span className={styles.infoLabel}>Employment Type</span>
                <span className={styles.infoValue}>{job.employmentType}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="home" size={16} />
              <div>
                <span className={styles.infoLabel}>Work Mode</span>
                <span className={styles.infoValue}>{job.workMode}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="team" size={16} />
              <div>
                <span className={styles.infoLabel}>Experience Level</span>
                <span className={styles.infoValue}>{job.experienceLevel}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="sort" size={16} />
              <div>
                <span className={styles.infoLabel}>Posted Date</span>
                <span className={styles.infoValue}>{formatDate(job.postedDate)}</span>
              </div>
            </div>
            <div className={styles.infoCard}>
              <AdminIcon name="filter" size={16} />
              <div>
                <span className={styles.infoLabel}>Closing Date</span>
                <span className={styles.infoValue}>{formatDate(job.closingDate)}</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Short Description</h3>
            <p className={styles.description}>{job.shortDescription}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Full Description</h3>
            <p className={styles.description}>{job.fullDescription}</p>
          </section>

          <PreviewList
            title="Responsibilities"
            items={job.responsibilities}
            count={job.responsibilitiesCount}
          />
          <PreviewList
            title="Requirements"
            items={job.requirements}
            count={job.requirementsCount}
          />
          <PreviewList
            title="Benefits"
            items={job.benefits}
            count={job.benefitsCount}
          />

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Applications Summary</h3>
            <div className={styles.applicationsCard}>
              <div className={styles.applicationsStat}>
                <span className={styles.applicationsCount}>{job.applicationsCount}</span>
                <span className={styles.applicationsLabel}>Total Applications</span>
              </div>
              <p className={styles.applicationsNote}>
                {job.status === 'open'
                  ? 'This position is actively receiving applications.'
                  : 'This position is no longer accepting applications.'}
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SEO</h3>
            <SeoDelegationNotice seoStatus={job.seoStatus} compact />
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Publication Status</h3>
            <div className={styles.visibilityRow}>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Listing Status</span>
                <JobStatusBadge status={job.status} />
              </div>
              <div className={styles.visibilityItem}>
                <span className={styles.visibilityLabel}>Website Visibility</span>
                <span className={styles.visibilityValue}>
                  {job.status === 'open' ? 'Visible on Careers Page' : job.status === 'draft' ? 'Draft — Not Published' : 'Closed — Hidden from Listings'}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Metadata</h3>
            <div className={styles.metaGrid}>
              <MetaRow label="Slug" value={job.slug} />
              <MetaRow label="Department" value={job.department} />
              <MetaRow label="Employment Type" value={job.employmentType} />
              <MetaRow label="Work Mode" value={job.workMode} />
              <MetaRow label="Experience Level" value={job.experienceLevel} />
              <MetaRow label="Posted Date" value={formatDate(job.postedDate)} />
              <MetaRow label="Closing Date" value={formatDate(job.closingDate)} />
              <MetaRow label="Created" value={formatUpdated(job.createdAt)} />
              <MetaRow label="Last Updated" value={formatUpdated(job.lastUpdated)} />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Related Website Usage</h3>
            <ul className={styles.usageList}>
              {job.websiteUsage.map((usage) => (
                <li key={usage} className={styles.usageItem}>
                  <AdminIcon name="external" size={14} />
                  {usage}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
