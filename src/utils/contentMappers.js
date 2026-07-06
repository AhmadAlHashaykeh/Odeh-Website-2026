import { resolveMediaPath, resolveMediaUrl } from './mediaUrl';

export { resolveMediaPath, resolveMediaUrl };

export function mapTeamMember(member) {
  return {
    slug: member.slug,
    name: member.fullName ?? member.name,
    title: member.position ?? member.title,
    experience: member.experience,
    photo: resolveMediaUrl(member.photo),
    email: member.email,
  };
}

export function mapJob(job) {
  return {
    ...job,
    type: job.employmentType ?? job.type,
    description: job.fullDescription ?? job.description,
    preferredQualifications: job.preferredQualifications ?? [],
  };
}

export function mapService(service) {
  return {
    ...service,
    id: service.slug ?? service.id,
    path: `/services/${service.slug ?? service.id}`,
    image: resolveMediaUrl(service.image),
    icon: resolveMediaUrl(service.icon),
  };
}

export function mapActivity(activity) {
  const description = activity.description ?? activity.fullDescription ?? '';

  return {
    ...activity,
    date: activity.activityDate ?? activity.date,
    coverImage: resolveMediaUrl(activity.coverImage ?? activity.cover_image),
    gallery: (activity.gallery ?? []).map((item) => ({
      ...item,
      src: resolveMediaUrl(item),
    })),
    description: Array.isArray(description) ? description : description,
  };
}

export function mapProject(project) {
  return {
    ...project,
    coverImage: resolveMediaUrl(project.coverImage ?? project.cover_image),
    image: resolveMediaUrl(project.image ?? project.coverImage ?? project.cover_image),
    gallery: (project.gallery ?? []).map((item) => ({
      ...item,
      src: resolveMediaUrl(item),
    })),
  };
}

export function mapProjectCategory(category) {
  return {
    ...category,
    coverImage: resolveMediaUrl(category.coverImage ?? category.cover_image),
    featuredImage: resolveMediaUrl(category.featuredImage ?? category.featured_image),
  };
}

export function getSearchBadgeType(type) {
  const labels = {
    project: 'Project',
    service: 'Service',
    activity: 'Activity',
    career: 'Career',
    about: 'About',
    page: 'Page',
  };
  return labels[type] ?? 'Page';
}

export function getSearchExcerpt(item) {
  return item.subtitle ?? '';
}
