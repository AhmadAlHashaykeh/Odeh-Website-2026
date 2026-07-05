/**
 * Prompt templates for future OpenAI API integration.
 * Not executed in the mock phase — defines the contract for real API calls.
 */

const BRAND = 'ODEH & PARTNERS DESIGN';
const DEFAULT_AUDIENCE = 'Clients seeking structural engineering and design services in the Middle East';

/**
 * @param {Object} ctx
 */
function baseContext(ctx) {
  return [
    `Page title: ${ctx.pageTitle ?? ctx.page?.name ?? 'Unknown'}`,
    `Route: ${ctx.route ?? ctx.page?.route ?? '/'}`,
    `Page type: ${ctx.pageType ?? ctx.page?.pageType ?? 'unknown'}`,
    `Module: ${ctx.module ?? ctx.page?.contentModule ?? 'unknown'}`,
    `Current meta title: ${ctx.currentMetaTitle ?? ctx.page?.metaTitle ?? '(empty)'}`,
    `Current meta description: ${ctx.currentMetaDescription ?? ctx.page?.metaDescription ?? '(empty)'}`,
    ctx.existingContentSummary ? `Content summary: ${ctx.existingContentSummary}` : '',
    `Brand: ${ctx.brandTone ?? BRAND}`,
    `Target audience: ${ctx.targetAudience ?? DEFAULT_AUDIENCE}`,
  ].filter(Boolean);
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildPageSuggestionPrompt(params) {
  const goalLine = params.optimizationGoal
    ? `Optimization goal: ${params.optimizationGoal.replace(/-/g, ' ')}.`
    : 'Optimization goal: general SEO improvement.';

  return [
    'You are an SEO assistant for a structural engineering firm website.',
    'Generate metadata suggestions that are accurate, professional, and search-friendly.',
    'Do not invent project details not implied by the page context.',
    '',
    ...baseContext(params),
    `Tone: ${params.tone ?? 'professional'}`,
    goalLine,
    '',
    'Return JSON with: suggestedMetaTitle (max 60 chars), suggestedMetaDescription (max 160 chars),',
    'focusKeywords (array), improvementNotes (array), estimatedScore (0-100).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildImproveMetaTitlePrompt(params) {
  return [
    'Improve the meta title for search visibility while staying accurate.',
    'Max 60 characters. Include brand where appropriate.',
    '',
    ...baseContext(params),
    `Tone: ${params.tone ?? 'professional'}`,
    '',
    'Return JSON with: suggestedMetaTitle, improvementNotes (array).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildImproveMetaDescriptionPrompt(params) {
  return [
    'Improve the meta description for click-through and clarity.',
    'Aim for 120–160 characters. Use action-oriented language where appropriate.',
    '',
    ...baseContext(params),
    `Tone: ${params.tone ?? 'professional'}`,
    '',
    'Return JSON with: suggestedMetaDescription, focusKeywords (array), improvementNotes (array).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildAddLocationKeywordsPrompt(params) {
  return [
    'Add location-based keywords naturally to meta description and keywords.',
    'Focus on Middle East, Jordan, and Amman where relevant.',
    '',
    ...baseContext(params),
    '',
    'Return JSON with: suggestedMetaDescription, focusKeywords (array).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildProfessionalTonePrompt(params) {
  return [
    'Rewrite metadata in a formal, professional tone suitable for an engineering firm.',
    '',
    ...baseContext(params),
    '',
    'Return JSON with: suggestedMetaTitle, suggestedMetaDescription, improvementNotes (array).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildSeoAlternativesPrompt(params) {
  return [
    'Generate alternative meta title and description pairs for A/B testing.',
    'Each alternative must be distinct but equally accurate.',
    '',
    ...baseContext(params),
    `Number of alternatives: ${params.count ?? 3}`,
    '',
    'Return JSON with: alternatives (array of { metaTitle, metaDescription }).',
  ].join('\n');
}

/** @param {Object} page */
export function buildSeoAuditPrompt(page) {
  return [
    'Run an SEO audit on this page metadata.',
    '',
    ...baseContext({ page, pageTitle: page.name, route: page.route }),
    '',
    'Return JSON with: currentScore, potentialScore, mainIssue, recommendations (array).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateModuleInsightsParams} params */
export function buildModuleAnalysisPrompt({ moduleId, moduleLabel, pages }) {
  const missingDesc = pages.filter((p) => !p.metaDescription?.trim()).length;
  const missingTitle = pages.filter((p) => !p.metaTitle?.trim()).length;

  return [
    'Analyze SEO health for a content module on a structural engineering website.',
    '',
    `Module: ${moduleLabel} (${moduleId})`,
    `Total pages: ${pages.length}`,
    `Missing meta titles: ${missingTitle}`,
    `Missing meta descriptions: ${missingDesc}`,
    '',
    'Return JSON with: insights (array of { message, severity }),',
    'priorities (array of actionable improvement steps), estimatedImpact (0-100).',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateModuleInsightsParams} params */
export function buildImprovementPlanPrompt(params) {
  return [
    buildModuleAnalysisPrompt(params),
    '',
    'Generate a structured improvement plan with 3-5 prioritized actions.',
    'Focus on practical editor workflows, not generic SEO advice.',
  ].join('\n');
}

/** @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params */
export function buildFullOptimizationPrompt(params) {
  return [
    'Generate a complete SEO metadata optimization for this page.',
    'Improve both meta title and meta description together for maximum impact.',
    '',
    ...baseContext(params),
    `Tone: ${params.tone ?? 'professional'}`,
    params.optimizationGoal ? `Goal: ${params.optimizationGoal.replace(/-/g, ' ')}` : '',
    '',
    'Return JSON with: metaTitle, metaDescription, focusKeywords, estimatedScore, scoreImprovement.',
  ]
    .filter(Boolean)
    .join('\n');
}
