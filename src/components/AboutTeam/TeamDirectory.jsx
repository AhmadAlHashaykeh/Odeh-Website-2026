import { useScrollReveal } from '../../hooks/useScrollReveal';
import TeamMemberCard from './TeamMemberCard';
import styles from './TeamDirectory.module.css';

export default function TeamDirectory({ members }) {
  const gridRef = useScrollReveal(0.06);

  return (
    <section className={styles.directory} aria-label="Team members">
      <div className="container">
        <div ref={gridRef} className={`${styles.grid} reveal`}>
          {members.map((member, index) => (
            <TeamMemberCard key={member.slug} {...member} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
