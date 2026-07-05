import { SEO_AI_MOCK_DELAY_MS } from './seoAiConfig';
import {
  buildFullOptimizationPrompt,
  buildImprovementPlanPrompt,
  buildModuleAnalysisPrompt,
  buildPageSuggestionPrompt,
  buildSeoAuditPrompt,
  buildSeoAlternativesPrompt,
} from './seoAiPromptTemplates';
import { runSeoAudit, computeSeoScore } from '../utils/seoAudit';

function delay(ms = SEO_AI_MOCK_DELAY_MS) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function truncate(text, max) {
  if (!text || text.length <= max) return text ?? '';
  return `${text.slice(0, max - 1)}…`;
}

function buildBaseTitle(pageTitle, tone) {
  const brand = 'ODEH & PARTNERS DESIGN';
  const templates = {
    professional: `${pageTitle} | ${brand}`,
    technical: `${pageTitle} — Structural Engineering | ${brand}`,
    concise: `${pageTitle} | ${brand}`,
    luxury: `${pageTitle} | Premium Structural Design | ${brand}`,
    'search-optimized': `${pageTitle} | Structural Engineering Middle East | ${brand}`,
  };
  return truncate(templates[tone] ?? templates.professional, 60);
}

function buildBaseDescription(pageTitle, route, tone, module) {
  const locationHint =
    module === 'projects' || module === 'services'
      ? ' Delivered across the Middle East with precision and technical excellence.'
      : ' Trusted structural engineering and design solutions.';

  const templates = {
    professional: `Explore ${pageTitle} at ODEH & PARTNERS DESIGN.${locationHint}`,
    technical: `${pageTitle} — expert structural engineering, analysis, and design documentation from ODEH & PARTNERS DESIGN.${locationHint}`,
    concise: `${pageTitle}. Structural engineering by ODEH & PARTNERS DESIGN.`,
    luxury: `Discover ${pageTitle} — refined structural design and engineering excellence from ODEH & PARTNERS DESIGN.`,
    'search-optimized': `${pageTitle} — structural engineering services, design solutions, and project expertise. Learn more at ODEH & PARTNERS DESIGN.`,
  };

  return truncate(templates[tone] ?? templates.professional, 160);
}

function extractKeywords(pageTitle, pageType, module) {
  const base = ['structural engineering', 'ODEH & PARTNERS DESIGN'];
  const moduleKeywords = {
    projects: ['projects', 'portfolio', 'Middle East'],
    services: ['design services', 'BIM', 'engineering solutions'],
    careers: ['careers', 'engineering jobs', 'Amman'],
    activities: ['company culture', 'team events'],
    'website-pages': ['about', 'engineering firm'],
    utility: ['contact', 'website'],
  };

  const typeKeywords = {
    'project-detail': ['structural design', 'construction'],
    service: ['consulting', 'technical review'],
    'career-detail': ['job opening', 'apply'],
  };

  return [
    ...base,
    ...(moduleKeywords[module] ?? []),
    ...(typeKeywords[pageType] ?? []),
    pageTitle.split(' ').slice(0, 2).join(' ').toLowerCase(),
  ].filter(Boolean);
}

function applyOptimizationGoal(suggestion, goal, params) {
  const { pageTitle, currentMetaTitle, currentMetaDescription } = params;

  switch (goal) {
    case 'shorten-title':
      return {
        ...suggestion,
        suggestedMetaTitle: truncate(currentMetaTitle || pageTitle, 45),
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Title shortened to improve display in search results.',
        ],
      };
    case 'expand-description':
      return {
        ...suggestion,
        suggestedMetaDescription: truncate(
          `${suggestion.suggestedMetaDescription} Contact our team to discuss your project requirements.`,
          160,
        ),
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Description expanded with a clear call-to-action.',
        ],
      };
    case 'add-location-keywords':
      return {
        ...suggestion,
        focusKeywords: [...suggestion.focusKeywords, 'Middle East', 'Amman', 'Jordan'],
        suggestedMetaDescription: truncate(
          `${suggestion.suggestedMetaDescription} Serving clients across Jordan and the Middle East.`,
          160,
        ),
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Location-based keywords added for regional search visibility.',
        ],
      };
    case 'make-professional':
      return {
        ...suggestion,
        suggestedMetaTitle: buildBaseTitle(pageTitle, 'professional'),
        suggestedMetaDescription: buildBaseDescription(
          pageTitle,
          params.route,
          'professional',
          params.module,
        ),
        tone: 'professional',
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Copy adjusted to a more formal, professional tone.',
        ],
      };
    case 'improve-search-intent':
      return {
        ...suggestion,
        suggestedMetaTitle: buildBaseTitle(pageTitle, 'search-optimized'),
        focusKeywords: [...suggestion.focusKeywords, 'structural design', 'engineering firm'],
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Title and keywords aligned with likely search queries.',
        ],
      };
    case 'generate-alternatives':
      return {
        ...suggestion,
        suggestedMetaTitle: truncate(`${pageTitle} — Engineering & Design`, 60),
        suggestedRewrite: `Alternative: "${truncate(`${pageTitle} | Expert Structural Engineering`, 55)}"`,
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Alternative title phrasing generated for A/B consideration.',
        ],
      };
    case 'improve-clarity':
    default:
      return {
        ...suggestion,
        improvementNotes: [
          ...suggestion.improvementNotes,
          'Language simplified for clearer search snippet readability.',
        ],
        suggestedRewrite: `${suggestion.suggestedMetaTitle} — ${truncate(suggestion.suggestedMetaDescription, 80)}`,
      };
  }
}

function buildLengthFeedback(title, description) {
  const titleLen = title?.length ?? 0;
  const descLen = description?.length ?? 0;

  let titleFeedback = 'Title length is within recommended range.';
  if (titleLen === 0) titleFeedback = 'Title is missing — add a descriptive meta title.';
  else if (titleLen < 30) titleFeedback = 'Title is short — consider adding context for search.';
  else if (titleLen > 60) titleFeedback = 'Title may truncate in search — aim for 50–60 characters.';

  let descFeedback = 'Description length is within recommended range.';
  if (descLen === 0) descFeedback = 'Description is missing — add a compelling summary.';
  else if (descLen < 70) descFeedback = 'Description is short — expand to 120–160 characters.';
  else if (descLen > 160) descFeedback = 'Description may truncate — trim to 160 characters.';

  return { title: titleFeedback, description: descFeedback };
}

function estimateScore(title, description, currentScore = 70) {
  let score = currentScore;
  const titleLen = title?.length ?? 0;
  const descLen = description?.length ?? 0;

  if (titleLen >= 30 && titleLen <= 60) score += 8;
  if (descLen >= 120 && descLen <= 160) score += 10;
  if (titleLen === 0) score -= 15;
  if (descLen === 0) score -= 15;

  return Math.min(98, Math.max(40, score));
}

/**
 * Generate AI SEO suggestions for a single page.
 * Mock implementation — replace body with OpenAI API call using buildPageSuggestionPrompt().
 *
 * @param {import('./seoAiTypes').GenerateSeoSuggestionsParams} params
 * @returns {Promise<import('./seoAiTypes').SeoAiSuggestion>}
 */
export async function generateSeoSuggestions(params) {
  const {
    pageTitle,
    route,
    currentMetaTitle = '',
    currentMetaDescription = '',
    pageType,
    module,
    tone = 'professional',
    optimizationGoal = null,
  } = params;

  // Future: const prompt = buildPageSuggestionPrompt(params);
  // Future: return callOpenAi({ prompt, model: 'gpt-4o-mini' });

  await delay();

  const suggestedMetaTitle = buildBaseTitle(pageTitle, tone);
  const suggestedMetaDescription = buildBaseDescription(pageTitle, route, tone, module);
  const focusKeywords = extractKeywords(pageTitle, pageType, module);

  const improvementNotes = [];
  if (!currentMetaTitle?.trim()) improvementNotes.push('Meta title is missing — a suggested title is provided.');
  if (!currentMetaDescription?.trim()) improvementNotes.push('Meta description is missing — add a search-friendly summary.');
  if (currentMetaDescription && currentMetaDescription.length < 100) {
    improvementNotes.push('Current description is shorter than recommended (120–160 characters).');
  }
  if (module === 'projects') {
    improvementNotes.push('Consider adding project type or location keywords for portfolio pages.');
  }
  if (module === 'services') {
    improvementNotes.push('Action-oriented language could improve click-through for service pages.');
  }

  let suggestion = {
    suggestedMetaTitle,
    suggestedMetaDescription,
    focusKeywords,
    improvementNotes,
    estimatedScore: estimateScore(suggestedMetaTitle, suggestedMetaDescription),
    lengthFeedback: buildLengthFeedback(currentMetaTitle, currentMetaDescription),
    suggestedRewrite: `${suggestedMetaTitle} — ${truncate(suggestedMetaDescription, 90)}`,
    tone,
    optimizationGoal,
    isMock: true,
    _promptPreview: buildPageSuggestionPrompt(params),
  };

  if (optimizationGoal) {
    suggestion = applyOptimizationGoal(suggestion, optimizationGoal, params);
    suggestion.estimatedScore = estimateScore(
      suggestion.suggestedMetaTitle,
      suggestion.suggestedMetaDescription,
      suggestion.estimatedScore,
    );
  }

  return suggestion;
}

/**
 * Generate module-level AI insights.
 * @param {import('./seoAiTypes').GenerateModuleInsightsParams} params
 * @returns {Promise<import('./seoAiTypes').SeoAiModuleInsight[]>}
 */
export async function generateModuleInsights({ moduleId, moduleLabel, pages }) {
  // Future: const prompt = buildModuleAnalysisPrompt({ moduleId, moduleLabel, pages });
  await delay(350);

  const missingOg = pages.filter((p) => !p.ogImage).length;
  const shortDesc = pages.filter(
    (p) => p.metaDescription?.trim() && p.metaDescription.length < 100,
  ).length;
  const missingDesc = pages.filter((p) => !p.metaDescription?.trim()).length;
  const missingTitle = pages.filter((p) => !p.metaTitle?.trim()).length;

  /** @type {import('./seoAiTypes').SeoAiModuleInsight[]} */
  const insights = [];

  if (missingOg > 0) {
    insights.push({
      id: 'missing-og',
      message: `${missingOg} ${moduleLabel.toLowerCase()} page${missingOg === 1 ? '' : 's'} ${missingOg === 1 ? 'has' : 'have'} missing Open Graph images.`,
      severity: 'warn',
    });
  }

  if (missingDesc > 0) {
    insights.push({
      id: 'missing-desc',
      message: `${missingDesc} page${missingDesc === 1 ? '' : 's'} ${missingDesc === 1 ? 'is' : 'are'} missing meta descriptions.`,
      severity: 'warn',
    });
  }

  if (shortDesc > 0) {
    insights.push({
      id: 'short-desc',
      message: `Meta descriptions for ${shortDesc} page${shortDesc === 1 ? '' : 's'} are shorter than recommended.`,
      severity: 'info',
    });
  }

  if (missingTitle > 0) {
    insights.push({
      id: 'missing-title',
      message: `${missingTitle} page${missingTitle === 1 ? '' : 's'} ${missingTitle === 1 ? 'needs' : 'need'} a meta title review.`,
      severity: 'warn',
    });
  }

  const moduleMessages = {
    projects: {
      id: 'project-keywords',
      message: 'Project pages could benefit from more location-based keywords.',
      severity: 'opportunity',
    },
    services: {
      id: 'service-cta',
      message: 'Several service pages need clearer action-oriented descriptions.',
      severity: 'opportunity',
    },
    careers: {
      id: 'career-intent',
      message: 'Job pages should emphasize role type and location for search intent.',
      severity: 'opportunity',
    },
    activities: {
      id: 'activity-context',
      message: 'Activity pages could include event dates in descriptions for context.',
      severity: 'info',
    },
    'website-pages': {
      id: 'brand-consistency',
      message: 'Ensure consistent brand naming across core website pages.',
      severity: 'info',
    },
  };

  const moduleMsg = moduleMessages[moduleId];
  if (moduleMsg) insights.push(moduleMsg);

  if (insights.length === 0) {
    insights.push({
      id: 'healthy',
      message: `${moduleLabel} SEO metadata looks well-configured. Minor optimizations may still help.`,
      severity: 'info',
    });
  }

  return insights;
}

/**
 * Generate a module improvement plan.
 * @param {import('./seoAiTypes').GenerateModuleInsightsParams} params
 * @returns {Promise<import('./seoAiTypes').SeoAiImprovementPlan>}
 */
export async function generateImprovementPlan(params) {
  // Future: const prompt = buildImprovementPlanPrompt(params);
  await delay(550);

  const insights = await generateModuleInsights(params);
  const { moduleId, moduleLabel, pages } = params;

  const missingDesc = pages.filter((p) => !p.metaDescription?.trim()).length;
  const priorities = [];

  if (missingDesc > 0) {
    priorities.push(`Add meta descriptions to ${missingDesc} page${missingDesc === 1 ? '' : 's'} without one.`);
  }

  priorities.push('Review title length across all pages — aim for 50–60 characters.');
  priorities.push('Standardize brand suffix usage in meta titles.');

  if (moduleId === 'projects') {
    priorities.push('Add location and project-type keywords to high-traffic project pages.');
  }
  if (moduleId === 'services') {
    priorities.push('Strengthen call-to-action language on service page descriptions.');
  }

  priorities.push('Plan Open Graph images for pages shared on social channels.');

  return {
    moduleId,
    summary: `AI improvement plan for ${moduleLabel} — ${pages.length} pages analyzed, ${insights.length} insight${insights.length === 1 ? '' : 's'} identified.`,
    priorities: priorities.slice(0, 5),
    estimatedImpact: Math.min(85, 45 + priorities.length * 8),
    isMock: true,
    _promptPreview: buildImprovementPlanPrompt(params),
  };
}

/**
 * Format suggestions for clipboard copy.
 * @param {import('./seoAiTypes').SeoAiSuggestion} suggestion
 */
export function formatSuggestionsForCopy(suggestion) {
  return [
    'AI SEO Optimization (Preview Mode)',
    '',
    `Suggested Title: ${suggestion.suggestedMetaTitle ?? suggestion.metaTitle}`,
    `Suggested Description: ${suggestion.suggestedMetaDescription ?? suggestion.metaDescription}`,
    '',
    `Focus Keywords: ${(suggestion.focusKeywords ?? []).join(', ')}`,
    '',
    'Improvement Notes:',
    ...(suggestion.improvementNotes ?? []).map((note) => `• ${note}`),
  ].join('\n');
}

function pageToParams(page, overrides = {}) {
  return {
    pageTitle: page.name,
    route: page.route,
    currentMetaTitle: page.metaTitle,
    currentMetaDescription: page.metaDescription,
    pageType: page.pageType,
    module: page.contentModule,
    existingContentSummary: `${page.name} (${page.pageType})`,
    ...overrides,
  };
}

function detectMainIssue(page) {
  if (!page.metaTitle?.trim()) return 'Meta title is missing.';
  if (!page.metaDescription?.trim()) return 'Meta description is missing.';
  if (page.metaDescription.length < 100) return 'Meta description is too short.';
  if (page.metaTitle.length > 60) return 'Meta title may truncate in search results.';
  return 'Metadata could be clearer and more search-focused.';
}

/**
 * Analyze a page for the AI Optimizer panel.
 * @param {Object} page
 * @returns {Promise<import('./seoAiTypes').SeoAiPageAnalysis>}
 */
export async function analyzeSeoPage(page) {
  await delay(300);

  const currentScore = page.seoScore ?? computeSeoScore(runSeoAudit(page));
  const mainIssue = detectMainIssue(page);
  const potentialScore = Math.min(98, currentScore + (currentScore < 75 ? 24 : 14));

  const insightChips = [];
  if (!page.metaDescription?.trim()) insightChips.push('Missing description');
  if (page.metaDescription && page.metaDescription.length < 100) insightChips.push('Short description');
  if (!page.ogImage) insightChips.push('No OG image');
  if (page.hasWarnings) insightChips.push('Audit warnings');

  return {
    currentScore,
    potentialScore,
    mainIssue,
    primaryActionLabel: 'Optimize Metadata',
    insightChips,
    isMock: true,
    _promptPreview: buildSeoAuditPrompt(page),
  };
}

/**
 * Generate a full SEO optimization package.
 * @param {{ page: Object, module?: string, goal?: string, tone?: string }} params
 * @returns {Promise<import('./seoAiTypes').SeoAiOptimization>}
 */
export async function generateSeoOptimization({ page, module, goal = null, tone = 'professional' }) {
  const suggestion = await generateSeoSuggestions({
    ...pageToParams(page, { module: module ?? page.contentModule, tone, optimizationGoal: goal }),
  });

  const currentScore = page.seoScore ?? 60;

  return {
    metaTitle: suggestion.suggestedMetaTitle,
    metaDescription: suggestion.suggestedMetaDescription,
    focusKeywords: suggestion.focusKeywords,
    estimatedScore: suggestion.estimatedScore,
    scoreImprovement: Math.max(0, suggestion.estimatedScore - currentScore),
    goal,
    isMock: true,
    improvementNotes: suggestion.improvementNotes,
    _promptPreview: buildFullOptimizationPrompt(pageToParams(page, { tone, optimizationGoal: goal })),
  };
}

/**
 * Generate alternative metadata pairs.
 * @param {{ page: Object, count?: number, tone?: string }} params
 * @returns {Promise<import('./seoAiTypes').SeoAiAlternative[]>}
 */
export async function generateSeoAlternatives({ page, count = 3, tone = 'professional' }) {
  await delay();

  const base = await generateSeoSuggestions({
    ...pageToParams(page, { tone, optimizationGoal: 'generate-alternatives' }),
  });

  return [
    { metaTitle: base.suggestedMetaTitle, metaDescription: base.suggestedMetaDescription },
    {
      metaTitle: truncate(`${page.name} — Structural Engineering`, 60),
      metaDescription: truncate(
        `Expert structural design for ${page.name}. ODEH & PARTNERS DESIGN — engineering excellence across the Middle East.`,
        160,
      ),
    },
    {
      metaTitle: truncate(`${page.name} | Engineering Firm`, 60),
      metaDescription: truncate(
        `Discover ${page.name} at ODEH & PARTNERS DESIGN. Professional structural engineering and project delivery.`,
        160,
      ),
    },
  ].slice(0, count);
}

/**
 * Apply optimization to page-shaped object (in-memory merge).
 * @param {{ page: Object, optimization: import('./seoAiTypes').SeoAiOptimization }} params
 */
export function applySeoOptimization({ page, optimization }) {
  return {
    ...page,
    metaTitle: optimization.metaTitle ?? page.metaTitle,
    metaDescription: optimization.metaDescription ?? page.metaDescription,
  };
}
