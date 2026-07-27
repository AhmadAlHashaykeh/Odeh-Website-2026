import { useMemo, useState } from 'react';
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
import * as teamCategoriesApi from '../../../../api/teamCategories';
import {
  useModuleApiActions,
  handleListingDelete,
  applyBulkUpdates,
} from '../../hooks/useModuleApiActions';
import { useTeamCategoriesListing } from '../hooks/useTeamCategoriesListing';
import {
  teamCategoriesPageMeta,
  statusFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/teamCategoriesConfig';
import TeamCategoriesToolbar from '../components/TeamCategoriesToolbar';
import TeamCategoriesTableView from '../components/TeamCategoriesTableView';
import TeamCategoryDetailsDrawer from '../components/TeamCategoryDetailsDrawer';
import TeamCategoriesEmptyState from '../components/TeamCategoriesEmptyState';
import TeamCategoriesSkeleton from '../components/TeamCategoriesSkeleton';
import styles from './TeamCategoriesPage.module.css';

export default function TeamCategoriesPage() {
  const listing = useTeamCategoriesListing({ initialPerPage: 50 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useModuleApiActions({
    moduleKey: 'team-categories',
    listing,
    api: teamCategoriesApi,
  });

  const fieldOptions = useMemo(() => {
    const editingId = flows.formDrawer?.item?.id;
    return {
      parentId: [
        { value: '', label: 'None' },
        ...listing.items
          .filter((category) => category.id !== editingId)
          .map((category) => ({
            value: category.id,
            label: category.name,
          })),
      ],
    };
  }, [listing.items, flows.formDrawer?.item?.id]);

  useAdminBreadcrumbs(teamCategoriesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${teamCategoriesPageMeta.title} — ODEH Admin`,
    description: teamCategoriesPageMeta.description,
  });

  const handleBulkApply = async () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
      return;
    }

    await applyBulkUpdates({
      api: teamCategoriesApi,
      listing,
      flows,
      bulkAction,
      payloadMap: {
        activate: { isActive: true },
        deactivate: { isActive: false },
      },
    });
  };

  const handleDeleteConfirm = async () => {
    await handleListingDelete(listing, flows, flows.permissions.canDelete);
  };

  const handleReorder = async (orderedIds) => {
    try {
      await listing.reorderItems(orderedIds);
      flows.showFeedback('Category order updated');
    } catch (error) {
      flows.showFeedback(error?.message || 'Unable to reorder categories.', 'error');
    }
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={teamCategoriesPageMeta.title}
        description={teamCategoriesPageMeta.description}
        breadcrumbs={teamCategoriesPageMeta.breadcrumbs}
        primaryAction={{
          ...teamCategoriesPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
        secondaryActions={teamCategoriesPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <TeamCategoriesSkeleton />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <TeamCategoriesToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            sortBy={listing.sortBy}
            onSortChange={listing.setSortBy}
            sortOptions={sortOptions}
            onRefresh={listing.simulateRefresh}
            isRefreshing={listing.isRefreshing}
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
              <TeamCategoriesEmptyState onCreateCategory={flows.openAddForm} />
            ) : (
              <TeamCategoriesTableView
                items={listing.paginatedItems}
                selectedIds={listing.selectedIds}
                onToggleSelect={listing.toggleSelect}
                onToggleSelectAll={listing.toggleSelectAll}
                isAllSelected={listing.isAllPageSelected}
                isSomeSelected={listing.isSomePageSelected}
                onCategoryClick={listing.openCategory}
                onViewCategory={listing.openCategory}
                onAction={flows.handleQuickAction}
                onReorder={handleReorder}
              />
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
        title="Delete Team Categories"
        message="Categories that still contain members cannot be deleted. Reassign those members first."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <TeamCategoryDetailsDrawer category={listing.activeCategory} onClose={listing.closeCategory} />

      <AdminActionFlowsHost
        moduleKey="team-categories"
        flows={flows}
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
