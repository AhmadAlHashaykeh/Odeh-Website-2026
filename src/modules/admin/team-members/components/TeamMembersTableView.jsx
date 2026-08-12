import { StatusBadge } from '../../cms/components';
import TeamMemberQuickActions from './TeamMemberQuickActions';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './TeamMembersTableView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function MemberStatusBadge({ status }) {
  if (status === 'active') {
    return <StatusBadge status="active" label="Visible" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

export default function TeamMembersTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onMemberClick,
  onViewMember,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all members on this page"
              />
            </th>
            <th className={styles.thumbCol}>Photo</th>
            <th>Name</th>
            <th>Job title</th>
            <th>Section</th>
            <th>Rank</th>
            <th>Visibility</th>
            <th>Updated</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((member) => (
            <tr
              key={member.id}
              className={`${styles.row} ${selectedIds.has(member.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(member.id)}
                  onChange={() => onToggleSelect(member.id)}
                  aria-label={`Select ${member.fullName}`}
                />
              </td>
              <td className={styles.thumbCol}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => onMemberClick(member.id)}
                  aria-label={`View ${member.fullName}`}
                >
                  <img
                    src={resolveMediaUrl(member.photo)}
                    alt=""
                    className={styles.thumb}
                    loading="lazy"
                  />
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={styles.nameBtn}
                  onClick={() => onMemberClick(member.id)}
                >
                  <span className={styles.name}>{member.fullName}</span>
                </button>
              </td>
              <td className={styles.muted}>{member.position || '—'}</td>
              <td className={styles.muted}>{member.categoryLabel || '—'}</td>
              <td>
                {member.rank?.name ? (
                  <span className={styles.rankCell}>
                    <span
                      className={styles.rankDot}
                      style={{ background: member.rank.color }}
                      aria-hidden="true"
                    />
                    {member.rank.name}
                  </span>
                ) : (
                  <span className={styles.muted}>—</span>
                )}
              </td>
              <td>
                <MemberStatusBadge status={member.status} />
              </td>
              <td className={styles.muted}>{formatDate(member.lastUpdated)}</td>
              <td className={styles.actionsCol}>
                <TeamMemberQuickActions member={member} onView={onViewMember} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
