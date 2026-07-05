import { Link } from 'react-router-dom';
import { connectIconMap, ArrowIcon } from './ConnectIcons';
import styles from './ConnectLinkCard.module.css';

function isNewTabLink(url) {
  return !url.startsWith('tel:') && !url.startsWith('mailto:');
}

export default function ConnectLinkCard({ title, subtitle, icon, url, external }) {
  const Icon = connectIconMap[icon] ?? connectIconMap.website;
  const content = (
    <>
      <span className={styles.iconWrap} aria-hidden="true">
        <Icon />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <ArrowIcon />
      </span>
    </>
  );

  if (external) {
    return (
      <a
        className={styles.card}
        href={url}
        {...(isNewTabLink(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        aria-label={subtitle ? `${title} — ${subtitle}` : title}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={styles.card} to={url} aria-label={subtitle ? `${title} — ${subtitle}` : title}>
      {content}
    </Link>
  );
}
