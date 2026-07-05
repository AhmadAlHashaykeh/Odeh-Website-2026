import { SEO_AI_OPTIMIZATION_MODES } from '../../ai/seoAiConfig';
import styles from './SeoAiOptimizationChips.module.css';

export default function SeoAiOptimizationChips({
  activeGoal,
  onSelect,
  disabled = false,
}) {
  return (
    <div className={styles.wrap} role="group" aria-label="AI optimization modes">
      {SEO_AI_OPTIMIZATION_MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`${styles.chip} ${activeGoal === mode.id ? styles.chipActive : ''}`}
          onClick={() => onSelect(mode.id)}
          disabled={disabled}
          aria-pressed={activeGoal === mode.id}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
