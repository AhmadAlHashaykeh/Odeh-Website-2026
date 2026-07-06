import { useCallback } from 'react';
import { ApiError } from '../../../api/client';
import { useAdminActionFlows } from '../cms/action-flows/useAdminActionFlows';
import { useModulePermissions } from './useModulePermissions';

const EDIT_ACTIONS = new Set([
  'edit',
  'duplicate',
  'gallery',
  'manage',
  'publish',
  'hide',
  'toggle-visibility',
  'toggle-homepage',
  'feature',
  'toggle-status',
  'copy-email',
]);

function buildStatusPayload(moduleKey, item, action) {
  switch (action) {
    case 'publish':
      return { status: 'published' };
    case 'unpublish':
      return { status: 'draft' };
    case 'hide':
      if (moduleKey === 'services') return { status: 'hidden' };
      if (moduleKey === 'team-members') return { status: 'hidden' };
      if (moduleKey === 'categories') return { status: 'draft' };
      return { status: 'draft' };
    case 'show':
      if (moduleKey === 'team-members') return { status: 'active' };
      if (moduleKey === 'services') return { status: 'published' };
      return { status: 'published' };
    case 'feature':
      return { featured: true };
    case 'unfeature':
      return { featured: false };
    case 'add-homepage':
      return { usedOnHomepage: true };
    case 'remove-homepage':
      return { usedOnHomepage: false };
    case 'open-job':
      return { status: 'open' };
    case 'close-job':
      return { status: 'closed' };
    default:
      return {};
  }
}

function buildDuplicatePayload(moduleKey, item) {
  const copyTitle = `${item.title || item.fullName} (Copy)`;

  switch (moduleKey) {
    case 'projects':
      return {
        title: copyTitle,
        projectCategoryId: item.projectCategoryId,
        description: item.description,
        coverImage: item.coverImage,
        gallery: item.gallery,
        location: item.location,
        projectType: item.projectType,
        area: item.area,
        year: item.year,
        status: 'draft',
        featured: item.featured,
        displayOrder: item.displayOrder,
      };
    case 'categories':
      return {
        title: copyTitle,
        description: item.description,
        coverImage: item.coverImage,
        featuredImage: item.featuredImage,
        status: 'draft',
        displayOrder: item.displayOrder,
      };
    case 'services':
      return {
        title: copyTitle,
        description: item.fullDescription || item.description,
        image: item.image,
        icon: item.icon,
        usedOnHomepage: false,
        status: 'draft',
        displayOrder: item.displayOrder,
      };
    case 'activities':
      return {
        title: copyTitle,
        location: item.location,
        description: item.fullDescription || item.description,
        coverImage: item.coverImage,
        gallery: item.gallery,
        activityDate: item.activityDate,
        status: 'draft',
        featured: false,
        displayOrder: item.displayOrder,
      };
    case 'team-members':
      return {
        fullName: copyTitle,
        position: item.position,
        department: item.department,
        category: item.category || item.categoryLabel,
        experience: item.experience,
        email: item.email,
        photo: item.photo,
        status: 'hidden',
        displayOrder: item.displayOrder,
      };
    case 'careers':
      return {
        title: copyTitle,
        department: item.department,
        location: item.location,
        employmentType: item.employmentType,
        workMode: item.workMode,
        experienceLevel: item.experienceLevel,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        responsibilities: item.responsibilities,
        requirements: item.requirements,
        benefits: item.benefits,
        status: 'draft',
      };
    default:
      return { title: copyTitle };
  }
}

export function useModuleApiActions({
  moduleKey,
  listing,
  api,
  apiContext = {},
  enableGallery = false,
}) {
  const { canCreate, canEdit, canDelete } = useModulePermissions(moduleKey);

  const flows = useAdminActionFlows({
    moduleKey,
    apiContext,
    onDeleteItem: listing.openDeleteForItem,
    onFormSave: async (payload, mode, item) => {
      if (mode === 'add') {
        await api.create(payload);
      } else {
        await api.update(item.id, payload);
      }
      await listing.refresh();
    },
    onGallerySave: enableGallery
      ? async (item) => {
          await api.update(item.id, { gallery: item.gallery });
          await listing.refresh();
        }
      : undefined,
    onStatusChange: async (item, action) => {
      const payload = buildStatusPayload(moduleKey, item, action);
      await api.update(item.id, payload);
      await listing.refresh();
    },
    onDuplicate: async (item) => {
      await api.create(buildDuplicatePayload(moduleKey, item));
      await listing.refresh();
    },
  });

  const openAddForm = useCallback(() => {
    if (!canCreate) {
      flows.showFeedback('You do not have permission to create items.', 'error');
      return;
    }
    flows.openAddForm();
  }, [canCreate, flows]);

  const handleQuickAction = useCallback(
    (actionId, item) => {
      if (actionId === 'delete' && !canDelete) {
        flows.showFeedback('You do not have permission to delete items.', 'error');
        return;
      }

      if (EDIT_ACTIONS.has(actionId) && !canEdit) {
        flows.showFeedback('You do not have permission to edit items.', 'error');
        return;
      }

      flows.handleQuickAction(actionId, item);
    },
    [canDelete, canEdit, flows],
  );

  return {
    ...flows,
    openAddForm,
    handleQuickAction,
    permissions: { canCreate, canEdit, canDelete },
  };
}

export async function applyBulkUpdates({
  api,
  listing,
  flows,
  payloadMap,
  bulkAction,
}) {
  const payload = payloadMap[bulkAction];
  if (!payload) return false;

  const selectedItems = listing.items.filter((item) => listing.selectedIds.has(item.id));
  if (selectedItems.length === 0) return false;

  try {
    await Promise.all(selectedItems.map((item) => api.update(item.id, payload)));
    await listing.refresh();
    flows.showFeedback(`${selectedItems.length} item(s) updated successfully`);
    listing.clearSelection();
    return true;
  } catch (error) {
    flows.showFeedback(
      error instanceof ApiError ? error.message : 'Bulk update failed. Please try again.',
      'error',
    );
    return false;
  }
}

export async function handleListingDelete(listing, flows, canDelete = true) {
  if (!canDelete) {
    flows.showFeedback('You do not have permission to delete items.', 'error');
    return;
  }
  const result = await listing.confirmDelete();

  if (result.success) {
    flows.showFeedback(
      result.count === 1 ? 'Item deleted successfully' : `${result.count} items deleted successfully`,
    );
    return;
  }

  if (result.error) {
    flows.showFeedback(result.error, 'error');
  }
}
