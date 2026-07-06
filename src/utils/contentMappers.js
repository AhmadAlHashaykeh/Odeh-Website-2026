export function mapTeamMember(member) {
  return {
    slug: member.slug,
    name: member.fullName ?? member.name,
    title: member.position ?? member.title,
    experience: member.experience,
    photo: member.photo,
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
  };
}

export function mapActivity(activity) {
  const description = activity.description ?? activity.fullDescription ?? '';
  return {
    ...activity,
    date: activity.activityDate ?? activity.date,
    coverImage: activity.coverImage ?? activity.cover_image,
    description: Array.isArray(description) ? description : description,
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
