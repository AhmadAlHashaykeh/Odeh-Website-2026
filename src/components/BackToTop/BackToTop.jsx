import { useState, useEffect, useCallback } from 'react';
import { useSmoothScroll } from '../../context/SmoothScrollContext';
import styles from './BackToTop.module.css';

const SCROLL_THRESHOLD = 500;

function ArrowUpIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollToTop, subscribeScroll } = useSmoothScroll();

  useEffect(() => {
    return subscribeScroll((scrollY) => {
      setVisible(scrollY >= SCROLL_THRESHOLD);
    });
  }, [subscribeScroll]);

  const handleClick = useCallback(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUpIcon className={styles.icon} />
    </button>
  );
}
