const API_ERROR_FIELD_MAP = {
  full_name: 'fullName',
  project_category_id: 'category',
  category_id: 'category',
  cover_image: 'coverImage',
  featured_image: 'featuredImage',
  project_type: 'projectType',
  display_order: 'displayOrder',
  used_on_homepage: 'usedOnHomepage',
  activity_date: 'activityDate',
  employment_type: 'employmentType',
  work_mode: 'workMode',
  experience_level: 'experienceLevel',
  posted_date: 'postedDate',
  closing_date: 'closingDate',
  short_description: 'shortDescription',
  full_description: 'fullDescription',
};

export function mapApiErrorsToForm(errors = {}) {
  const mapped = {};

  for (const [field, messages] of Object.entries(errors)) {
    const formField = API_ERROR_FIELD_MAP[field] || field;
    mapped[formField] = messages;
  }

  return mapped;
}

export function getFirstFieldError(errors, field) {
  if (!errors?.[field]?.length) {
    return undefined;
  }

  return errors[field][0];
}
