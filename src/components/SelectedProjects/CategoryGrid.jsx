import { useScrollReveal } from '../../hooks/useScrollReveal';
import CategoryCard from './CategoryCard';
import styles from './CategoryGrid.module.css';

export default function CategoryGrid({ categories }) {
  const gridRef = useScrollReveal(0.06);

  return (
    <section className={styles.section} aria-label="Project categories">
      <div className="container">
        <div ref={gridRef} className={`${styles.grid} reveal`}>
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} priority={index < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
