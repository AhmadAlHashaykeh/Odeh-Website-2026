import { useScrollReveal } from '../../hooks/useScrollReveal';
import { groupTeamMembers } from '../../utils/teamMemberGroups';
import TeamMemberCard from './TeamMemberCard';
import styles from './TeamDirectory.module.css';

function TeamGroupSection({ group, startIndex }) {
  const gridRef = useScrollReveal(0.06);
  const countLabel = group.members.length === 1 ? '1 member' : `${group.members.length} members`;

  return (
    <section
      className={styles.group}
      aria-labelledby={`team-group-${group.key}`}
      style={{ '--group-accent': group.accentColor }}
    >
      <header className={styles.groupHeader}>
        <div className={styles.groupTitleRow}>
          <span className={styles.groupAccent} aria-hidden="true" />
          <h2 id={`team-group-${group.key}`} className={styles.groupTitle}>
            {group.title}
          </h2>
          <span className={styles.groupCount}>{countLabel}</span>
        </div>
        {group.description ? (
          <p className={styles.groupDescription}>{group.description}</p>
        ) : null}
      </header>

      <div ref={gridRef} className={`${styles.grid} reveal`}>
        {group.members.map((member, index) => (
          <TeamMemberCard
            key={member.slug}
            name={member.name}
            title={member.title}
            experience={member.experience}
            email={member.email}
            photo={member.photo}
            roleStyle={member.roleStyle}
            priority={startIndex + index === 0}
          />
        ))}
      </div>
    </section>
  );
}

export default function TeamDirectory({ members }) {
  const groups = groupTeamMembers(members ?? []);
  let runningIndex = 0;

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
