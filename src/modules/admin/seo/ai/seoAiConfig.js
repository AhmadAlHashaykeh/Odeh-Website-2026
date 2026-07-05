/** @type {import('./seoAiTypes').SeoAiTone[]} */
export const SEO_AI_TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'technical', label: 'Technical' },
  { id: 'concise', label: 'Concise' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'search-optimized', label: 'Search Optimized' },
];

/** @type {{ id: import('./seoAiTypes').SeoAiOptimizationGoal, label: string }[]} */
export const SEO_AI_OPTIMIZATION_MODES = [
  { id: 'improve-clarity', label: 'Improve clarity' },
  { id: 'shorten-title', label: 'Shorten title' },
  { id: 'expand-description', label: 'Expand description' },
  { id: 'add-location-keywords', label: 'Add location keywords' },
  { id: 'make-professional', label: 'Make more professional' },
  { id: 'improve-search-intent', label: 'Improve search intent' },
  { id: 'generate-alternatives', label: 'Generate alternatives' },
];

/** @type {Record<import('./seoAiTypes').SeoAiBadgeType, { label: string, variant: string }>} */
export const SEO_AI_BADGES = {
  'ai-ready': { label: 'AI Ready', variant: 'info' },
  'suggestion-available': { label: 'Suggestion Available', variant: 'info' },
  'needs-review': { label: 'Needs Review', variant: 'warning' },
  'applied-locally': { label: 'Applied Locally', variant: 'success' },
  'unsaved-ai-changes': { label: 'Unsaved AI Changes', variant: 'warning' },
  'ai-optimized': { label: 'AI Optimized', variant: 'success' },
  'future-api': { label: 'Future OpenAI Ready', variant: 'neutral' },
  'ai-preview': { label: 'AI Optimization Preview', variant: 'info' },
};

export const SEO_AI_CONTINUOUS_FEATURES = [
  'Scheduled SEO scans',
  'AI-generated metadata suggestions',
  'Duplicate title detection',
  'Missing description alerts',
  'Keyword consistency checks',
  'Open Graph suggestions',
  'Content improvement recommendations',
];

/** Simulated response delay for mock async calls (ms). */
export const SEO_AI_MOCK_DELAY_MS = 450;
