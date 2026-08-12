import { useCallback, useState } from 'react';
import { ApiError } from '../../../../api/client';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { mapApiErrorsToForm } from './formErrors';
import { extractFormValues, mapFormValuesToApi } from './mapFormValuesToApi';
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

export function useAdminActionFlows({
  moduleKey,
  onDeleteItem,
  onFormSave,
  onGallerySave,
  onStatusChange,
  onDuplicate,
  apiContext = {},
} = {}) {
  const [formDrawer, setFormDrawer] = useState({ open: false, mode: 'add', item: null });
  const [galleryDrawer, setGalleryDrawer] = useState({ open: false, item: null });
  const [linkedDrawer, setLinkedDrawer] = useState({ open: false, item: null });
  const [confirm, setConfirm] = useState(INITIAL_CONFIRM);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { feedback, showFeedback, closeFeedback: hideFeedback } = useActionFeedback();

  const closeConfirm = useCallback(() => {
    setConfirm(INITIAL_CONFIRM);
  }, []);

  const openAddForm = useCallback(() => {
    setFormErrors({});
    setFormDrawer({ open: true, mode: 'add', item: null });
  }, []);

  const openEditForm = useCallback((item) => {
    setFormErrors({});
    setFormDrawer({ open: true, mode: 'edit', item });
  }, []);

  const closeFormDrawer = useCallback(() => {
    if (isSubmitting) return;
    setFormErrors({});
    setFormDrawer({ open: false, mode: 'add', item: null });
  }, [isSubmitting]);

  const openGalleryDrawer = useCallback((item) => {
    setGalleryDrawer({ open: true, item });
  }, []);

  const closeGalleryDrawer = useCallback(() => {
    if (isSubmitting) return;
    setGalleryDrawer({ open: false, item: null });
  }, [isSubmitting]);

  const openLinkedDrawer = useCallback((item) => {
    setLinkedDrawer({ open: true, item });
  }, []);

  const closeLinkedDrawer = useCallback(() => {
    setLinkedDrawer({ open: false, item: null });
  }, []);

  const handleFormSave = useCallback(
    async (formElement) => {
      if (!onFormSave) {
        showFeedback('Save is not configured for this module.', 'error');
        return;
      }

      const rawValues = extractFormValues(formElement);
      const payload = mapFormValuesToApi(moduleKey, rawValues, apiContext);

      setIsSubmitting(true);
      setFormErrors({});

      try {
        await onFormSave(payload, formDrawer.mode, formDrawer.item);
        const label =
          formDrawer.mode === 'edit'
            ? getItemLabel(moduleKey, formDrawer.item)
            : payload.title || payload.fullName || 'Item';
        showFeedback(
          formDrawer.mode === 'edit' ? `Changes saved for "${label}"` : `"${label}" created successfully`,
        );
        closeFormDrawer();
      } catch (error) {
        if (error instanceof ApiError && error.errors) {
          setFormErrors(mapApiErrorsToForm(error.errors));
          showFeedback('Please fix the validation errors and try again.', 'error');
        } else {
          showFeedback(
            error instanceof ApiError ? error.message : 'Unable to save changes right now.',
            'error',
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onFormSave, formDrawer, moduleKey, showFeedback, closeFormDrawer, apiContext],
  );

  const handleGallerySave = useCallback(async (updatedMedia) => {
    if (!onGallerySave) {
      showFeedback('Gallery save is not available for this module.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await onGallerySave(galleryDrawer.item, updatedMedia);
      showFeedback(`Gallery updated for "${getItemLabel(moduleKey, galleryDrawer.item)}"`);
      closeGalleryDrawer();
    } catch (error) {
      showFeedback(
        error instanceof ApiError ? error.message : 'Unable to update gallery right now.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [onGallerySave, galleryDrawer.item, moduleKey, showFeedback, closeGalleryDrawer]);

  const openDuplicateConfirm = useCallback(
    (item) => {
      const label = getItemLabel(moduleKey, item);
      setConfirm({
        open: true,
        title: 'Duplicate Item',
        message: `Create a copy of "${label}"?`,
        confirmLabel: 'Duplicate',
        variant: 'accent',
        icon: 'copy',
        onConfirm: async () => {
          closeConfirm();
          if (!onDuplicate) {
            showFeedback('Duplicate is not available for this module.', 'error');
            return;
          }

          try {
            await onDuplicate(item);
            showFeedback(`"${label}" duplicated successfully`);
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Unable to duplicate item right now.',
              'error',
            );
          }
        },
      });
    },
    [moduleKey, closeConfirm, showFeedback, onDuplicate],
  );

  const openStatusConfirm = useCallback(
    (item, action) => {
      const label = getItemLabel(moduleKey, item);
      const messages = {
        publish: {
          title: 'Publish Item',
          message: `Publish "${label}" on the website?`,
          confirmLabel: 'Publish',
          feedback: `"${label}" published`,
        },
        unpublish: {
          title: 'Unpublish Item',
          message: `Remove "${label}" from the website?`,
          confirmLabel: 'Unpublish',
          feedback: `"${label}" unpublished`,
        },
        hide: {
          title: 'Hide Category',
          message: `Hide "${label}" from the website?`,
          confirmLabel: 'Hide',
          feedback: `"${label}" hidden`,
        },
        show: {
          title: 'Show Item',
          message: `Make "${label}" visible on the website?`,
          confirmLabel: 'Show',
          feedback: `"${label}" is now visible`,
        },
        feature: {
          title: 'Feature Item',
          message: `Feature "${label}" on the website?`,
          confirmLabel: 'Feature',
          feedback: `"${label}" featured`,
        },
        unfeature: {
          title: 'Unfeature Item',
          message: `Remove "${label}" from featured items?`,
          confirmLabel: 'Unfeature',
          feedback: `"${label}" unfeatured`,
        },
        'add-homepage': {
          title: 'Add to Homepage',
          message: `Add "${label}" to the homepage services carousel?`,
          confirmLabel: 'Add to Homepage',
          feedback: `"${label}" added to homepage`,
        },
        'remove-homepage': {
          title: 'Remove from Homepage',
          message: `Remove "${label}" from the homepage services carousel?`,
          confirmLabel: 'Remove',
          feedback: `"${label}" removed from homepage`,
        },
        'open-job': {
          title: 'Open Job',
          message: `Reopen "${label}" for applications?`,
          confirmLabel: 'Open Job',
          feedback: `"${label}" is now open`,
        },
        'close-job': {
          title: 'Close Job',
          message: `Close "${label}" and stop accepting applications?`,
          confirmLabel: 'Close Job',
          feedback: `"${label}" is now closed`,
        },
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
        onConfirm: async () => {
          closeConfirm();
          if (!onStatusChange) {
            showFeedback('Status update is not available for this module.', 'error');
            return;
          }

          try {
            await onStatusChange(item, action);
            showFeedback(config.feedback);
          } catch (error) {
            showFeedback(
              error instanceof ApiError ? error.message : 'Unable to update status right now.',
              'error',
            );
          }
        },
      });
    },
    [moduleKey, closeConfirm, showFeedback, onStatusChange],
  );

  const handleQuickAction = useCallback(
    (actionId, item) => {
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
          } else if (moduleKey === 'team-categories') {
            openStatusConfirm(item, item?.isActive ? 'hide' : 'show');
          } else {
            openStatusConfirm(
              item,
              item?.status === 'hidden' || item?.status === 'draft' ? 'show' : 'hide',
            );
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
          break;
        case 'copy-email':
          if (item?.email) {
            copyToClipboard(item.email);
          }
          showFeedback(
            item?.email ? `Email copied: ${item.email}` : 'Email copied to clipboard',
            'info',
          );
          break;
        default:
          break;
      }
    },
    [
      moduleKey,
      openEditForm,
      openDuplicateConfirm,
      openGalleryDrawer,
      openLinkedDrawer,
      onDeleteItem,
      openStatusConfirm,
      showFeedback,
    ],
  );

  const handleConfirm = useCallback(() => {
    confirm.onConfirm?.();
  }, [confirm]);

  return {
    formDrawer,
    galleryDrawer,
    linkedDrawer,
    confirm,
    feedback,
    formErrors,
    isSubmitting,
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
