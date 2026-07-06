import { useCallback, useMemo, useState } from 'react';
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
import { useContactMessagesListing } from '../hooks/useContactMessagesListing';
import { copyToClipboard } from '../../utils/clipboard';
import {
  contactMessagesPageMeta,
  statusFilterOptions,
  priorityFilterOptions,
  sortOptions,
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

const STATUS_MAP = {
  'mark-read': 'read',
  'mark-replied': 'replied',
  archive: 'archived',
};

const STATUS_CONFIRM = {
  'mark-read': {
    title: 'Mark as Read',
    message: (name) => `Mark message from "${name}" as read?`,
    confirmLabel: 'Mark Read',
    status: 'read',
  },
  'mark-replied': {
    title: 'Mark as Replied',
    message: (name) => `Mark message from "${name}" as replied?`,
    confirmLabel: 'Mark Replied',
    status: 'replied',
  },
  archive: {
    title: 'Archive Message',
    message: (name) => `Archive message from "${name}"?`,
    confirmLabel: 'Archive',
    status: 'archived',
  },
};

export default function ContactMessagesPage() {
  const listing = useContactMessagesListing({ initialPerPage: 12 });
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

  const patchMessage = useCallback(
    async (message, payload, successMessage) => {
      try {
        await listing.updateMessage(message.id, payload);
        await listing.refresh();
        if (listing.activeMessageId === message.id) {
          await listing.openMessage(message.id);
        }
        showFeedback(successMessage, 'success');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to update message.',
          'error',
        );
      }
    },
    [listing, showFeedback],
  );

  const assignedToOptions = useMemo(
    () => [
      { value: 'all', label: 'All Assignees' },
      { value: 'unassigned', label: 'Unassigned' },
      ...listing.assignees.map((user) => ({
        value: user.id,
        label: user.fullName,
      })),
    ],
    [listing.assignees],
  );

  const assigneeOptions = useMemo(
    () =>
      listing.assignees.map((user) => ({
        value: user.id,
        label: user.fullName,
      })),
    [listing.assignees],
  );

  const openStatusConfirm = useCallback(
    (actionId, message) => {
      const config = STATUS_CONFIRM[actionId];
      if (!config) return;

      setConfirm({
        open: true,
        title: config.title,
        message: config.message(message.senderName),
        confirmLabel: config.confirmLabel,
        variant: 'default',
        onConfirm: async () => {
          closeConfirm();
          await patchMessage(
            message,
            { status: config.status },
            `Message from "${message.senderName}" marked as ${config.status}.`,
          );
        },
      });
    },
    [closeConfirm, patchMessage],
  );

  const handleCopyEmail = useCallback(
    async (message) => {
      const copied = await copyToClipboard(message.email);
      showFeedback(
        copied ? `Email copied: ${message.email}` : `Email: ${message.email}`,
        'info',
      );
    },
    [showFeedback],
  );

  const handleAddNote = useCallback((message) => {
    setNoteModal({ open: true, message });
  }, []);

  const handleNoteSave = useCallback(
    async (message, note) => {
      setNoteModal({ open: false, message: null });
      await patchMessage(message, { adminNotes: note }, `Note saved for ${message.senderName}.`);
    },
    [patchMessage],
  );

  const handleAssign = useCallback((message) => {
    setAssignModal({ open: true, message });
  }, []);

  const handleAssignConfirm = useCallback(
    async (message, assigneeId, assigneeName) => {
      setAssignModal({ open: false, message: null });
      await patchMessage(
        message,
        { assignedUserId: assigneeId },
        `Message from ${message.senderName} assigned to ${assigneeName}.`,
      );
    },
    [patchMessage],
  );

  const handleQuickAction = useCallback(
    (actionId, message) => {
      switch (actionId) {
        case 'mark-read':
        case 'mark-replied':
        case 'archive':
          openStatusConfirm(actionId, message);
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
        default:
          break;
      }
    },
    [openStatusConfirm, handleAssign, handleAddNote, handleCopyEmail],
  );

  const showEmpty = !listing.isLoading && listing.paginatedItems.length === 0;

  return (
    <div className={styles.page}>
      <PageHeader
        title={contactMessagesPageMeta.title}
        description={contactMessagesPageMeta.description}
        breadcrumbs={contactMessagesPageMeta.breadcrumbs}
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
            assignedToFilter={listing.assignedToFilter}
            onAssignedToFilterChange={listing.setAssignedToFilter}
            assignedToOptions={assignedToOptions}
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
              <ContactMessagesEmptyState />
            ) : (
              <div key={listing.viewMode} className={styles.viewContainer}>
                {listing.viewMode === 'table' ? (
                  <ContactMessagesTableView
                    items={listing.paginatedItems}
                    onMessageClick={listing.openMessage}
                    onViewMessage={listing.openMessage}
                    onAction={handleQuickAction}
                  />
                ) : (
                  <ContactMessagesCardView
                    items={listing.paginatedItems}
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
        assigneeOptions={assigneeOptions}
        onClose={() => setAssignModal({ open: false, message: null })}
        onAssign={handleAssignConfirm}
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
