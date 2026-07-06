import { Link } from 'react-router-dom';
import { Button } from '../ui';
import styles from './AccessDeniedPage.module.css';

export default function AccessDeniedPage({ moduleId }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You do not have permission to view
          {moduleId ? ` the ${moduleId.replace(/-/g, ' ')} module` : ' this page'}.
        </p>
        <Link to="/admin/dashboard" className={styles.link}>
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
