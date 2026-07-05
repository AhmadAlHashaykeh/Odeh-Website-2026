import { useState } from 'react';
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
import { useServicesListing } from '../hooks/useServicesListing';
import { adminServices } from '../mock/servicesData';
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

const BULK_FEEDBACK = {
  publish: (count) => `${count} service(s) published (preview mode)`,
  hide: (count) => `${count} service(s) hidden (preview mode)`,
  'add-homepage': (count) => `${count} service(s) added to homepage (preview mode)`,
  'remove-homepage': (count) => `${count} service(s) removed from homepage (preview mode)`,
  export: (count) => `${count} service(s) exported (preview mode)`,
};

export default function ServicesPage() {
  const listing = useServicesListing({ items: adminServices, initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useAdminActionFlows({
    moduleKey: 'services',
    onDeleteItem: listing.openDeleteForItem,
  });

  useAdminBreadcrumbs(servicesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${servicesPageMeta.title} — ODEH Admin`,
    description: servicesPageMeta.description,
  });

  const handleBulkApply = () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
      return;
    }

    const message = BULK_FEEDBACK[bulkAction]?.(listing.selectedIds.size);
    if (message) {
      flows.showFeedback(message);
      listing.clearSelection();
    }
  };

  const handleDeleteConfirm = () => {
    listing.closeDeleteModal();
    listing.clearSelection();
    flows.showFeedback('Selected service(s) deleted (preview mode)', 'info');
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={servicesPageMeta.title}
        description={servicesPageMeta.description}
        breadcrumbs={servicesPageMeta.breadcrumbs}
        primaryAction={{
          ...servicesPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
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
