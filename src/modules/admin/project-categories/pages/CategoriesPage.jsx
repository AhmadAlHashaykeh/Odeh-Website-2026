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
import * as projectCategoriesApi from '../../../../api/projectCategories';
import { useModuleApiActions, handleListingDelete } from '../../hooks/useModuleApiActions';
import { useCategoriesListing } from '../hooks/useCategoriesListing';
import {
  categoriesPageMeta,
  statusFilterOptions,
  seoFilterOptions,
  projectCountFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/categoriesConfig';
import CategoriesToolbar from '../components/CategoriesToolbar';
import CategoriesGridView from '../components/CategoriesGridView';
import CategoriesTableView from '../components/CategoriesTableView';
import CategoryDetailsDrawer from '../components/CategoryDetailsDrawer';
import CategoriesEmptyState from '../components/CategoriesEmptyState';
import CategoriesSkeleton from '../components/CategoriesSkeleton';
import styles from './CategoriesPage.module.css';

export default function CategoriesPage() {
  const listing = useCategoriesListing({ initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useModuleApiActions({
    moduleKey: 'categories',
    listing,
    api: projectCategoriesApi,
  });

  useAdminBreadcrumbs(categoriesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${categoriesPageMeta.title} — ODEH Admin`,
    description: categoriesPageMeta.description,
  });

  const handleBulkApply = () => {
    if (bulkAction === 'delete') listing.openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    await handleListingDelete(listing, flows);
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={categoriesPageMeta.title}
        description={categoriesPageMeta.description}
        breadcrumbs={categoriesPageMeta.breadcrumbs}
        primaryAction={{
          ...categoriesPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
        secondaryActions={categoriesPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <CategoriesSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <CategoriesToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            seoFilter={listing.seoFilter}
            onSeoFilterChange={listing.setSeoFilter}
            seoOptions={seoFilterOptions}
            projectCountFilter={listing.projectCountFilter}
            onProjectCountFilterChange={listing.setProjectCountFilter}
            projectCountOptions={projectCountFilterOptions}
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
              <CategoriesEmptyState onCreateCategory={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <CategoriesTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onCategoryClick={listing.openCategory}
                    onViewCategory={listing.openCategory}
                    onAction={flows.handleQuickAction}
                  />
                ) : (
                  <CategoriesGridView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onCategoryClick={listing.openCategory}
                    onViewCategory={listing.openCategory}
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
        title="Delete Categories"
        message="Are you sure you want to delete the selected categories? Projects in these categories will need to be reassigned."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <CategoryDetailsDrawer
        category={listing.activeCategory}
        onClose={listing.closeCategory}
      />

      <AdminActionFlowsHost
        moduleKey="categories"
        flows={flows}
        showLinked
      />
    </div>
  );
}
