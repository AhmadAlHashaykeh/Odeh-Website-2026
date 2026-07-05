/**
 * Maps module items to form default values for edit mode.
 */

function boolLabel(value) {
  return value ? 'Yes' : 'No';
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
        year: item.year || '',
        description: item.description || '',
        coverImage: item.coverImage || '',
        gallery: item.gallery || [],
        status: item.status || 'draft',
        published: boolLabel(item.published),
        featured: boolLabel(item.featured),
        displayOrder: item.displayOrder || '',
      };

    case 'categories':
      return {
        title: item.title || '',
        slug: item.slug || '',
        description: item.description || '',
        coverImage: item.coverImage || '',
        featuredImage: item.featuredImage || '',
        status: item.status || 'draft',
        published: boolLabel(item.published),
        displayOrder: item.displayOrder || '',
      };

    case 'team-members':
      return {
        fullName: item.fullName || '',
        position: item.position || '',
        department: item.department || '',
        category: item.categoryLabel || item.category || '',
        experience: item.experience || '',
        email: item.email || '',
        photo: item.photo || '',
        status: item.status || 'active',
        displayOrder: item.displayOrder || '',
      };

    case 'activities':
      return {
        title: item.title || '',
        slug: item.slug || '',
        activityDate: item.activityDate || '',
        location: item.location || '',
        description: item.fullDescription || item.description || '',
        coverImage: item.coverImage || '',
        gallery: item.gallery || [],
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
        image: item.image || '',
        icon: item.icon || '',
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
