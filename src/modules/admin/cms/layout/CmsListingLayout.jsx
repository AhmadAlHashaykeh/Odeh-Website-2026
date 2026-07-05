import { useMemo, useState } from 'react';
import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../hooks/useAdminBreadcrumbs';
import { useListingState } from '../hooks/useListingState';
import {
  PageHeader,
  Toolbar,
  StatisticsStrip,
  TableView,
  CardView,
  Pagination,
  EmptyState,
  SkeletonLoader,
  DeleteModal,
  SelectionToolbar,
} from '../components';
import styles from './CmsListingLayout.module.css';

export default function CmsListingLayout({
  title,
  description,
  breadcrumbs = [],
  topBarBreadcrumbs,
  primaryAction,
  secondaryActions = [],
  items = [],
  columns = [],
  searchKeys,
  searchPlaceholder = 'Search items...',
  statusFilterOptions = [],
  sortOptions = [],
  bulkActionOptions = [],
  emptyState,
  initialPerPage = 10,
  renderCard,
  onPrimaryAction,
  onSecondaryAction,
}) {
  const listing = useListingState({ items, searchKeys, initialPerPage });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const adminBreadcrumbs = topBarBreadcrumbs || breadcrumbs.slice(0, 2);
  useAdminBreadcrumbs(adminBreadcrumbs);

  usePageMeta({
    title: `${title} — ODEH Admin`,
    description: description || `Manage ${title.toLowerCase()} in the ODEH CMS.`,
  });

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...listing.categories.map((cat) => ({ value: cat, label: cat })),
    ],
    [listing.categories],
  );

  const resolvedPrimaryAction = primaryAction
    ? { ...primaryAction, onClick: onPrimaryAction || primaryAction.onClick }
    : null;

  const resolvedSecondaryActions = secondaryActions.map((action) => ({
    ...action,
    onClick: () => {
      if (onSecondaryAction) onSecondaryAction(action.label);
      else action.onClick?.();
    },
  }));

  const handleBulkApply = () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
    }
  };

  const handleDeleteConfirm = () => {
    listing.closeDeleteModal();
    listing.clearSelection();
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.layout}>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        primaryAction={resolvedPrimaryAction}
        secondaryActions={resolvedSecondaryActions}
      />

      {listing.isLoading ? (
        <SkeletonLoader variant="stats" />
      ) : (
        <StatisticsStrip statistics={listing.statistics} />
      )}

      {listing.isLoading ? (
        <SkeletonLoader variant="toolbar" />
      ) : (
        <Toolbar
          searchValue={listing.searchQuery}
          onSearchChange={listing.setSearchQuery}
          searchPlaceholder={searchPlaceholder}
          statusFilter={listing.statusFilter}
          onStatusFilterChange={listing.setStatusFilter}
          statusOptions={statusFilterOptions}
          categoryFilter={listing.categoryFilter}
          onCategoryFilterChange={listing.setCategoryFilter}
          categoryOptions={categoryOptions}
          sortBy={listing.sortBy}
          onSortChange={listing.setSortBy}
          sortOptions={sortOptions}
          viewMode={listing.viewMode}
          onViewChange={listing.setViewMode}
          onRefresh={listing.simulateRefresh}
          isRefreshing={listing.isLoading}
          onBulkActionsClick={() => listing.selectedIds.size > 0 && listing.openDeleteModal()}
          bulkActionsDisabled={listing.selectedIds.size === 0}
        />
      )}

      <SelectionToolbar
        selectedCount={listing.selectedIds.size}
        onClearSelection={listing.clearSelection}
        bulkActionOptions={bulkActionOptions}
        bulkAction={bulkAction}
        onBulkActionChange={setBulkAction}
        onBulkApply={handleBulkApply}
        onDelete={listing.openDeleteModal}
      />

      <div className={styles.contentArea}>
        {listing.isLoading ? (
          <SkeletonLoader variant={listing.viewMode === 'card' ? 'cards' : 'table'} />
        ) : showEmpty ? (
          <EmptyState
            icon={emptyState?.icon || 'empty'}
            title={emptyState?.title || 'No items found'}
            description={emptyState?.description || 'Try adjusting your search or filters.'}
            action={emptyState?.action ? {
              ...emptyState.action,
              onClick: onPrimaryAction || emptyState.action.onClick,
            } : undefined}
          />
        ) : (
          <div
            key={listing.viewMode}
            className={`${styles.viewContainer} ${styles[listing.viewMode]}`}
          >
            {listing.viewMode === 'table' ? (
              <TableView
                items={listing.paginatedItems}
                columns={columns}
                selectedIds={listing.selectedIds}
                onToggleSelect={listing.toggleSelect}
                onToggleSelectAll={listing.toggleSelectAll}
                isAllSelected={listing.isAllPageSelected}
                isSomeSelected={listing.isSomePageSelected}
              />
            ) : (
              <CardView
                items={listing.paginatedItems}
                selectedIds={listing.selectedIds}
                onToggleSelect={listing.toggleSelect}
                renderCard={renderCard}
              />
            )}
          </div>
        )}
      </div>

      {!listing.isLoading && listing.totalItems > 0 && (
        <Pagination
          currentPage={listing.currentPage}
          totalPages={listing.totalPages}
          totalItems={listing.totalItems}
          perPage={listing.perPage}
          onPageChange={listing.setCurrentPage}
          onPerPageChange={listing.setPerPage}
        />
      )}

      <DeleteModal
        open={listing.deleteModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete the selected items? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />
    </div>
  );
}
