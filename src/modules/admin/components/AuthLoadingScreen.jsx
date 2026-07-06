import styles from './AuthLoadingScreen.module.css';

export default function AuthLoadingScreen() {
  return (
    <div className={styles.screen} role="status" aria-live="polite" aria-label="Loading session">
      <div className={styles.card}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.text}>Checking your session...</p>
      </div>
    </div>
  );
}
