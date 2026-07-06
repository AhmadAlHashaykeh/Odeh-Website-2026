import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import { getSectionSummary } from '../mock/homePageConfig';
import styles from './HomePageSectionPanel.module.css';

function HeroPreview({ data }) {
  return (
    <div className={styles.heroPreview}>
      <div className={styles.heroMedia}>
        <video
          className={styles.heroVideo}
          src={data.videoSrc}
          poster={data.posterImage}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
      </div>
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>{data.badge}</span>
        <h3 className={styles.heroTitle}>
          {data.headingMain} <span>{data.headingAccent}</span>
        </h3>
        <p className={styles.heroDesc}>{data.description}</p>
      </div>
    </div>
  );
}

function AboutPreview({ data }) {
  return (
    <div className={styles.aboutPreview}>
      <div className={styles.aboutImageWrap}>
        <img src={resolveMediaUrl(data.image)} alt={data.imageAlt} loading="lazy" />
      </div>
      <div className={styles.aboutText}>
        <span className={styles.previewLabel}>{data.sectionLabel}</span>
        <h3 className={styles.aboutTitle}>
          {data.titleMain} <span>{data.titleAccent}</span>
        </h3>
        <p className={styles.aboutDesc}>{data.body}</p>
      </div>
    </div>
  );
}

function ServicesPreview({ data }) {
  const preview = data.services.slice(0, 4);

  return (
    <div className={styles.servicesPreview}>
      <div className={styles.servicesHeader}>
        <span className={styles.previewLabel}>{data.sectionLabel}</span>
        <h3 className={styles.servicesHeading}>{data.heading}</h3>
      </div>
      <div className={styles.thumbGrid}>
        {preview.map((service) => (
          <div key={service.id} className={styles.thumbCard}>
            <img src={resolveMediaUrl(service.image)} alt={service.title} loading="lazy" />
            <span className={styles.thumbLabel}>{service.title}</span>
          </div>
        ))}
      </div>
      {data.services.length > 4 && (
        <span className={styles.thumbMore}>+{data.services.length - 4} more in carousel</span>
      )}
    </div>
  );
}

function ProjectsPreview({ data }) {
  const [featured, ...secondary] = data.projects;

  return (
    <div className={styles.projectsPreview}>
      <div className={styles.projectsHeader}>
        <span className={styles.previewLabel}>{data.sectionLabel}</span>
        <h3 className={styles.projectsHeading}>{data.heading}</h3>
      </div>
      <div className={styles.projectsGrid}>
        {featured && (
          <div className={`${styles.projectCard} ${styles.projectFeatured}`}>
            <img src={resolveMediaUrl(featured.image)} alt={featured.title} loading="lazy" />
            <div className={styles.projectMeta}>
              <span>{featured.category}</span>
              <strong>{featured.title}</strong>
            </div>
          </div>
        )}
        {secondary.length > 0 && (
          <div className={styles.projectStack}>
            {secondary.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <img src={resolveMediaUrl(project.image)} alt={project.title} loading="lazy" />
                <div className={styles.projectMeta}>
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionPreview({ type, data }) {
  switch (type) {
    case 'hero':
      return <HeroPreview data={data} />;
    case 'about':
      return <AboutPreview data={data} />;
    case 'services':
      return <ServicesPreview data={data} />;
    case 'projects':
      return <ProjectsPreview data={data} />;
    default:
      return null;
  }
}

export default function HomePageSectionPanel({
  definition,
  sectionData,
  onEdit,
  onPreview,
  onReset,
  onCopyLink,
}) {
  const resolvedSummary = getSectionSummary(definition.id, sectionData);

  return (
    <article className={styles.panel}>
      <div className={styles.panelMain}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>{definition.name}</h2>
            <Badge status={definition.status}>{definition.status}</Badge>
          </div>
          <p className={styles.panelDesc}>{definition.description}</p>
        </div>

        <div className={styles.summaryBlock}>
          <span className={styles.summaryLabel}>Content Summary</span>
          <p className={styles.summaryText}>{resolvedSummary}</p>
        </div>

        {definition.manageRoute && (
          <Link to={definition.manageRoute} className={styles.manageLink}>
            <AdminIcon name="external" size={14} />
            {definition.manageLabel}
          </Link>
        )}

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            icon={<AdminIcon name="edit" size={14} />}
            onClick={() => onEdit(definition.id)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<AdminIcon name="eye" size={14} />}
            onClick={() => onPreview(definition.anchor)}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="refresh" size={14} />}
            onClick={() => onReset(definition.id)}
          >
            Reset Mock Changes
          </Button>
          {definition.anchor !== '/' && (
            <Button
              variant="ghost"
              size="sm"
              icon={<AdminIcon name="copy" size={14} />}
              onClick={() => onCopyLink(definition.anchor)}
            >
              Copy Section Link
            </Button>
          )}
        </div>
      </div>

      <div className={styles.previewArea}>
        <span className={styles.previewAreaLabel}>Section Preview</span>
        <SectionPreview type={definition.previewType} data={sectionData} />
      </div>
    </article>
  );
}
