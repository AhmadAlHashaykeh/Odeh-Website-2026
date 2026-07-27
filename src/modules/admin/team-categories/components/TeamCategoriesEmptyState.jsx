import { Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './TeamCategoriesEmptyState.module.css';

export default function TeamCategoriesEmptyState({ onCreateCategory }) {
  return (
    <div className={styles.empty}>
      <h3>No team categories yet</h3>
      <p>Create categories to group team members on the public Team Members page.</p>
      <Button
        variant="primary"
        icon={<AdminIcon name="add" size={16} />}
        onClick={onCreateCategory}
      >
        Add Category
      </Button>
    </div>
  );
}
