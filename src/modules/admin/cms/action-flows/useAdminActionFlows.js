import { useCallback, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { getItemLabel } from './mapItemToForm';
import { copyToClipboard } from '../../utils/clipboard';

const INITIAL_CONFIRM = {
  open: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  variant: 'default',
  icon: 'check',
  onConfirm: null,
};

export function useAdminActionFlows({ moduleKey, onDeleteItem } = {}) {
  const [formDrawer, setFormDrawer] = useState({ open: false, mode: 'add', item: null });
  const [galleryDrawer, setGalleryDrawer] = useState({ open: false, item: null });
  const [linkedDrawer, setLinkedDrawer] = useState({ open: false, item: null });
  const [confirm, setConfirm] = useState(INITIAL_CONFIRM);
  const { feedback, showFeedback, closeFeedback: hideFeedback } = useActionFeedback();

  const closeConfirm = useCallback(() => {
    setConfirm(INITIAL_CONFIRM);
  }, []);

  const openAddForm = useCallback(() => {
    setFormDrawer({ open: true, mode: 'add', item: null });
  }, []);

  const openEditForm = useCallback((item) => {
    setFormDrawer({ open: true, mode: 'edit', item });
  }, []);

  const closeFormDrawer = useCallback(() => {
    setFormDrawer({ open: false, mode: 'add', item: null });
  }, []);

  const openGalleryDrawer = useCallback((item) => {
    setGalleryDrawer({ open: true, item });
  }, []);

  const closeGalleryDrawer = useCallback(() => {
    setGalleryDrawer({ open: false, item: null });
  }, []);

  const openLinkedDrawer = useCallback((item) => {
    setLinkedDrawer({ open: true, item });
  }, []);

  const closeLinkedDrawer = useCallback(() => {
    setLinkedDrawer({ open: false, item: null });
  }, []);

  const handleFormSave = useCallback(() => {
    const label = formDrawer.mode === 'edit'
      ? getItemLabel(moduleKey, formDrawer.item)
      : 'Item';
    showFeedback(
      formDrawer.mode === 'edit'
        ? `Changes saved for "${label}" (preview mode)`
        : 'Item saved successfully (preview mode)',
    );
    closeFormDrawer();
  }, [formDrawer, moduleKey, showFeedback, closeFormDrawer]);

  const handleGallerySave = useCallback(() => {
    const label = getItemLabel(moduleKey, galleryDrawer.item);
    showFeedback(`Gallery updated for "${label}" (preview mode)`);
    closeGalleryDrawer();
  }, [galleryDrawer.item, moduleKey, showFeedback, closeGalleryDrawer]);

  const openDuplicateConfirm = useCallback((item) => {
    const label = getItemLabel(moduleKey, item);
    setConfirm({
      open: true,
      title: 'Duplicate Item',
      message: `Create a copy of "${label}"?`,
      confirmLabel: 'Duplicate',
      variant: 'accent',
      icon: 'copy',
      onConfirm: () => {
        closeConfirm();
        showFeedback(`"${label}" duplicated (preview mode)`);
      },
    });
  }, [moduleKey, closeConfirm, showFeedback]);

  const openStatusConfirm = useCallback((item, action) => {
    const label = getItemLabel(moduleKey, item);
    const messages = {
      publish: { title: 'Publish Item', message: `Publish "${label}" on the website?`, confirmLabel: 'Publish', feedback: `"${label}" published (preview mode)` },
      unpublish: { title: 'Unpublish Item', message: `Remove "${label}" from the website?`, confirmLabel: 'Unpublish', feedback: `"${label}" unpublished (preview mode)` },
      hide: { title: 'Hide Category', message: `Hide "${label}" from the website?`, confirmLabel: 'Hide', feedback: `"${label}" hidden (preview mode)` },
      show: { title: 'Show Item', message: `Make "${label}" visible on the website?`, confirmLabel: 'Show', feedback: `"${label}" is now visible (preview mode)` },
      feature: { title: 'Feature Item', message: `Feature "${label}" on the website?`, confirmLabel: 'Feature', feedback: `"${label}" featured (preview mode)` },
      unfeature: { title: 'Unfeature Item', message: `Remove "${label}" from featured items?`, confirmLabel: 'Unfeature', feedback: `"${label}" unfeatured (preview mode)` },
      'add-homepage': { title: 'Add to Homepage', message: `Add "${label}" to the homepage services carousel?`, confirmLabel: 'Add to Homepage', feedback: `"${label}" added to homepage (preview mode)` },
      'remove-homepage': { title: 'Remove from Homepage', message: `Remove "${label}" from the homepage services carousel?`, confirmLabel: 'Remove', feedback: `"${label}" removed from homepage (preview mode)` },
      'open-job': { title: 'Open Job', message: `Reopen "${label}" for applications?`, confirmLabel: 'Open Job', feedback: `"${label}" is now open (preview mode)` },
      'close-job': { title: 'Close Job', message: `Close "${label}" and stop accepting applications?`, confirmLabel: 'Close Job', feedback: `"${label}" is now closed (preview mode)` },
    };

    const config = messages[action];
    if (!config) return;

    setConfirm({
      open: true,
      title: config.title,
      message: config.message,
      confirmLabel: config.confirmLabel,
      variant: 'default',
      icon: action.includes('feature') ? 'star' : 'external',
      onConfirm: () => {
        closeConfirm();
        showFeedback(config.feedback);
      },
    });
  }, [moduleKey, closeConfirm, showFeedback]);

  const handleQuickAction = useCallback((actionId, item) => {
    switch (actionId) {
      case 'edit':
        openEditForm(item);
        break;
      case 'duplicate':
        openDuplicateConfirm(item);
        break;
      case 'gallery':
        openGalleryDrawer(item);
        break;
      case 'manage':
        openLinkedDrawer(item);
        break;
      case 'delete':
        onDeleteItem?.(item);
        break;
      case 'publish':
        if (moduleKey === 'categories') {
          openStatusConfirm(item, 'publish');
        } else {
          openStatusConfirm(
            item,
            item?.published === false || item?.status === 'draft' ? 'publish' : 'unpublish',
          );
        }
        break;
      case 'hide':
        openStatusConfirm(item, item?.published ? 'hide' : 'show');
        break;
      case 'toggle-visibility':
        if (moduleKey === 'services') {
          openStatusConfirm(item, item?.status === 'hidden' ? 'show' : 'hide');
        } else {
          openStatusConfirm(item, item?.status === 'hidden' || item?.status === 'draft' ? 'show' : 'hide');
        }
        break;
      case 'toggle-homepage':
        openStatusConfirm(item, item?.usedOnHomepage ? 'remove-homepage' : 'add-homepage');
        break;
      case 'feature':
        openStatusConfirm(item, item?.featured ? 'unfeature' : 'feature');
        break;
      case 'toggle-status':
        if (moduleKey === 'careers') {
          openStatusConfirm(item, item?.status === 'open' ? 'close-job' : 'open-job');
        }
        break;
      case 'view-applications':
        showFeedback('Applications module is coming next. Preview mode only.', 'info');
        break;
      case 'copy-email':
        if (item?.email) {
          copyToClipboard(item.email);
        }
        showFeedback(
          item?.email
            ? `Email copied: ${item.email}`
            : 'Email copied to clipboard',
          'info',
        );
        break;
      default:
        break;
    }
  }, [
    moduleKey,
    openEditForm,
    openDuplicateConfirm,
    openGalleryDrawer,
    openLinkedDrawer,
    onDeleteItem,
    openStatusConfirm,
    showFeedback,
  ]);

  const handleConfirm = useCallback(() => {
    confirm.onConfirm?.();
  }, [confirm]);

  return {
    formDrawer,
    galleryDrawer,
    linkedDrawer,
    confirm,
    feedback,
    openAddForm,
    openEditForm,
    closeFormDrawer,
    openGalleryDrawer,
    closeGalleryDrawer,
    openLinkedDrawer,
    closeLinkedDrawer,
    handleQuickAction,
    handleFormSave,
    handleGallerySave,
    handleConfirm,
    closeConfirm,
    showFeedback,
    hideFeedback,
  };
}
