/**
 * Maps admin form module keys to backend upload module identifiers.
 */
export const FORM_MODULE_UPLOAD_MAP = {
  categories: 'project-categories',
  projects: 'projects',
  services: 'services',
  activities: 'activities',
  'team-members': 'team-members',
  'team-categories': 'team-categories',
};

export function resolveUploadModule(formModuleKey) {
  return FORM_MODULE_UPLOAD_MAP[formModuleKey] ?? formModuleKey;
}
