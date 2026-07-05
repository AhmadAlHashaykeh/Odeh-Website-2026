import CmsListingLayout from '../layout/CmsListingLayout';
import {
  listingDemoMeta,
  listingDemoItems,
  listingDemoColumns,
  statusFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/listingDemoData';

/**
 * Framework preview page — demonstrates the reusable CMS listing layout
 * with generic mock data. Not tied to any specific module.
 */
export default function ListingPreviewPage() {
  return (
    <CmsListingLayout
      title={listingDemoMeta.title}
      description={listingDemoMeta.description}
      breadcrumbs={listingDemoMeta.breadcrumbs}
      topBarBreadcrumbs={[
        { label: 'Admin', path: '/admin/dashboard' },
        { label: 'CMS Framework' },
      ]}
      primaryAction={listingDemoMeta.primaryAction}
      secondaryActions={listingDemoMeta.secondaryActions}
      items={listingDemoItems}
      columns={listingDemoColumns}
      statusFilterOptions={statusFilterOptions}
      sortOptions={sortOptions}
      bulkActionOptions={bulkActionOptions}
      searchPlaceholder="Search content items..."
      emptyState={{
        icon: 'empty',
        title: 'No content items found',
        description: 'Adjust your filters or create a new item to get started.',
        action: { label: 'Add Item', icon: 'add' },
      }}
    />
  );
}
