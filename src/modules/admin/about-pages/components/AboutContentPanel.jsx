import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import { getPanelSummary } from '../mock/aboutPagesConfig';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './AboutContentPanel.module.css';

function AboutHeroPreview({ data }) {
  return (
    <div className={styles.heroPreview}>
      <div className={styles.heroMedia}>
        <img src={resolveMediaUrl(data.backgroundImage)} alt="" loading="lazy" aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
      </div>
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>{data.label}</span>
        <h3 className={styles.heroTitle}>{data.title}</h3>
        {data.subtitle ? <p className={styles.heroDesc}>{data.subtitle}</p> : null}
        <p className={styles.heroDesc}>{data.description}</p>
      </div>
    </div>
  );
}

function AboutMetaPreview({ data }) {
  return (
    <div className={styles.storyPreview}>
      <span className={styles.previewLabel}>Meta Title</span>
      <h3 className={styles.storyTitle}>{data.title}</h3>
      <p className={styles.storyBody}>{data.description}</p>
    </div>
  );
}

function CompanyIntroPreview({ data }) {
  return (
    <div className={styles.introPreview}>
      <div className={styles.introImageWrap}>
        <img src={resolveMediaUrl(data.image.src)} alt={data.image.alt} loading="lazy" />
      </div>
      <div className={styles.introText}>
        <h3 className={styles.introTitle}>{data.title}</h3>
        <p className={styles.introDesc}>{data.description}</p>
      </div>
    </div>
  );
}

function OfficeGalleryPreview({ data }) {
  const preview = data.images.slice(0, 4);

  return (
    <div className={styles.galleryPreview}>
      <div className={styles.galleryHeader}>
        <span className={styles.previewLabel}>{data.label}</span>
        <p className={styles.galleryDesc}>{data.description}</p>
      </div>
      <div className={styles.thumbGrid}>
        {preview.map((image) => (
          <div key={image.src} className={styles.thumbCard}>
            <img src={resolveMediaUrl(image.src)} alt={image.alt} loading="lazy" />
          </div>
        ))}
      </div>
      {data.images.length > 4 && (
        <span className={styles.thumbMore}>+{data.images.length - 4} more images</span>
      )}
    </div>
  );
}

function PrinciplesPreview({ data }) {
  const preview = data.items.slice(0, 4);

  return (
    <div className={styles.principlesPreview}>
      <span className={styles.previewLabel}>{data.label}</span>
      <div className={styles.principleList}>
        {preview.map((item) => (
          <div key={item.number} className={styles.principleCard}>
            <span className={styles.principleNum}>{item.number}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      {data.items.length > 4 && (
        <span className={styles.thumbMore}>+{data.items.length - 4} more principles</span>
      )}
    </div>
  );
}

function StoryPreview({ data }) {
  return (
    <div className={styles.storyPreview}>
      <span className={styles.previewLabel}>{data.label}</span>
      <span className={styles.storyLead}>{data.lead}</span>
      <h3 className={styles.storyTitle}>{data.title}</h3>
      <p className={styles.storyBody}>{data.body.slice(0, 220)}…</p>
    </div>
  );
}

function CountersPreview({ data }) {
  return (
    <div className={styles.countersPreview}>
      {data.items.map((item) => (
        <div key={item.label} className={styles.counterPill}>
          <span className={styles.counterValue}>{item.value}</span>
          <span className={styles.counterLabel}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function GrowthTablePreview({ data }) {
  return (
    <div className={styles.growthPreview}>
      <div className={styles.growthHeader}>
        <span className={styles.previewLabel}>{data.label}</span>
        <h3 className={styles.growthTitle}>{data.title}</h3>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {data.columns.map((col) => (
                <th key={col.key} className={col.align === 'right' ? styles.alignRight : ''}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td className={styles.alignRight}>{row.projects.toLocaleString()}</td>
                <td className={styles.alignRight}>{row.area.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PanelPreview({ type, data }) {
  if (!data) return null;

  switch (type) {
    case 'about-hero':
      return <AboutHeroPreview data={data} />;
    case 'about-meta':
      return <AboutMetaPreview data={data} />;
    case 'company-intro':
      return <CompanyIntroPreview data={data} />;
    case 'office-gallery':
      return <OfficeGalleryPreview data={data} />;
    case 'principles':
      return <PrinciplesPreview data={data} />;
    case 'story':
      return <StoryPreview data={data} />;
    case 'counters':
      return <CountersPreview data={data} />;
    case 'growth-table':
      return <GrowthTablePreview data={data} />;
    default:
      return null;
  }
}

export default function AboutContentPanel({
  panel,
  panelData,
  onEdit,
  onPreview,
  onReset,
}) {
  const summary = getPanelSummary(panel.id, panelData);

  return (
    <article className={styles.panel}>
      <div className={styles.panelMain}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>{panel.name}</h2>
            <Badge status={panel.status}>{panel.status}</Badge>
          </div>
          <p className={styles.panelDesc}>{panel.description}</p>
        </div>

        <div className={styles.summaryBlock}>
          <span className={styles.summaryLabel}>Content Summary</span>
          <p className={styles.summaryText}>{summary}</p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="sm"
            icon={<AdminIcon name="edit" size={14} />}
            onClick={() => onEdit(panel.id)}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<AdminIcon name="eye" size={14} />}
            onClick={() => onPreview(panel.anchor)}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="refresh" size={14} />}
            onClick={() => onReset(panel.id, panel)}
          >
            Reset Mock Changes
          </Button>
        </div>
      </div>

      <div className={styles.previewArea}>
        <span className={styles.previewAreaLabel}>Content Preview</span>
        <PanelPreview type={panel.previewType} data={panelData} />
      </div>
    </article>
  );
}
