/** @typedef {'professional' | 'technical' | 'concise' | 'luxury' | 'search-optimized'} SeoAiTone */

/** @typedef {'improve-clarity' | 'shorten-title' | 'expand-description' | 'add-location-keywords' | 'make-professional' | 'improve-search-intent' | 'generate-alternatives'} SeoAiOptimizationGoal */

/** @typedef {'ai-ready' | 'suggestion-available' | 'needs-review' | 'applied-locally' | 'unsaved-ai-changes' | 'ai-optimized' | 'future-api' | 'ai-preview'} SeoAiBadgeType */

/** @typedef {'none' | 'partial' | 'full'} SeoAiApplyState */

/**
 * @typedef {Object} SeoAiSuggestion
 * @property {string} suggestedMetaTitle
 * @property {string} suggestedMetaDescription
 * @property {string[]} focusKeywords
 * @property {string[]} improvementNotes
 * @property {number} estimatedScore
 * @property {{ title: string, description: string }} lengthFeedback
 * @property {string} suggestedRewrite
 * @property {SeoAiTone} tone
 * @property {SeoAiOptimizationGoal | null} optimizationGoal
 * @property {boolean} isMock
 */

/**
 * @typedef {Object} SeoAiPageAnalysis
 * @property {number} currentScore
 * @property {number} potentialScore
 * @property {string} mainIssue
 * @property {string} primaryActionLabel
 * @property {string[]} insightChips
 * @property {boolean} isMock
 */

/**
 * @typedef {Object} SeoAiOptimization
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {string[]} focusKeywords
 * @property {number} estimatedScore
 * @property {number} scoreImprovement
 * @property {SeoAiOptimizationGoal | null} goal
 * @property {boolean} isMock
 */

/**
 * @typedef {Object} SeoAiAlternative
 * @property {string} metaTitle
 * @property {string} metaDescription
 */

/**
 * @typedef {Object} SeoAiModuleInsight
 * @property {string} id
 * @property {string} message
 * @property {'info' | 'warn' | 'opportunity'} severity
 */

/**
 * @typedef {Object} SeoAiImprovementPlan
 * @property {string} moduleId
 * @property {string} summary
 * @property {string[]} priorities
 * @property {number} estimatedImpact
 * @property {boolean} isMock
 */

/**
 * @typedef {Object} GenerateSeoSuggestionsParams
 * @property {string} pageTitle
 * @property {string} route
 * @property {string} [currentMetaTitle]
 * @property {string} [currentMetaDescription]
 * @property {string} [pageType]
 * @property {string} [module]
 * @property {string} [existingContentSummary]
 * @property {SeoAiTone} [tone]
 * @property {SeoAiOptimizationGoal | null} [optimizationGoal]
 * @property {string} [brandTone]
 * @property {string} [targetAudience]
 */

/**
 * @typedef {Object} GenerateModuleInsightsParams
 * @property {string} moduleId
 * @property {string} moduleLabel
 * @property {Array} pages
 */

export {};
