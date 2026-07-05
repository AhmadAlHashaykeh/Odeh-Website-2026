import AdminIcon from '../../components/AdminIcons';
import { connectIconMap } from '../../../../components/Connect/ConnectIcons';
import { Badge, Button } from '../../ui';
import { getConnectLinkType, getLinkTypeLabel } from '../mock/connectPageConfig';
import styles from './ConnectLinkCard.module.css';

export default function ConnectLinkCard({
  link,
  readOnly = false,
  onEdit,
  onPreview,
  onToggleEnabled,
  onCopyUrl,
  onReset,
}) {
  const linkType = getConnectLinkType(link);
  const Icon = connectIconMap[link.icon] ?? connectIconMap.website;

  return (
    <article className={styles.card}>
      <div className={styles.main}>
        <div className={styles.header}>
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon />
          </span>
          <div className={styles.info}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{link.title}</h3>
              <Badge status={link.enabled ? 'published' : 'draft'}>
                {link.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            {link.subtitle ? <p className={styles.subtitle}>{link.subtitle}</p> : null}
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>URL</span>
            <code className={styles.url}>{link.url}</code>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Type</span>
            <span className={styles.typeBadge}>{getLinkTypeLabel(linkType)}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>Order</span>
            <span className={styles.orderValue}>#{link.order}</span>
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        {!readOnly && (
          <Button
            variant="primary"
            size="sm"
            icon={<AdminIcon name="edit" size={14} />}
            onClick={() => onEdit(link.id)}
          >
            Edit
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          icon={<AdminIcon name="eye" size={14} />}
          onClick={() => onPreview(link)}
        >
          Preview
        </Button>
        {!readOnly && (
          <>
            <Button
              variant="ghost"
              size="sm"
              icon={<AdminIcon name="eye" size={14} />}
              onClick={() => onToggleEnabled(link.id)}
            >
              {link.enabled ? 'Disable' : 'Enable'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<AdminIcon name="refresh" size={14} />}
              onClick={() => onReset(link.id)}
            >
              Reset
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon={<AdminIcon name="copy" size={14} />}
          onClick={() => onCopyUrl(link.url)}
        >
          Copy URL
        </Button>
      </div>
    </article>
  );
}
