import { usePublicSite } from '../../context/PublicSiteContext';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import ContactForm from './ContactForm';
import styles from './ContactSection.module.css';

function OfficeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialIconMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
};

function contactLabel(email) {
  return email.split('@')[0].replace(/_/g, ' ');
}

function BlockHeader({ icon, title }) {
  return (
    <div className={styles.blockHeader}>
      <span className={styles.blockIcon}>{icon}</span>
      <h3 className={styles.blockTitle}>{title}</h3>
    </div>
  );
}

function ContactInfo() {
  const panelRef = useScrollReveal(0.08);
  const { contactInfo, socialLinks } = usePublicSite();
  const contacts = contactInfo?.contacts ?? [];

  return (
    <aside ref={panelRef} className={`${styles.infoPanel} reveal`} aria-label="Contact information">
      <div className={styles.infoHeader}>
        <span className="section-label">Contact Details</span>
        <h2 className={styles.infoHeading}>Reach Our Team</h2>
        <p className={styles.infoDesc}>
          Connect with us directly through any of the channels below.
        </p>
      </div>

      <div className={styles.infoBody}>
        <div className={styles.metaGrid}>
          <article className={styles.metaCell}>
            <BlockHeader icon={<OfficeIcon />} title="Office" />
            <p className={styles.primaryText}>{contactInfo?.officeName}</p>
            <p className={styles.secondaryText}>{contactInfo?.location}</p>
          </article>

          <article className={styles.metaCell}>
            <BlockHeader icon={<ClockIcon />} title="Working Hours" />
            <p className={styles.primaryText}>{contactInfo?.workingHours?.days}</p>
            <p className={styles.secondaryText}>{contactInfo?.workingHours?.hours}</p>
          </article>
        </div>

        <article className={styles.contactsBlock}>
          <BlockHeader icon={<PhoneIcon />} title="Direct Contacts" />
          <ul className={styles.contactList}>
            {contacts.map((contact) => (
              <li key={contact.email} className={styles.contactItem}>
                <span className={styles.contactName}>{contactLabel(contact.email)}</span>
                <a href={`tel:${contact.phone}`} className={styles.contactChannel}>
                  <span className={styles.channelLabel}>Phone</span>
                  <span className={styles.channelValue}>{contact.phone}</span>
                </a>
                <a
                  href={`mailto:${contact.email.toLowerCase()}`}
                  className={`${styles.contactChannel} ${styles.contactChannelEmail}`}
                >
                  <span className={styles.channelLabel}>Email</span>
                  <span className={styles.channelValue}>{contact.email.toLowerCase()}</span>
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.socialBlock}>
          <BlockHeader icon={<ShareIcon />} title="Social Media" />
          <div className={styles.socialRow}>
            {(socialLinks ?? []).map((social) => {
              const Icon = socialIconMap[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <span className={styles.socialLinkIcon}>
                    <Icon />
                  </span>
                  <span className={styles.socialLinkLabel}>{social.label}</span>
                </a>
              );
            })}
          </div>
        </article>
      </div>
    </aside>
  );
}

export default function ContactSection({ form }) {
  const sectionRef = useScrollReveal(0.06);

  return (
    <section className={styles.section} aria-label="Contact information and form">
      <div className="container">
        <div ref={sectionRef} className={`${styles.grid} reveal`}>
          <ContactInfo />
          <ContactForm {...form} />
        </div>
      </div>
    </section>
  );
}
