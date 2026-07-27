import { useEffect, useMemo, useState } from 'react';
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
import * as teamApi from '../../../../api/team';
import * as teamCategoriesApi from '../../../../api/teamCategories';
import { useModuleApiActions, handleListingDelete } from '../../hooks/useModuleApiActions';
import { useTeamMembersListing } from '../hooks/useTeamMembersListing';
import {
  teamMembersPageMeta,
  statusFilterOptions,
  categoryFilterOptions,
  experienceFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/teamMembersConfig';
import TeamMembersToolbar from '../components/TeamMembersToolbar';
import TeamMembersTableView from '../components/TeamMembersTableView';
import TeamMembersCardView from '../components/TeamMembersCardView';
import TeamMemberDetailsDrawer from '../components/TeamMemberDetailsDrawer';
import TeamMembersEmptyState from '../components/TeamMembersEmptyState';
import TeamMembersSkeleton from '../components/TeamMembersSkeleton';
import styles from './TeamMembersPage.module.css';

export default function TeamMembersPage() {
  const listing = useTeamMembersListing({ initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');
  const [categoryRecords, setCategoryRecords] = useState([]);

  useEffect(() => {
    let cancelled = false;

    teamCategoriesApi
      .list({ per_page: 50, status: 'active', sort: 'display_order' })
      .then((response) => {
        if (!cancelled) setCategoryRecords(response.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setCategoryRecords([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const fieldOptions = useMemo(
    () => ({
      teamCategoryId: categoryRecords.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    }),
    [categoryRecords],
  );

  const flows = useModuleApiActions({
    moduleKey: 'team-members',
    listing,
    api: teamApi,
  });

  useAdminBreadcrumbs(teamMembersPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${teamMembersPageMeta.title} — ODEH Admin`,
    description: teamMembersPageMeta.description,
  });

  const departmentOptions = useMemo(
    () => [
      { value: 'all', label: 'All Departments' },
      ...listing.departments.map((dept) => ({ value: dept, label: dept })),
    ],
    [listing.departments],
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
        title={teamMembersPageMeta.title}
        description={teamMembersPageMeta.description}
        breadcrumbs={teamMembersPageMeta.breadcrumbs}
        primaryAction={{
          ...teamMembersPageMeta.primaryAction,
          onClick: flows.openAddForm,
        }}
        secondaryActions={teamMembersPageMeta.secondaryActions}
      />

      {listing.isLoading ? (
        <TeamMembersSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <TeamMembersToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            departmentFilter={listing.departmentFilter}
            onDepartmentFilterChange={listing.setDepartmentFilter}
            departmentOptions={departmentOptions}
            categoryFilter={listing.categoryFilter}
            onCategoryFilterChange={listing.setCategoryFilter}
            categoryOptions={categoryFilterOptions}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
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
              <TeamMembersEmptyState onAddMember={flows.openAddForm} />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <TeamMembersTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onMemberClick={listing.openMember}
                    onViewMember={listing.openMember}
                    onAction={flows.handleQuickAction}
                  />
                ) : (
                  <TeamMembersCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onMemberClick={listing.openMember}
                    onViewMember={listing.openMember}
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
        title="Delete Team Members"
        message="Are you sure you want to delete the selected team members? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <TeamMemberDetailsDrawer
        member={listing.activeMember}
        onClose={listing.closeMember}
      />

      <AdminActionFlowsHost
        moduleKey="team-members"
        flows={flows}
        fieldOptions={fieldOptions}
      />
    </div>
  );
}
