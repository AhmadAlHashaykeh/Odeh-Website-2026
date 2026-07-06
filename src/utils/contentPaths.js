export function getProjectPath(project) {
  const categorySlug = project.categorySlug ?? project.category_slug ?? 'uncategorized';
  return `/projects/${categorySlug}/${project.slug}`;
}

export function getJobPath(job) {
  return `/careers/${job.slug}`;
}

export function getJobApplyPath(job) {
  return `/careers/${job.slug}/apply`;
}

export function getJobApplyThankYouPath(job) {
  return `/careers/${job.slug}/apply/thank-you`;
}

export function getActivityPath(activity) {
  return `/about/activities/${activity.slug}`;
}

export function getServicePath(service) {
  const slug = service.slug ?? service.id;
  return `/services/${slug}`;
}

export function formatJobDate(dateString) {
  if (!dateString) return '';
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
