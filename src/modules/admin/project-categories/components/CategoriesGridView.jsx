import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import CategoryQuickActions from './CategoryQuickActions';
import styles from './CategoriesGridView.module.css';

export default function CategoriesGridView({
  items,
  selectedIds,
  onToggleSelect,
  onCategoryClick,
  onViewCategory,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((category) => (
        <article
          key={category.id}
          className={`${styles.card} ${selectedIds.has(category.id) ? styles.selected : ''}`}
        >
          <div className={styles.imageWrap}>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => onCategoryClick(category.id)}
              aria-label={`View ${category.title}`}
            >
              <img
                src={category.coverImage}
                alt={category.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.imageOverlay} aria-hidden="true" />
            </button>

            <div className={styles.cardTop}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(category.id)}
                onChange={() => onToggleSelect(category.id)}
                aria-label={`Select ${category.title}`}
              />
              <CategoryQuickActions
                category={category}
                onView={onViewCategory}
                onAction={onAction}
                variant="overlay"
              />
            </div>

            <div className={styles.imageMeta}>
              <span className={styles.orderBadge}>#{category.displayOrder}</span>
              <span className={styles.projectCount}>
                <AdminIcon name="projects" size={12} />
                {category.projectCount} {category.projectCount === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.titleBtn}
              onClick={() => onCategoryClick(category.id)}
            >
              <h3 className={styles.title}>{category.title}</h3>
            </button>

            <p className={styles.description}>{category.description}</p>

            <div className={styles.badges}>
              <StatusBadge
                status={category.published ? 'published' : 'draft'}
                label={category.published ? 'Published' : 'Hidden'}
              />
              <span className={`${styles.seoBadge} ${styles[category.seoStatus]}`}>
                SEO {category.seoStatus === 'complete' ? 'Ready' : 'Pending'}
              </span>
            </div>

            <span className={styles.slug}>/{category.slug}</span>

            {category.projectPreviews?.length > 0 && (
              <div className={styles.thumbnails}>
                {category.projectPreviews.slice(0, 4).map((project) => (
                  <img
                    key={project.id}
                    src={project.coverImage}
                    alt={project.title}
                    className={styles.thumb}
                    loading="lazy"
                    title={project.title}
                  />
                ))}
                {category.projectCount > 4 && (
                  <span className={styles.thumbMore}>+{category.projectCount - 4}</span>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
