import { useScrollReveal } from '../../hooks/useScrollReveal';
import { groupTeamMembers } from '../../utils/teamMemberGroups';
import TeamMemberCard from './TeamMemberCard';
import styles from './TeamDirectory.module.css';

function isLeadershipGroup(group) {
  const key = String(group.key || '').toLowerCase();
  const title = String(group.title || '').toLowerCase();
  return key.includes('board') || title.includes('board of directors');
}

function resolveGroupLayout(group) {
  if (isLeadershipGroup(group)) return 'leadership';
  if (group.members.length === 1) return 'solo';
  if (group.members.length === 2) return 'pair';
  return 'grid';
}

function TeamGroupSection({ group, startIndex }) {
  const gridRef = useScrollReveal(0);
  const layout = resolveGroupLayout(group);
  const cardLayout = layout === 'leadership' ? 'leadership' : 'portrait';

  return (
    <section
      className={`${styles.group} ${layout === 'leadership' ? styles.groupLeadership : ''}`}
      aria-labelledby={`team-group-${group.key}`}
    >
      <header className={styles.groupHeader}>
        <div className={styles.groupTitleRow}>
          <span className={styles.groupAccent} aria-hidden="true" />
          <div className={styles.groupCopy}>
            <h2 id={`team-group-${group.key}`} className={styles.groupTitle}>
              {group.title}
            </h2>
            {group.description ? (
              <p className={styles.groupDescription}>{group.description}</p>
            ) : null}
          </div>
        </div>
      </header>

      <div
        ref={gridRef}
        className={`${styles.grid} ${styles[`grid_${layout}`]} reveal`}
      >
        {group.members.map((member, index) => (
          <TeamMemberCard
            key={member.slug}
            name={member.name}
            title={member.title}
            experience={member.experience}
            email={member.email}
            linkedinUrl={member.linkedinUrl}
            photo={member.photo}
            layout={cardLayout}
            priority={startIndex + index < 3}
          />
        ))}
      </div>
    </section>
  );
}

export default function TeamDirectory({ members }) {
  const groups = groupTeamMembers(members ?? []);
  let runningIndex = 0;

  if (groups.length === 0) {
    return (
      <div className={styles.directory} aria-label="Team members">
        <div className="container">
          <p className={styles.empty}>Team profiles will appear here soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.directory} aria-label="Team members">
      <div className="container">
        <div className={styles.groups}>
          {groups.map((group) => {
            const section = (
              <TeamGroupSection key={group.key} group={group} startIndex={runningIndex} />
            );
            runningIndex += group.members.length;
            return section;
          })}
        </div>
      </div>
    </div>
  );
}
