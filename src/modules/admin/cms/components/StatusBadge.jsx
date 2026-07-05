import { Badge } from '../../ui';

const STATUS_MAP = {
  published: { label: 'Published', variant: 'published' },
  draft: { label: 'Draft', variant: 'draft' },
  archived: { label: 'Archived', variant: 'archived' },
  active: { label: 'Active', variant: 'success' },
  pending: { label: 'Pending', variant: 'info' },
  inactive: { label: 'Inactive', variant: 'neutral' },
};

export default function StatusBadge({ status, label }) {
  const config = STATUS_MAP[status] || { label: status, variant: 'neutral' };
  const displayLabel = label || config.label;

  return <Badge variant={config.variant}>{displayLabel}</Badge>;
}
