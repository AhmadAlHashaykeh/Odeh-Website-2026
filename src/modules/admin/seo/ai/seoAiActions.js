/** Primary optimization action — opens review modal before applying. */
export const SEO_AI_PRIMARY_ACTION = {
  id: 'optimize-metadata',
  label: 'Optimize Metadata',
  icon: 'seo',
  requiresReview: true,
};

/** Secondary actions — apply directly to in-memory preview state. */
export const SEO_AI_SECONDARY_ACTIONS = [
  { id: 'improve-title', label: 'Improve Title', goal: 'improve-search-intent', applyField: 'metaTitle' },
  { id: 'improve-description', label: 'Improve Description', goal: 'expand-description', applyField: 'metaDescription' },
  { id: 'add-location-keywords', label: 'Add Location Keywords', goal: 'add-location-keywords', applyField: 'both' },
  { id: 'make-professional', label: 'Make More Professional', goal: 'make-professional', applyField: 'both' },
  { id: 'shorten-title', label: 'Shorten Title', goal: 'shorten-title', applyField: 'metaTitle' },
  { id: 'generate-alternatives', label: 'Generate Alternatives', goal: 'generate-alternatives', applyField: 'metaTitle' },
];

/** Edit modal quick actions. */
export const SEO_AI_MODAL_ACTIONS = [
  { id: 'analyze-fields', label: 'Analyze Current Fields', type: 'analyze' },
  { id: 'improve-title', label: 'Improve Title', goal: 'improve-search-intent', applyField: 'metaTitle' },
  { id: 'improve-description', label: 'Improve Description', goal: 'expand-description', applyField: 'metaDescription' },
  { id: 'generate-alternatives', label: 'Generate Alternatives', goal: 'generate-alternatives', applyField: 'metaTitle' },
  { id: 'apply-all', label: 'Apply to Fields', type: 'apply-all' },
];

/** Module-level batch optimization placeholders. */
export const SEO_AI_BATCH_ACTIONS = [
  {
    id: 'missing-descriptions',
    label: 'Optimize pages with missing descriptions',
    description: 'Future: batch-generate descriptions for pages without metadata.',
  },
  {
    id: 'low-score',
    label: 'Improve low-score pages',
    description: 'Future: prioritize pages below 70% SEO score.',
  },
  {
    id: 'og-suggestions',
    label: 'Generate Open Graph suggestions',
    description: 'Future: AI-generated OG titles and images recommendations.',
  },
  {
    id: 'duplicate-titles',
    label: 'Detect duplicate titles',
    description: 'Future: scan module for conflicting meta titles.',
  },
  {
    id: 'standardize-descriptions',
    label: 'Standardize descriptions across module',
    description: 'Future: align tone and structure across related pages.',
  },
];

/**
 * @param {string} actionId
 */
export function getSeoAiAction(actionId) {
  if (actionId === SEO_AI_PRIMARY_ACTION.id) return SEO_AI_PRIMARY_ACTION;
  return SEO_AI_SECONDARY_ACTIONS.find((action) => action.id === actionId) ?? null;
}

/**
 * Resolve which fields an action applies to.
 * @param {{ applyField?: string }} action
 * @returns {('metaTitle' | 'metaDescription')[]}
 */
export function getActionApplyFields(action) {
  if (!action?.applyField || action.applyField === 'both') {
    return ['metaTitle', 'metaDescription'];
  }
  return [action.applyField];
}
