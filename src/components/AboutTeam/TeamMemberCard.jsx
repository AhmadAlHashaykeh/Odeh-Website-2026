import styles from './TeamMemberCard.module.css';

function EmailIcon() {
  return (
    <svg
      className={styles.contactIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className={styles.contactIcon}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C0 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function TeamMemberCard({
  name,
  title,
  experience,
  email,
  linkedinUrl,
  photo,
  layout = 'portrait',
  priority = false,
}) {
  const isLeadership = layout === 'leadership';
  const hasContacts = Boolean(email || linkedinUrl);

  return (
    <article
      className={`${styles.card} ${isLeadership ? styles.cardLeadership : ''}`}
    >
      <div className={styles.photoFrame}>
        {photo ? (
          <img
            src={photo}
            alt={name ? `Portrait of ${name}` : ''}
            className={styles.photo}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className={styles.photoPlaceholder} aria-hidden="true">
            <span className={styles.photoPlaceholderInitial}>
              {(name || '?').trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className={styles.photoFade} aria-hidden="true" />
      </div>

      <div className={styles.info}>
        <div className={styles.copy}>
          <h3 className={styles.name}>{name}</h3>
          {title ? <p className={styles.position}>{title}</p> : null}
          {experience ? <p className={styles.experience}>{experience}</p> : null}
        </div>

        {hasContacts ? (
          <div className={styles.contactActions}>
            {linkedinUrl ? (
              <a
                href={linkedinUrl}
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className={styles.contactLink}>
                <EmailIcon />
                <span>Email</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
