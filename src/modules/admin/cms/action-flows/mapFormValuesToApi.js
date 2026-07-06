function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'Yes' || value === 'true' || value === '1') return true;
  if (value === 'No' || value === 'false' || value === '0') return false;
  return undefined;
}

function parseNumber(value) {
  if (value === '' || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseLines(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function omitEmpty(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  );
}

export function mapFormValuesToApi(moduleKey, values, context = {}) {
  switch (moduleKey) {
    case 'categories':
      return omitEmpty({
        title: values.title,
        description: values.description,
        coverImage: values.coverImage,
        featuredImage: values.featuredImage,
        status: values.status === 'hidden' ? 'draft' : values.status,
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'projects': {
      const categoryRecord = (context.categories || []).find(
        (category) =>
          category.id === values.category ||
          category.title === values.category ||
          category.slug === values.category,
      );

      return omitEmpty({
        title: values.title,
        projectCategoryId: categoryRecord?.id,
        description: values.description,
        coverImage: values.coverImage,
        gallery: Array.isArray(values.gallery) ? values.gallery : undefined,
        location: values.location,
        projectType: values.projectType,
        area: values.area,
        year: parseNumber(values.year),
        status: values.status,
        featured: parseBoolean(values.featured),
        displayOrder: parseNumber(values.displayOrder),
      });
    }

    case 'services':
      return omitEmpty({
        title: values.title,
        description: values.description,
        image: values.image,
        icon: values.icon,
        usedOnHomepage: parseBoolean(values.usedOnHomepage),
        displayOrder: parseNumber(values.displayOrder),
        status: values.status === 'hidden' ? 'hidden' : values.status,
      });

    case 'activities':
      return omitEmpty({
        title: values.title,
        activityDate: values.activityDate,
        location: values.location,
        description: values.description,
        coverImage: values.coverImage,
        gallery: Array.isArray(values.gallery) ? values.gallery : undefined,
        status: values.status,
        featured: parseBoolean(values.featured),
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'team-members':
      return omitEmpty({
        fullName: values.fullName,
        position: values.position,
        department: values.department,
        category: values.category,
        experience: values.experience,
        email: values.email,
        photo: values.photo,
        status: values.status,
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'careers':
      return omitEmpty({
        title: values.title,
        department: values.department,
        location: values.location,
        employmentType: values.employmentType,
        workMode: values.workMode,
        experienceLevel: values.experienceLevel,
        postedDate: values.postedDate,
        closingDate: values.closingDate,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        responsibilities: parseLines(values.responsibilities),
        requirements: parseLines(values.requirements),
        benefits: parseLines(values.benefits),
        status: values.status,
      });

    default:
      return values;
  }
}

export function extractFormValues(formElement) {
  if (!formElement) {
    return {};
  }

  const formData = new FormData(formElement);
  const values = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  return values;
}
