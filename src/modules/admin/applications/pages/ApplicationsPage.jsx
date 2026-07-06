import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../../api/client';
import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import {
  PageHeader,
  StatisticsStrip,
  Pagination,
  ActionFeedback,
  ConfirmActionModal,
} from '../../cms/components';
import { useApplicationsListing } from '../hooks/useApplicationsListing';
import {
  applicationsPageMeta,
  statusFilterOptions,
  sortOptions,
} from '../mock/applicationsConfig';
import ApplicationsToolbar from '../components/ApplicationsToolbar';
import ApplicationsTableView from '../components/ApplicationsTableView';
import ApplicationsCardView from '../components/ApplicationsCardView';
import ApplicationDetailsDrawer from '../components/ApplicationDetailsDrawer';
import ApplicationNoteModal from '../components/ApplicationNoteModal';
import ApplicationsEmptyState from '../components/ApplicationsEmptyState';
import ApplicationsSkeleton from '../components/ApplicationsSkeleton';
import styles from './ApplicationsPage.module.css';

const STATUS_CONFIRM = {
  'status-reviewed': { title: 'Mark as Reviewed', confirmLabel: 'Mark Reviewed', status: 'reviewed' },
  'status-shortlisted': { title: 'Shortlist Candidate', confirmLabel: 'Shortlist', status: 'shortlisted' },
  'status-hired': { title: 'Hire Candidate', confirmLabel: 'Hire', status: 'hired' },
  'status-rejected': { title: 'Reject Application', confirmLabel: 'Reject', status: 'rejected', variant: 'danger' },
  'status-new': { title: 'Reset to New', confirmLabel: 'Reset to New', status: 'new' },
};

export default function ApplicationsPage() {
  const [searchParams] = useSearchParams();
  const initialJobFilter = searchParams.get('job') || 'all';

  const listing = useApplicationsListing({
    initialPerPage: 12,
    initialJobFilter,
  });

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

  const patchApplication = useCallback(
    async (application, payload, successMessage) => {
      try {
        await listing.updateApplication(application.id, payload);
        await listing.refresh();
        if (listing.activeApplicationId === application.id) {
          await listing.openApplication(application.id);
        }
        showFeedback(successMessage, 'success');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to update application.',
          'error',
        );
      }
    },
    [listing, showFeedback],
  );

  const jobOptions = useMemo(
    () => [
      { value: 'all', label: 'All Jobs' },
      ...listing.jobs.map((job) => ({ value: String(job.id), label: job.title })),
    ],
    [listing.jobs],
  );

  const openStatusConfirm = useCallback(
    (actionId, application) => {
      const config = STATUS_CONFIRM[actionId];
      if (!config) return;

      setConfirm({
        open: true,
        title: config.title,
        message: `Update status for "${application.applicantName}"?`,
        confirmLabel: config.confirmLabel,
        variant: config.variant || 'default',
        onConfirm: async () => {
          closeConfirm();
          await patchApplication(
            application,
            { status: config.status },
            `"${application.applicantName}" updated to ${config.status}.`,
          );
        },
      });
    },
    [closeConfirm, patchApplication],
  );

  const handleDownloadCv = useCallback(
    async (application) => {
      try {
        await listing.downloadCv(application.id, application.cvFileName || 'cv.pdf');
        showFeedback(`Downloading ${application.cvFileName || 'CV file'}.`, 'info');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to download CV.',
          'error',
        );
      }
    },
    [listing, showFeedback],
  );

  const handleOpenLinkedIn = useCallback(
    (application) => {
      if (application.linkedInUrl?.startsWith('http')) {
        window.open(application.linkedInUrl, '_blank', 'noopener,noreferrer');
        showFeedback(`Opened LinkedIn profile for ${application.applicantName}`, 'info');
      } else {
        showFeedback('No valid LinkedIn URL available for this candidate', 'info');
      }
    },
    [showFeedback],
  );

  const handleAddNote = useCallback((application) => {
    setNoteModal({ open: true, application });
  }, []);

  const handleNoteSave = useCallback(
    async (application, note) => {
      setNoteModal({ open: false, application: null });
      await patchApplication(
        application,
        { adminNotes: note },
        `Note saved for ${application.applicantName}.`,
      );
    },
    [patchApplication],
  );

  const handleQuickAction = useCallback(
    (actionId, application) => {
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
        default:
          if (actionId.startsWith('status-')) {
            openStatusConfirm(actionId, application);
          }
          break;
      }
    },
    [handleDownloadCv, handleOpenLinkedIn, handleAddNote, openStatusConfirm],
  );

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={applicationsPageMeta.title}
        description={applicationsPageMeta.description}
        breadcrumbs={applicationsPageMeta.breadcrumbs}
      />

      {listing.isLoading ? (
        <ApplicationsSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <ApplicationsToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            jobFilter={listing.jobFilter}
            onJobFilterChange={listing.setJobFilter}
            jobOptions={jobOptions}
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

          <div className={styles.contentArea}>
            {showEmpty ? (
              <ApplicationsEmptyState />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ApplicationsTableView
                    items={listing.paginatedItems}
                    onApplicationClick={listing.openApplication}
                    onViewApplication={listing.openApplication}
                    onAction={handleQuickAction}
                  />
                ) : (
                  <ApplicationsCardView
                    items={listing.paginatedItems}
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

      <ApplicationDetailsDrawer
        application={listing.activeApplication}
        onClose={listing.closeApplication}
        onAction={handleQuickAction}
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
        onConfirm={confirm.onConfirm}
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
