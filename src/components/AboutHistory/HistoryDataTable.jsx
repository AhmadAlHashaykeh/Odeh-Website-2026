import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './HistoryDataTable.module.css';

function formatNumber(value) {
  return value.toLocaleString('en-US');
}

export default function HistoryDataTable({ label, title, rows, columns }) {
  const headerRef = useScrollReveal();
  const tableRef = useScrollReveal(0.08);

  return (
    <section className={styles.section} aria-label="Company growth data">
      <div className="container">
        {(label || title) && (
          <div ref={headerRef} className={`${styles.header} reveal`}>
            {label && <span className="section-label">{label}</span>}
            {title && <h2 className="section-title">{title}</h2>}
          </div>
        )}

        <div ref={tableRef} className={`${styles.tableWrap} reveal reveal-delay-1`}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} scope="col">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.year}>
                  <th scope="row">{row.year}</th>
                  <td>{formatNumber(row.projects)}</td>
                  <td>{formatNumber(row.area)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
