import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './ConnectHero.module.css';

export default function ConnectHero({ logoSrc, logoAlt, companyName, description }) {
  return (
    <header className={styles.hero}>
      <img
        className={styles.logo}
        src={resolveMediaUrl(logoSrc) || '/odeh-logo2.png'}
        alt={logoAlt}
        width={140}
        height={140}
      />
      <h1 className={styles.companyName}>{companyName}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
