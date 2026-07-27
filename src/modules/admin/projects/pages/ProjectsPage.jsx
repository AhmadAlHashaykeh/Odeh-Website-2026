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
import * as projectsApi from '../../../../api/projects';
import { useModuleApiActions, handleListingDelete } from '../../hooks/useModuleApiActions';
import { useProjectsListing } from '../hooks/useProjectsListing';
import {
  projectsPageMeta,
  statusFilterOptions,
  publishedFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/projectsConfig';
import ProjectsToolbar from '../components/ProjectsToolbar';
import ProjectsTableView from '../components/ProjectsTableView';
import ProjectsCardView from '../components/ProjectsCardView';
import ProjectDetailsDrawer from '../components/ProjectDetailsDrawer';
import ProjectsEmptyState from '../components/ProjectsEmptyState';
import ProjectsSkeleton from '../components/ProjectsSkeleton';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const listing = useProjectsListing({ initialPerPage: 10 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const fieldOptions = useMemo(
    () => ({
      category: listing.categoryRecords.map((category) => ({
        value: category.title,
        label: category.title,
      })),
    }),
    [listing.categoryRecords],
  );

  const flows = useModuleApiActions({
    moduleKey: 'projects',
    listing,
    api: projectsApi,
    apiContext: { categories: listing.categoryRecords },
    enableGallery: true,
  });

  useAdminBreadcrumbs(projectsPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${projectsPageMeta.title} — ODEH Admin`,
    description: projectsPageMeta.description,
  });

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...listing.categories.map((cat) => ({ value: cat, label: cat })),
    ],
    [listing.categories],
  );

  const yearOptions = useMemo(
    () => [
      { value: 'all', label: 'All Years' },
      ...listing.years.map((year) => ({ value: year, label: year })),
    ],
    [listing.years],
  );

  const typeOptions = useMemo(
    () => [
      { value: 'all', label: 'All Types' },
      ...listing.projectTypes.map((type) => ({ value: type, label: type })),
    ],
    [listing.projectTypes],
  );

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
        title={projectsPageMeta.title}
        description={projectsPageMeta.description}
        breadcrumbs={projectsPageMeta.breadcrumbs}
        primaryAction={{
          ...projectsPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
        secondaryActions={projectsPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <ProjectsSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <ProjectsToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            categoryFilter={listing.categoryFilter}
            onCategoryFilterChange={listing.setCategoryFilter}
            categoryOptions={categoryOptions}
            publishedFilter={listing.publishedFilter}
            onPublishedFilterChange={listing.setPublishedFilter}
            publishedOptions={publishedFilterOptions}
            yearFilter={listing.yearFilter}
            onYearFilterChange={listing.setYearFilter}
            yearOptions={yearOptions}
            typeFilter={listing.typeFilter}
            onTypeFilterChange={listing.setTypeFilter}
            typeOptions={typeOptions}
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
              <ProjectsEmptyState onAddProject={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ProjectsTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onProjectClick={listing.openProject}
                    onViewProject={listing.openProject}
                    onAction={flows.handleQuickAction}
                  />
                ) : (
                  <ProjectsCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onProjectClick={listing.openProject}
                    onViewProject={listing.openProject}
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
        title="Delete Projects"
        message="Are you sure you want to delete the selected projects? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <ProjectDetailsDrawer
        project={listing.activeProject}
        onClose={listing.closeProject}
      />

      <AdminActionFlowsHost
        moduleKey="projects"
        flows={flows}
        showGallery
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
