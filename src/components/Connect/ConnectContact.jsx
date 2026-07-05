import { connectSocialIconMap } from './ConnectIcons';
import styles from './ConnectContact.module.css';

export default function ConnectContact({ phone, phoneDisplay, email, office, social }) {
  return (
    <footer className={styles.contact} aria-label="Contact information">
      <div className={styles.details}>
        <a className={styles.detailLink} href={`tel:${phone}`} aria-label={`Call ${phoneDisplay}`}>
          {phoneDisplay}
        </a>
        <a className={styles.detailLink} href={`mailto:${email}`} aria-label={`Email ${email}`}>
          {email}
        </a>
        <span className={styles.office}>{office}</span>
      </div>

      <div className={styles.social} role="list" aria-label="Social media">
        {social.map((item) => {
          const Icon = connectSocialIconMap[item.icon];
          if (!Icon) return null;

          return (
            <a
              key={item.label}
              className={styles.socialLink}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              role="listitem"
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </footer>
  );
}
