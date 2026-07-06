import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import * as jobsApi from '../../../../api/jobs';
import { useModuleApiActions, handleListingDelete, applyBulkUpdates } from '../../hooks/useModuleApiActions';
import { useCareersListing } from '../hooks/useCareersListing';
import {
  careersPageMeta,
  statusFilterOptions,
  employmentTypeFilterOptions,
  workModeFilterOptions,
  experienceFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/careersConfig';
import CareersToolbar from '../components/CareersToolbar';
import CareersTableView from '../components/CareersTableView';
import CareersCardView from '../components/CareersCardView';
import JobDetailsDrawer from '../components/JobDetailsDrawer';
import CareersEmptyState from '../components/CareersEmptyState';
import CareersSkeleton from '../components/CareersSkeleton';
import styles from './CareersPage.module.css';

const BULK_STATUS_MAP = {
  open: { status: 'open' },
  close: { status: 'closed' },
  draft: { status: 'draft' },
};

export default function CareersPage() {
  const navigate = useNavigate();
  const listing = useCareersListing({ initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');

  const flows = useModuleApiActions({
    moduleKey: 'careers',
    listing,
    api: jobsApi,
  });

  const handleJobAction = useCallback((actionId, item) => {
    if (actionId === 'view-applications') {
      navigate(`/admin/applications?job=${item.id}`);
      return;
    }
    flows.handleQuickAction(actionId, item);
  }, [navigate, flows]);

  useAdminBreadcrumbs(careersPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${careersPageMeta.title} — ODEH Admin`,
    description: careersPageMeta.description,
  });

  const departmentOptions = useMemo(
    () => [
      { value: 'all', label: 'All Departments' },
      ...listing.departments.map((dept) => ({ value: dept, label: dept })),
    ],
    [listing.departments],
  );

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
      api: jobsApi,
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
        title={careersPageMeta.title}
        description={careersPageMeta.description}
        breadcrumbs={careersPageMeta.breadcrumbs}
        primaryAction={
          flows.permissions.canCreate
            ? { ...careersPageMeta.primaryAction, onClick: flows.openAddForm }
            : undefined
        }
        secondaryActions={careersPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <CareersSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <CareersToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            departmentFilter={listing.departmentFilter}
            onDepartmentFilterChange={listing.setDepartmentFilter}
            departmentOptions={departmentOptions}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            employmentTypeFilter={listing.employmentTypeFilter}
            onEmploymentTypeFilterChange={listing.setEmploymentTypeFilter}
            employmentTypeOptions={employmentTypeFilterOptions}
            workModeFilter={listing.workModeFilter}
            onWorkModeFilterChange={listing.setWorkModeFilter}
            workModeOptions={workModeFilterOptions}
            experienceFilter={listing.experienceFilter}
            onExperienceFilterChange={listing.setExperienceFilter}
            experienceOptions={experienceFilterOptions}
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
              <CareersEmptyState onAddJob={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <CareersTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onJobClick={listing.openJob}
                    onViewJob={listing.openJob}
                    onAction={handleJobAction}
                  />
                ) : (
                  <CareersCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onJobClick={listing.openJob}
                    onViewJob={listing.openJob}
                    onAction={handleJobAction}
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
        title="Delete Jobs"
        message="Are you sure you want to delete the selected job listings? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <JobDetailsDrawer
        job={listing.activeJob}
        onClose={listing.closeJob}
      />

      <AdminActionFlowsHost moduleKey="careers" flows={flows} />
    </div>
  );
}
