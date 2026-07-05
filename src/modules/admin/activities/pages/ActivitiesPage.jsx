import { useMemo, useState } from 'react';
import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import {
  PageHeader,
  StatisticsStrip,
  Pagination,
  DeleteModal,
  SelectionToolbar,
  useAdminActionFlows,
  AdminActionFlowsHost,
} from '../../cms/components';
import { useActivitiesListing } from '../hooks/useActivitiesListing';
import { adminActivities } from '../mock/activitiesData';
import {
  activitiesPageMeta,
  statusFilterOptions,
  featuredFilterOptions,
  gallerySizeFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/activitiesConfig';
import ActivitiesToolbar from '../components/ActivitiesToolbar';
import ActivitiesTableView from '../components/ActivitiesTableView';
import ActivitiesEditorialGrid from '../components/ActivitiesEditorialGrid';
import ActivityDetailsDrawer from '../components/ActivityDetailsDrawer';
import ActivitiesEmptyState from '../components/ActivitiesEmptyState';
import ActivitiesSkeleton from '../components/ActivitiesSkeleton';
import styles from './ActivitiesPage.module.css';

export default function ActivitiesPage() {
  const listing = useActivitiesListing({ items: adminActivities, initialPerPage: 8 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useAdminActionFlows({
    moduleKey: 'activities',
    onDeleteItem: listing.openDeleteForItem,
  });

  useAdminBreadcrumbs(activitiesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${activitiesPageMeta.title} — ODEH Admin`,
    description: activitiesPageMeta.description,
  });

  const yearOptions = useMemo(
    () => [
      { value: 'all', label: 'All Years' },
      ...listing.years.map((year) => ({ value: year, label: year })),
    ],
    [listing.years],
  );

  const handleBulkApply = () => {
    if (bulkAction === 'delete') listing.openDeleteModal();
  };

  const handleDeleteConfirm = () => {
    listing.closeDeleteModal();
    listing.clearSelection();
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={activitiesPageMeta.title}
        description={activitiesPageMeta.description}
        breadcrumbs={activitiesPageMeta.breadcrumbs}
        primaryAction={{
          ...activitiesPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
        secondaryActions={activitiesPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <ActivitiesSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <ActivitiesToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            featuredFilter={listing.featuredFilter}
            onFeaturedFilterChange={listing.setFeaturedFilter}
            featuredOptions={featuredFilterOptions}
            yearFilter={listing.yearFilter}
            onYearFilterChange={listing.setYearFilter}
            yearOptions={yearOptions}
            gallerySizeFilter={listing.gallerySizeFilter}
            onGallerySizeFilterChange={listing.setGallerySizeFilter}
            gallerySizeOptions={gallerySizeFilterOptions}
            sortBy={listing.sortBy}
            onSortChange={listing.setSortBy}
            sortOptions={sortOptions}
            viewMode={listing.viewMode}
            onViewChange={listing.setViewMode}
            onRefresh={listing.simulateRefresh}
            isRefreshing={listing.isLoading}
            onBulkActionsClick={listing.openDeleteModal}
            bulkActionsDisabled={listing.selectedIds.size === 0}
          />

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
            {showEmpty ? (
              <ActivitiesEmptyState onAddActivity={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ActivitiesTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onActivityClick={listing.openActivity}
                    onViewActivity={listing.openActivity}
                    onAction={flows.handleQuickAction}
                  />
                ) : (
                  <ActivitiesEditorialGrid
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onActivityClick={listing.openActivity}
                    onViewActivity={listing.openActivity}
                    onAction={flows.handleQuickAction}
                  />
                )}
              </div>
            )}
          </div>

          {!showEmpty && (
            <Pagination
              currentPage={listing.currentPage}
              totalPages={listing.totalPages}
              totalItems={listing.totalItems}
              perPage={listing.perPage}
              onPageChange={listing.setCurrentPage}
              onPerPageChange={listing.setPerPage}
            />
          )}
        </>
      )}

      <DeleteModal
        open={listing.deleteModalOpen}
        title="Delete Activities"
        message="Are you sure you want to delete the selected activities? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <ActivityDetailsDrawer
        activity={listing.activeActivity}
        onClose={listing.closeActivity}
      />

      <AdminActionFlowsHost
        moduleKey="activities"
        flows={flows}
        showGallery
      />
    </div>
  );
}
