import { StatusBadge } from '../../cms/components';
import {
  Table,
  TableWrap,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../ui/components/Table';
import tableStyles from '../../ui/components/Table.module.css';
import CategoryQuickActions from './CategoryQuickActions';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './CategoriesTableView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function CategoriesTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onCategoryClick,
  onViewCategory,
  onAction,
}) {
  return (
    <TableWrap>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell className={tableStyles.checkboxCol}>
              <input
                type="checkbox"
                className={tableStyles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all categories on this page"
              />
            </TableHeaderCell>
            <TableHeaderCell className={styles.thumbCol}>Thumbnail</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Slug</TableHeaderCell>
            <TableHeaderCell>Projects</TableHeaderCell>
            <TableHeaderCell>SEO</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Last Updated</TableHeaderCell>
            <TableHeaderCell className={tableStyles.actionsCol} aria-label="Actions" />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((category) => (
            <TableRow key={category.id} selected={selectedIds.has(category.id)}>
              <TableCell className={tableStyles.checkboxCol}>
                <input
                  type="checkbox"
                  className={tableStyles.checkbox}
                  checked={selectedIds.has(category.id)}
                  onChange={() => onToggleSelect(category.id)}
                  aria-label={`Select ${category.title}`}
                />
              </TableCell>
              <TableCell className={styles.thumbCol}>
                <button type="button" onClick={() => onCategoryClick(category.id)}>
                  <img src={resolveMediaUrl(category.coverImage)}
                    alt={category.title}
                    className={styles.thumb}
                    loading="lazy"
                  />
                </button>
              </TableCell>
              <TableCell>
                <button type="button" className={styles.titleCell} onClick={() => onCategoryClick(category.id)}>
                  <span className={styles.titleText}>{category.title}</span>
                  <span className={styles.projectCount}>
                    {category.projectCount} {category.projectCount === 1 ? 'project' : 'projects'}
                  </span>
                </button>
              </TableCell>
              <TableCell>
                <span className={styles.slugCell}>/{category.slug}</span>
              </TableCell>
              <TableCell>{category.projectCount}</TableCell>
              <TableCell>
                <span className={`${styles.seoBadge} ${styles[category.seoStatus]}`}>
                  {category.seoStatus === 'complete' ? 'Ready' : 'Pending'}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={category.published ? 'published' : 'draft'}
                  label={category.published ? 'Published' : 'Hidden'}
                />
              </TableCell>
              <TableCell className={styles.orderCell}>#{category.displayOrder}</TableCell>
              <TableCell>{formatDate(category.lastUpdated)}</TableCell>
              <TableCell className={tableStyles.actionsCol}>
                <CategoryQuickActions category={category} onView={onViewCategory} onAction={onAction} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrap>
  );
}
