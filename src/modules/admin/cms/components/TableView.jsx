import AdminIcon from '../../components/AdminIcons';
import StatusBadge from './StatusBadge';
import {
  Table,
  TableWrap,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  TableTitleCell,
} from '../../ui/components/Table';
import tableStyles from '../../ui/components/Table.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function renderCell(item, column) {
  if (column.render) return column.render(item);

  const value = item[column.key];

  if (column.type === 'status') return <StatusBadge status={value} />;
  if (column.type === 'date') return formatDate(value);

  return value ?? '—';
}

export default function TableView({
  items = [],
  columns = [],
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
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
                aria-label="Select all items on this page"
              />
            </TableHeaderCell>
            {columns.map((column) => (
              <TableHeaderCell key={column.key} style={{ width: column.width }}>
                {column.label}
              </TableHeaderCell>
            ))}
            <TableHeaderCell className={tableStyles.actionsCol} aria-label="Actions" />
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} selected={selectedIds.has(item.id)}>
              <TableCell className={tableStyles.checkboxCol}>
                <input
                  type="checkbox"
                  className={tableStyles.checkbox}
                  checked={selectedIds.has(item.id)}
                  onChange={() => onToggleSelect(item.id)}
                  aria-label={`Select ${item.title || item.id}`}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === 'title' ? (
                    <TableTitleCell title={item.title} subtitle={item.subtitle} />
                  ) : (
                    renderCell(item, column)
                  )}
                </TableCell>
              ))}
              <TableCell className={tableStyles.actionsCol}>
                <button type="button" className={tableStyles.moreBtn} aria-label="More actions">
                  <AdminIcon name="more" size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrap>
  );
}
