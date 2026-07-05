import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import {
  PageHeader,
  StatisticsStrip,
  Pagination,
  DeleteModal,
  SelectionToolbar,
  ActionFeedback,
  ConfirmActionModal,
} from '../../cms/components';
import { useApplicationsListing } from '../hooks/useApplicationsListing';
import { adminApplications } from '../mock/applicationsData';
import {
  applicationsPageMeta,
  statusFilterOptions,
  experienceFilterOptions,
  submittedDateFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/applicationsConfig';
import ApplicationsToolbar from '../components/ApplicationsToolbar';
import ApplicationsTableView from '../components/ApplicationsTableView';
import ApplicationsCardView from '../components/ApplicationsCardView';
import ApplicationDetailsDrawer from '../components/ApplicationDetailsDrawer';
import ApplicationNoteModal from '../components/ApplicationNoteModal';
import ApplicationsEmptyState from '../components/ApplicationsEmptyState';
import ApplicationsSkeleton from '../components/ApplicationsSkeleton';
import styles from './ApplicationsPage.module.css';

const BULK_FEEDBACK = {
  reviewed: (count) => `${count} application(s) marked as reviewed (preview mode)`,
  shortlisted: (count) => `${count} application(s) shortlisted (preview mode)`,
  rejected: (count) => `${count} application(s) rejected (preview mode)`,
  export: (count) => `${count} application(s) exported (preview mode)`,
};

const STATUS_CONFIRM = {
  'status-reviewed': {
    title: 'Mark as Reviewed',
    message: (name) => `Mark "${name}" as reviewed?`,
    confirmLabel: 'Mark Reviewed',
    feedback: (name) => `"${name}" marked as reviewed (preview mode)`,
  },
  'status-shortlisted': {
    title: 'Shortlist Candidate',
    message: (name) => `Shortlist "${name}" for further consideration?`,
    confirmLabel: 'Shortlist',
    feedback: (name) => `"${name}" shortlisted (preview mode)`,
  },
  'status-hired': {
    title: 'Hire Candidate',
    message: (name) => `Mark "${name}" as hired?`,
    confirmLabel: 'Hire',
    feedback: (name) => `"${name}" marked as hired (preview mode)`,
  },
  'status-rejected': {
    title: 'Reject Application',
    message: (name) => `Reject "${name}"'s application?`,
    confirmLabel: 'Reject',
    feedback: (name) => `"${name}" rejected (preview mode)`,
    variant: 'danger',
  },
  'status-new': {
    title: 'Reset to New',
    message: (name) => `Reset "${name}"'s status to New?`,
    confirmLabel: 'Reset to New',
    feedback: (name) => `"${name}" reset to New (preview mode)`,
  },
};

export default function ApplicationsPage() {
  const [searchParams] = useSearchParams();
  const initialJobFilter = searchParams.get('job') || 'all';

  const listing = useApplicationsListing({
    items: adminApplications,
    initialPerPage: 12,
    initialJobFilter,
  });

  const [bulkAction, setBulkAction] = useState(bulkActionOptions[0]?.value || '');
  const [feedback, setFeedback] = useState({ open: false, message: '', type: 'success' });
  const [confirm, setConfirm] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    variant: 'default',
    onConfirm: null,
  });
  const [noteModal, setNoteModal] = useState({ open: false, application: null });

  useAdminBreadcrumbs(applicationsPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${applicationsPageMeta.title} — ODEH Admin`,
    description: applicationsPageMeta.description,
  });

  const showFeedback = useCallback((message, type = 'success') => {
    setFeedback({ open: true, message, type });
  }, []);

  const hideFeedback = useCallback(() => {
    setFeedback((prev) => ({ ...prev, open: false }));
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirm({
      open: false,
      title: '',
      message: '',
      confirmLabel: 'Confirm',
      variant: 'default',
      onConfirm: null,
    });
  }, []);

  const jobOptions = useMemo(
    () => [
      { value: 'all', label: 'All Jobs' },
      ...listing.jobs.map((job) => ({ value: String(job.id), label: job.title })),
    ],
    [listing.jobs],
  );

  const departmentOptions = useMemo(
    () => [
      { value: 'all', label: 'All Departments' },
      ...listing.departments.map((dept) => ({ value: dept, label: dept })),
    ],
    [listing.departments],
  );

  const handleExport = useCallback(() => {
    showFeedback('Applications export started (preview mode)', 'info');
  }, [showFeedback]);

  const openStatusConfirm = useCallback((actionId, application) => {
    const config = STATUS_CONFIRM[actionId];
    if (!config) return;

    setConfirm({
      open: true,
      title: config.title,
      message: config.message(application.applicantName),
      confirmLabel: config.confirmLabel,
      variant: config.variant || 'default',
      onConfirm: () => {
        closeConfirm();
        showFeedback(config.feedback(application.applicantName));
      },
    });
  }, [closeConfirm, showFeedback]);

  const handleDownloadCv = useCallback((application) => {
    showFeedback(`Downloading ${application.cvFileName} (preview mode)`, 'info');
  }, [showFeedback]);

  const handleOpenLinkedIn = useCallback((application) => {
    if (application.linkedInUrl?.startsWith('http')) {
      window.open(application.linkedInUrl, '_blank', 'noopener,noreferrer');
      showFeedback(`Opened LinkedIn profile for ${application.applicantName}`, 'info');
    } else {
      showFeedback('No valid LinkedIn URL available for this candidate', 'info');
    }
  }, [showFeedback]);

  const handleAddNote = useCallback((application) => {
    setNoteModal({ open: true, application });
  }, []);

  const handleNoteSave = useCallback((application, note) => {
    setNoteModal({ open: false, application: null });
    showFeedback(
      note.trim()
        ? `Note saved for ${application.applicantName} (preview mode)`
        : `Note saved for ${application.applicantName} (preview mode)`,
    );
  }, [showFeedback]);

  const handleQuickAction = useCallback((actionId, application) => {
    switch (actionId) {
      case 'download-cv':
        handleDownloadCv(application);
        break;
      case 'open-linkedin':
        handleOpenLinkedIn(application);
        break;
      case 'add-note':
        handleAddNote(application);
        break;
      case 'delete':
        listing.openDeleteForItem(application);
        break;
      default:
        if (actionId.startsWith('status-')) {
          openStatusConfirm(actionId, application);
        }
        break;
    }
  }, [handleDownloadCv, handleOpenLinkedIn, handleAddNote, listing, openStatusConfirm]);

  const handleBulkApply = () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
      return;
    }

    const message = BULK_FEEDBACK[bulkAction]?.(listing.selectedIds.size);
    if (message) {
      showFeedback(message);
      listing.clearSelection();
    }
  };

  const handleDeleteConfirm = () => {
    listing.closeDeleteModal();
    listing.clearSelection();
    showFeedback('Selected application(s) deleted (preview mode)', 'info');
  };

  const handleConfirm = () => {
    confirm.onConfirm?.();
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  const secondaryActions = applicationsPageMeta.secondaryActions.map((action) => ({
    ...action,
    onClick: handleExport,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={applicationsPageMeta.title}
        description={applicationsPageMeta.description}
        breadcrumbs={applicationsPageMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {listing.isLoading ? (
        <ApplicationsSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          {listing.activeJobFilter && (
            <div className={styles.jobFilterBanner}>
              <span className={styles.jobFilterText}>
                Showing applications for <strong>{listing.activeJobFilter.title}</strong>
              </span>
              <button type="button" className={styles.clearFilterBtn} onClick={listing.clearJobFilter}>
                Clear filter
              </button>
            </div>
          )}

          <ApplicationsToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            jobFilter={listing.jobFilter}
            onJobFilterChange={listing.setJobFilter}
            jobOptions={jobOptions}
            departmentFilter={listing.departmentFilter}
            onDepartmentFilterChange={listing.setDepartmentFilter}
            departmentOptions={departmentOptions}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            experienceFilter={listing.experienceFilter}
            onExperienceFilterChange={listing.setExperienceFilter}
            experienceOptions={experienceFilterOptions}
            submittedDateFilter={listing.submittedDateFilter}
            onSubmittedDateFilterChange={listing.setSubmittedDateFilter}
            submittedDateOptions={submittedDateFilterOptions}
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
              <ApplicationsEmptyState />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ApplicationsTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onApplicationClick={listing.openApplication}
                    onViewApplication={listing.openApplication}
                    onAction={handleQuickAction}
                  />
                ) : (
                  <ApplicationsCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onApplicationClick={listing.openApplication}
                    onViewApplication={listing.openApplication}
                    onAction={handleQuickAction}
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
        title="Delete Applications"
        message="Are you sure you want to delete the selected applications? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <ApplicationDetailsDrawer
        application={listing.activeApplication}
        onClose={listing.closeApplication}
        onStatusAction={openStatusConfirm}
        onDownloadCv={handleDownloadCv}
        onOpenLinkedIn={handleOpenLinkedIn}
        onAddNote={handleAddNote}
      />

      <ApplicationNoteModal
        open={noteModal.open}
        application={noteModal.application}
        onClose={() => setNoteModal({ open: false, application: null })}
        onSave={handleNoteSave}
      />

      <ConfirmActionModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        variant={confirm.variant}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />

      <ActionFeedback
        open={feedback.open}
        message={feedback.message}
        type={feedback.type}
        onClose={hideFeedback}
      />
    </div>
  );
}
