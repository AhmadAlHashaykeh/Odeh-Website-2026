import { useCallback, useMemo, useState } from 'react';
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
import { useContactMessagesListing } from '../hooks/useContactMessagesListing';
import { copyToClipboard } from '../../utils/clipboard';
import { adminContactMessages } from '../mock/contactMessagesData';
import {
  contactMessagesPageMeta,
  statusFilterOptions,
  priorityFilterOptions,
  inquiryTypeFilterOptions,
  submittedDateFilterOptions,
  sortOptions,
  bulkActionOptions,
} from '../mock/contactMessagesConfig';
import ContactMessagesToolbar from '../components/ContactMessagesToolbar';
import ContactMessagesTableView from '../components/ContactMessagesTableView';
import ContactMessagesCardView from '../components/ContactMessagesCardView';
import MessageDetailsDrawer from '../components/MessageDetailsDrawer';
import MessageNoteModal from '../components/MessageNoteModal';
import MessageAssignModal from '../components/MessageAssignModal';
import ContactMessagesEmptyState from '../components/ContactMessagesEmptyState';
import ContactMessagesSkeleton from '../components/ContactMessagesSkeleton';
import styles from './ContactMessagesPage.module.css';

const BULK_FEEDBACK = {
  read: (count) => `${count} message(s) marked as read (preview mode)`,
  replied: (count) => `${count} message(s) marked as replied (preview mode)`,
  archived: (count) => `${count} message(s) archived (preview mode)`,
  assign: (count) => `${count} message(s) assigned (preview mode)`,
  export: (count) => `${count} message(s) exported (preview mode)`,
};

const STATUS_CONFIRM = {
  'mark-read': {
    title: 'Mark as Read',
    message: (name) => `Mark message from "${name}" as read?`,
    confirmLabel: 'Mark Read',
    feedback: (name) => `Message from "${name}" marked as read (preview mode)`,
  },
  'mark-replied': {
    title: 'Mark as Replied',
    message: (name) => `Mark message from "${name}" as replied?`,
    confirmLabel: 'Mark Replied',
    feedback: (name) => `Message from "${name}" marked as replied (preview mode)`,
  },
  archive: {
    title: 'Archive Message',
    message: (name) => `Archive message from "${name}"?`,
    confirmLabel: 'Archive',
    feedback: (name) => `Message from "${name}" archived (preview mode)`,
  },
};

export default function ContactMessagesPage() {
  const listing = useContactMessagesListing({
    items: adminContactMessages,
    initialPerPage: 12,
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
  const [noteModal, setNoteModal] = useState({ open: false, message: null });
  const [assignModal, setAssignModal] = useState({ open: false, message: null });

  useAdminBreadcrumbs(contactMessagesPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${contactMessagesPageMeta.title} — ODEH Admin`,
    description: contactMessagesPageMeta.description,
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

  const assignedToOptions = useMemo(
    () => [
      { value: 'all', label: 'All Assignees' },
      { value: 'unassigned', label: 'Unassigned' },
      ...listing.assignees.map((name) => ({ value: name, label: name })),
    ],
    [listing.assignees],
  );

  const handleExport = useCallback(() => {
    showFeedback('Messages export started (preview mode)', 'info');
  }, [showFeedback]);

  const openStatusConfirm = useCallback((actionId, message) => {
    const config = STATUS_CONFIRM[actionId];
    if (!config) return;

    setConfirm({
      open: true,
      title: config.title,
      message: config.message(message.senderName),
      confirmLabel: config.confirmLabel,
      variant: config.variant || 'default',
      onConfirm: () => {
        closeConfirm();
        showFeedback(config.feedback(message.senderName));
      },
    });
  }, [closeConfirm, showFeedback]);

  const handleCopyEmail = useCallback(async (message) => {
    const copied = await copyToClipboard(message.email);
    showFeedback(
      copied
        ? `Email copied: ${message.email}`
        : `Email: ${message.email} (copy not available in preview)`,
      copied ? 'info' : 'info',
    );
  }, [showFeedback]);

  const handleAddNote = useCallback((message) => {
    setNoteModal({ open: true, message });
  }, []);

  const handleNoteSave = useCallback((message, note) => {
    setNoteModal({ open: false, message: null });
    showFeedback(
      note.trim()
        ? `Note saved for ${message.senderName} (preview mode)`
        : `Note saved for ${message.senderName} (preview mode)`,
    );
  }, [showFeedback]);

  const handleAssign = useCallback((message) => {
    setAssignModal({ open: true, message });
  }, []);

  const handleAssignConfirm = useCallback((message, assigneeName) => {
    setAssignModal({ open: false, message: null });
    showFeedback(`Message from ${message.senderName} assigned to ${assigneeName} (preview mode)`);
  }, [showFeedback]);

  const handleQuickAction = useCallback((actionId, message) => {
    switch (actionId) {
      case 'mark-read':
        openStatusConfirm('mark-read', message);
        break;
      case 'mark-replied':
        openStatusConfirm('mark-replied', message);
        break;
      case 'archive':
        openStatusConfirm('archive', message);
        break;
      case 'assign':
        handleAssign(message);
        break;
      case 'add-note':
        handleAddNote(message);
        break;
      case 'copy-email':
        handleCopyEmail(message);
        break;
      case 'delete':
        listing.openDeleteForItem(message);
        break;
      default:
        break;
    }
  }, [openStatusConfirm, handleAssign, handleAddNote, handleCopyEmail, listing]);

  const handleBulkApply = () => {
    if (bulkAction === 'delete') {
      listing.openDeleteModal();
      return;
    }

    if (bulkAction === 'assign') {
      showFeedback(BULK_FEEDBACK.assign(listing.selectedIds.size));
      listing.clearSelection();
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
    showFeedback('Selected message(s) deleted (preview mode)', 'info');
  };

  const handleConfirm = () => {
    confirm.onConfirm?.();
  };

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  const secondaryActions = contactMessagesPageMeta.secondaryActions.map((action) => ({
    ...action,
    onClick: handleExport,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={contactMessagesPageMeta.title}
        description={contactMessagesPageMeta.description}
        breadcrumbs={contactMessagesPageMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {listing.isLoading ? (
        <ContactMessagesSkeleton viewMode={listing.viewMode} />
      ) : (
        <>
          <StatisticsStrip statistics={listing.statistics} />

          <ContactMessagesToolbar
            searchValue={listing.searchQuery}
            onSearchChange={listing.setSearchQuery}
            statusFilter={listing.statusFilter}
            onStatusFilterChange={listing.setStatusFilter}
            statusOptions={statusFilterOptions}
            priorityFilter={listing.priorityFilter}
            onPriorityFilterChange={listing.setPriorityFilter}
            priorityOptions={priorityFilterOptions}
            inquiryTypeFilter={listing.inquiryTypeFilter}
            onInquiryTypeFilterChange={listing.setInquiryTypeFilter}
            inquiryTypeOptions={inquiryTypeFilterOptions}
            assignedToFilter={listing.assignedToFilter}
            onAssignedToFilterChange={listing.setAssignedToFilter}
            assignedToOptions={assignedToOptions}
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
              <ContactMessagesEmptyState />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ContactMessagesTableView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onToggleSelectAll={listing.toggleSelectAll}
                    isAllSelected={listing.isAllPageSelected}
                    isSomeSelected={listing.isSomePageSelected}
                    onMessageClick={listing.openMessage}
                    onViewMessage={listing.openMessage}
                    onAction={handleQuickAction}
                  />
                ) : (
                  <ContactMessagesCardView
                    items={listing.paginatedItems}
                    selectedIds={listing.selectedIds}
                    onToggleSelect={listing.toggleSelect}
                    onMessageClick={listing.openMessage}
                    onViewMessage={listing.openMessage}
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
        title="Delete Messages"
        message="Are you sure you want to delete the selected messages? This action cannot be undone."
        itemCount={listing.selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={listing.closeDeleteModal}
      />

      <MessageDetailsDrawer
        message={listing.activeMessage}
        onClose={listing.closeMessage}
        onMarkRead={(msg) => openStatusConfirm('mark-read', msg)}
        onMarkReplied={(msg) => openStatusConfirm('mark-replied', msg)}
        onArchive={(msg) => openStatusConfirm('archive', msg)}
        onAssign={handleAssign}
        onAddNote={handleAddNote}
        onCopyEmail={handleCopyEmail}
      />

      <MessageNoteModal
        open={noteModal.open}
        message={noteModal.message}
        onClose={() => setNoteModal({ open: false, message: null })}
        onSave={handleNoteSave}
      />

      <MessageAssignModal
        open={assignModal.open}
        message={assignModal.message}
        onClose={() => setAssignModal({ open: false, message: null })}
        onAssign={handleAssignConfirm}
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
