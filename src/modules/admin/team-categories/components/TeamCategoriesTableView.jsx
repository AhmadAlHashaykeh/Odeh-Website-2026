import { useState } from 'react';
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
import TeamCategoryQuickActions from './TeamCategoryQuickActions';
import styles from './TeamCategoriesTableView.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TeamCategoriesTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onCategoryClick,
  onViewCategory,
  onAction,
  onReorder,
}) {
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex || !onReorder) {
      setDragIndex(null);
      return;
    }

    const next = items.slice();
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setDragIndex(null);
    await onReorder(next.map((item) => item.id));
  };

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
            <TableHeaderCell className={styles.dragCol} aria-label="Reorder" />
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Category Name</TableHeaderCell>
            <TableHeaderCell>Slug</TableHeaderCell>
            <TableHeaderCell>Members</TableHeaderCell>
            <TableHeaderCell>Border Color</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Last Updated</TableHeaderCell>
            <TableHeaderCell className={tableStyles.actionsCol} aria-label="Actions" />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((category, index) => (
            <TableRow
              key={category.id}
              selected={selectedIds.has(category.id)}
              className={dragIndex === index ? styles.dragging : undefined}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <TableCell className={tableStyles.checkboxCol}>
                <input
                  type="checkbox"
                  className={tableStyles.checkbox}
                  checked={selectedIds.has(category.id)}
                  onChange={() => onToggleSelect(category.id)}
                  aria-label={`Select ${category.name}`}
                />
              </TableCell>
              <TableCell className={styles.dragCol}>
                <button
                  type="button"
                  className={styles.dragHandle}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={() => setDragIndex(null)}
                  aria-label={`Drag to reorder ${category.name}`}
                  title="Drag to reorder"
                >
                  ⋮⋮
                </button>
              </TableCell>
              <TableCell className={styles.orderCell}>#{category.displayOrder}</TableCell>
              <TableCell>
                <button
                  type="button"
                  className={styles.titleCell}
                  onClick={() => onCategoryClick(category.id)}
                >
                  <span className={styles.titleText}>{category.name}</span>
                  {category.description ? (
                    <span className={styles.description}>{category.description}</span>
                  ) : null}
                </button>
              </TableCell>
              <TableCell>
                <span className={styles.slugCell}>{category.slug}</span>
              </TableCell>
              <TableCell>{category.membersCount}</TableCell>
              <TableCell>
                <span className={styles.colorPreview}>
                  <span
                    className={styles.colorSwatch}
                    style={{ background: category.borderColor, borderColor: category.borderColor }}
                    aria-hidden="true"
                  />
                  <span className={styles.colorValue}>{category.borderColor}</span>
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={category.isActive ? 'published' : 'draft'}
                  label={category.isActive ? 'Active' : 'Inactive'}
                />
              </TableCell>
              <TableCell>{formatDate(category.lastUpdated)}</TableCell>
              <TableCell className={tableStyles.actionsCol}>
                <TeamCategoryQuickActions
                  category={category}
                  onView={onViewCategory}
                  onAction={onAction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrap>
  );
}
