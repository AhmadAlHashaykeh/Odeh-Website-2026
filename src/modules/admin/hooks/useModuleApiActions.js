import { useAdminActionFlows } from '../cms/action-flows/useAdminActionFlows';

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
  return useAdminActionFlows({
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
}

export async function handleListingDelete(listing, flows) {
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
