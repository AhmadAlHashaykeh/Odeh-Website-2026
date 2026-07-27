/**
 * Maps module items to form default values for edit mode.
 */

import { resolveMediaPath } from '../../../../utils/mediaUrl';

function boolLabel(value) {
  return value ? 'Yes' : 'No';
}

function mapGalleryForForm(gallery) {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery.map((item) => ({
    ...item,
    src: resolveMediaPath(item),
  }));
}

export function mapItemToFormValues(moduleKey, item) {
  if (!item) return {};

  switch (moduleKey) {
    case 'projects':
      return {
        title: item.title || '',
        slug: item.slug || '',
        category: item.category || '',
        location: item.location || '',
        projectType: item.projectType || '',
        area: item.area || '',
        completionStatus: item.completionStatus || '',
        year: item.year || '',
        description: item.description || '',
        coverImage: resolveMediaPath(item.coverImage),
        gallery: mapGalleryForForm(item.gallery),
        status: item.status || 'draft',
        published: boolLabel(item.published),
        displayOrder: item.displayOrder || '',
      };

    case 'categories':
      return {
        title: item.title || '',
        slug: item.slug || '',
        description: item.description || '',
        status: item.status || 'draft',
        published: boolLabel(item.published),
        displayOrder: item.displayOrder || '',
      };

    case 'team-members':
      return {
        fullName: item.fullName || '',
        position: item.position || '',
        department: item.department || '',
        teamCategoryId: item.teamCategoryId || item.category?.id || '',
        experience: item.experience || '',
        email: item.email || '',
        photo: resolveMediaPath(item.photo),
        status: item.status || 'active',
        displayOrder: item.displayOrder || '',
      };

    case 'team-categories':
      return {
        name: item.name || '',
        slug: item.slug || '',
        description: item.description || '',
        borderColor: item.borderColor || '#7a7f85',
        icon: resolveMediaPath(item.icon),
        parentId: item.parentId || '',
        status: item.isActive === false || item.status === 'inactive' ? 'inactive' : 'active',
        displayOrder: item.displayOrder || '',
      };

    case 'activities':
      return {
        title: item.title || '',
        slug: item.slug || '',
        activityDate: item.activityDate || '',
        location: item.location || '',
        description: item.fullDescription || item.description || '',
        coverImage: resolveMediaPath(item.coverImage),
        gallery: mapGalleryForForm(item.gallery),
        status: item.status || 'draft',
        published: boolLabel(item.published),
        featured: boolLabel(item.featured),
        displayOrder: item.displayOrder || '',
      };

    case 'services':
      return {
        title: item.title || '',
        slug: item.slug || '',
        description: item.fullDescription || item.description || '',
        image: resolveMediaPath(item.image),
        icon: resolveMediaPath(item.icon),
        usedOnHomepage: boolLabel(item.usedOnHomepage),
        displayOrder: item.displayOrder || '',
        status: item.status || 'draft',
      };

    case 'careers':
      return {
        title: item.title || '',
        slug: item.slug || '',
        department: item.department || '',
        location: item.location || '',
        employmentType: item.employmentType || '',
        workMode: item.workMode || '',
        experienceLevel: item.experienceLevel || '',
        postedDate: item.postedDate || '',
        closingDate: item.closingDate || '',
        shortDescription: item.shortDescription || '',
        fullDescription: item.fullDescription || '',
        responsibilities: (item.responsibilities || []).join('\n'),
        requirements: (item.requirements || []).join('\n'),
        benefits: (item.benefits || []).join('\n'),
        status: item.status || 'draft',
      };

    default:
      return {};
  }
}

export function getItemLabel(moduleKey, item) {
  if (!item) return 'this item';

  switch (moduleKey) {
    case 'projects':
      return item.title;
    case 'categories':
      return item.title;
    case 'team-members':
      return item.fullName;
    case 'team-categories':
      return item.name;
    case 'activities':
      return item.title;
    case 'services':
      return item.title;
    case 'careers':
      return item.title;
    default:
      return 'this item';
  }
}
