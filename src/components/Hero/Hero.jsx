import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useHeroDepth } from '../../hooks/useHeroDepth';
import { useHeroVideo } from '../../hooks/useHeroVideo';
import styles from './Hero.module.css';

const HERO_POSTER = '/hero-poster.jpg';
const HERO_VIDEO = '/video-slider.mp4';

const stats = [
  { value: '1000+', label: 'Projects Delivered' },
  { value: '7+', label: 'Years of Practice' },
  { value: 'Middle East', label: 'Regional Focus' },
];

export default function Hero() {
  const { heroRef, videoRef } = useHeroDepth();
  const { videoElRef, videoReady, videoFailed } = useHeroVideo();
  const showVideo = videoReady && !videoFailed;

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Hero">
      <div className={styles.background}>
        <div ref={videoRef} className={styles.videoMotion}>
          <div className={styles.videoKenBurns}>
            <div className={styles.mediaStack}>
              <img
                className={`${styles.poster} ${showVideo ? styles.posterHidden : ''}`}
                src={HERO_POSTER}
                alt=""
                aria-hidden="true"
                fetchPriority="high"
                decoding="sync"
                width={1920}
                height={1080}
              />
              <video
                ref={videoElRef}
                className={`${styles.video} ${showVideo ? styles.videoVisible : ''}`}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src={HERO_VIDEO} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <div className={styles.overlay} />
        <div className={styles.overlayTint} aria-hidden="true" />

        <div className={styles.gridDrift}>
          <div className={styles.gridLines} />
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon} aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 13.5L8 2.5L14 13.5"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.75 10.25H11.25"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                />
                <path
                  d="M8 2.5V13.5"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className={styles.badgeText}>
              Trusted Structural Engineering Partner Across the Middle East
            </span>
          </div>

          <div className={styles.titleBlock}>
            <h1 className={styles.title}>
              ODEH & PARTNERS <span className={styles.titleAccent}>DESIGN</span>
            </h1>
          </div>

          <p className={styles.description}>
            Delivering innovative structural engineering and design solutions across the Middle
            East with expertise, precision, and sustainability.
          </p>

          <div className={styles.statsStrip} aria-label="Company highlights">
            {stats.map((stat, index) => (
              <Fragment key={stat.label}>
                {index > 0 && <span className={styles.statSep} aria-hidden="true" />}
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </Fragment>
            ))}
          </div>

          <div className={styles.actions}>
            <Link to="/projects" className="btn btn-primary">
              Explore Projects
            </Link>
            <Link to="/reach-out" className="btn btn-secondary">
              Reach Out
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb} />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
