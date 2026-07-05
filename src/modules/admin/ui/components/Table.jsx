import styles from './Table.module.css';

export function TableWrap({ children, stickyHeader = false, className = '' }) {
  return (
    <div
      className={`${styles.wrap} ${stickyHeader ? styles.stickyHeader : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function Table({ children, className = '', ...rest }) {
  return (
    <table className={`${styles.table} ${className}`} {...rest}>
      {children}
    </table>
  );
}

export function TableHead({ children, ...rest }) {
  return <thead {...rest}>{children}</thead>;
}

export function TableBody({ children, ...rest }) {
  return <tbody {...rest}>{children}</tbody>;
}

export function TableRow({ children, selected = false, className = '', ...rest }) {
  return (
    <tr
      className={`${styles.row} ${selected ? styles.selected : ''} ${className}`}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, className = '', ...rest }) {
  return (
    <th className={`${styles.th} ${className}`} {...rest}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...rest }) {
  return (
    <td className={`${styles.td} ${className}`} {...rest}>
      {children}
    </td>
  );
}

export function TableTitleCell({ title, subtitle }) {
  return (
    <div className={styles.titleCell}>
      <span className={styles.titleText}>{title}</span>
      {subtitle && <span className={styles.subtitleText}>{subtitle}</span>}
    </div>
  );
}

const TableCompound = Object.assign(TableWrap, {
  Root: Table,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
  TitleCell: TableTitleCell,
});

export default TableCompound;
