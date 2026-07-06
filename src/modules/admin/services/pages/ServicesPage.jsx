import { useState } from 'react';
import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import {
  PageHeader,
  StatisticsStrip,
  Pagination,
  DeleteModal,
  SelectionToolbar,
  AdminActionFlowsHost,
} from '../../cms/components';
import * as servicesApi from '../../../../api/services';
import { useModuleApiActions, handleListingDelete, applyBulkUpdates } from '../../hooks/useModuleApiActions';
import { useServicesListing } from '../hooks/useServicesListing';
import {
  servicesPageMeta,
  statusFilterOptions,
  homepageFilterOptions,
  seoFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/servicesConfig';
import ServicesToolbar from '../components/ServicesToolbar';
import ServicesTableView from '../components/ServicesTableView';
import ServicesCardView from '../components/ServicesCardView';
import ServiceDetailsDrawer from '../components/ServiceDetailsDrawer';
import ServicesEmptyState from '../components/ServicesEmptyState';
import ServicesSkeleton from '../components/ServicesSkeleton';
import styles from './ServicesPage.module.css';

const BULK_STATUS_MAP = {
  publish: { status: 'published' },
  hide: { status: 'hidden' },
  'add-homepage': { usedOnHomepage: true },
  'remove-homepage': { usedOnHomepage: false },
};

export default function ServicesPage() {
  const listing = useServicesListing({ initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useModuleApiActions({
    moduleKey: 'services',
    listing,
    api: servicesApi,
  });

  useAdminBreadcrumbs(servicesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${servicesPageMeta.title} — ODEH Admin`,
    description: servicesPageMeta.description,
  });

  const handleBulkApply = async () => {
    if (bulkAction === 'delete') {
      if (!flows.permissions.canDelete) {
        flows.showFeedback('You do not have permission to delete items.', 'error');
        return;
      }
      listing.openDeleteModal();
      return;
    }

    if (!flows.permissions.canEdit) {
      flows.showFeedback('You do not have permission to edit items.', 'error');
      return;
    }

    await applyBulkUpdates({
      api: servicesApi,
      listing,
      flows,
      payloadMap: BULK_STATUS_MAP,
      bulkAction,
    });
  };

  const handleDeleteConfirm = async () => {
    await handleListingDelete(listing, flows, flows.permissions.canDelete);
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={servicesPageMeta.title}
        description={servicesPageMeta.description}
        breadcrumbs={servicesPageMeta.breadcrumbs}
        primaryAction={
          flows.permissions.canCreate
            ? { ...servicesPageMeta.primaryAction, onClick: flows.openAddForm }
            : undefined
        }
        secondaryActions={servicesPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <ServicesSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <ServicesToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            homepageFilter={listing.homepageFilter}
            onHomepageFilterChange={listing.setHomepageFilter}
            homepageOptions={homepageFilterOptions}
            seoFilter={listing.seoFilter}
            onSeoFilterChange={listing.setSeoFilter}
            seoOptions={seoFilterOptions}
            sortBy={listing.sortBy}
            onSortChange={listing.setSortBy}
            sortOptions={sortOptions}
            viewMode={listing.viewMode}
            onViewChange={listing.setViewMode}
            onRefresh={listing.simulateRefresh}
            isRefreshing={listing.isRefreshing}
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
              <ServicesEmptyState onAddService={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ServicesTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onServiceClick={listing.openService}
                    onViewService={listing.openService}
                    onAction={flows.handleQuickAction}
                  />
                ) : (
                  <ServicesCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onServiceClick={listing.openService}
                    onViewService={listing.openService}
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
        title="Delete Services"
        message="Are you sure you want to delete the selected services? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <ServiceDetailsDrawer
        service={listing.activeService}
        onClose={listing.closeService}
      />

      <AdminActionFlowsHost moduleKey="services" flows={flows} />
    </div>
  );
}
