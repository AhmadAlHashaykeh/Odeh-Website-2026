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
import * as teamRanksApi from '../../../../api/teamRanks';
import { useModuleApiActions, handleListingDelete, applyBulkUpdates } from '../../hooks/useModuleApiActions';
import { useTeamMembersListing } from '../hooks/useTeamMembersListing';
import {
  teamMembersPageMeta,
  statusFilterOptions,
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

const RANK_COLOR_HINTS = {
  'founder-executive': 'blue',
  'associate-partner': 'lime',
  'senior-engineer': 'pink',
  engineer: 'green',
  'academic-expert': 'teal',
  'support-services': 'light blue',
};

export default function TeamMembersPage() {
  const listing = useTeamMembersListing({ initialPerPage: 12 });
  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');
  const [moveTargetId, setMoveTargetId] = useState('');
  const [categoryRecords, setCategoryRecords] = useState([]);
  const [rankRecords, setRankRecords] = useState([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      teamCategoriesApi.list({ per_page: 50, status: 'active', sort: 'display_order' }),
      teamRanksApi.list({ per_page: 50, status: 'active', sort: 'display_order' }),
    ])
      .then(([categoriesResponse, ranksResponse]) => {
        if (cancelled) return;
        setCategoryRecords(categoriesResponse.data ?? []);
        setRankRecords(ranksResponse.data ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setCategoryRecords([]);
        setRankRecords([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sectionOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All sections' },
      ...categoryRecords.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    ];
  }, [categoryRecords]);

  const moveTargetOptions = useMemo(
    () => [
      { value: '', label: 'Choose section…' },
      ...categoryRecords.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    ],
    [categoryRecords],
  );

  const fieldOptions = useMemo(
    () => ({
      teamCategoryId: categoryRecords.map((category) => ({
        value: category.id,
        label: category.name,
      })),
      teamRankId: rankRecords.map((rank) => {
        const hint = RANK_COLOR_HINTS[rank.slug];
        return {
          value: rank.id,
          label: hint ? `${rank.name} (${hint})` : rank.name,
        };
      }),
    }),
    [categoryRecords, rankRecords],
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

  const handleBulkActionChange = (value) => {
    setBulkAction(value);
    if (value !== 'move') {
      setMoveTargetId('');
    }
  };

  const handleBulkApply = async () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
      return;
    }

    if (bulkAction === 'move') {
      if (!moveTargetId) {
        flows.showFeedback('Choose a section to move the selected members into.', 'error');
        return;
      }

      const moved = await applyBulkUpdates({
        api: teamApi,
        listing,
        flows,
        bulkAction: 'move',
        payloadMap: {
          move: { teamCategoryId: moveTargetId },
        },
      });

      if (moved) {
        setMoveTargetId('');
        setBulkAction(bulkActionOptions[0]?.value || 'show');
      }
      return;
    }

    await applyBulkUpdates({
      api: teamApi,
      listing,
      flows,
      bulkAction,
      payloadMap: {
        show: { status: 'active' },
        hide: { status: 'hidden' },
      },
    });
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
            sectionFilter={listing.categoryFilter}
            onSectionFilterChange={listing.setCategoryFilter}
            sectionOptions={sectionOptions}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            sortBy={listing.sortBy}
            onSortChange={listing.setSortBy}
            sortOptions={sortOptions}
            viewMode={listing.viewMode}
            onViewChange={listing.setViewMode}
            onRefresh={listing.simulateRefresh}
            isRefreshing={listing.isRefreshing}
          />

          <SelectionToolbar
            selectedCount={listing.selectedIds.size}
            onClearSelection={listing.clearSelection}
            bulkActionOptions={bulkActionOptions}
            bulkAction={bulkAction}
            onBulkActionChange={handleBulkActionChange}
            onBulkApply={handleBulkApply}
            onDelete={listing.openDeleteModal}
            showTargetForActions={['move']}
            targetOptions={moveTargetOptions}
            targetValue={moveTargetId}
            onTargetChange={setMoveTargetId}
            targetAriaLabel="Move selected members to section"
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
