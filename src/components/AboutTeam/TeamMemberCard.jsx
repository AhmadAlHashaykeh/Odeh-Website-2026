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

export default function TeamMemberCard({
  name,
  title,
  experience,
  email,
  photo,
  roleStyle,
  priority = false,
}) {
  const roleVars = roleStyle
    ? {
        '--role-border': roleStyle.borderColor,
        '--role-border-hover': roleStyle.borderColorHover,
        '--role-shadow': roleStyle.shadowColor,
      }
    : undefined;

  return (
    <article className={styles.card} style={roleVars}>
      <div className={styles.photoFrame}>
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className={styles.photo}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        <div className={styles.photoFade} aria-hidden="true" />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.position}>{title}</p>

        <div className={styles.metaRow}>
          {experience && <span className={styles.experience}>{experience}</span>}
        </div>
      </div>

      {email && (
        <a
          href={`mailto:${email}`}
          className={styles.contactBtn}
          aria-label={`Email ${name}`}
        >
          <EmailIcon />
        </a>
      )}
    </article>
  );
}
