import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  analyzeSeoPage,
  formatSuggestionsForCopy,
  generateImprovementPlan,
  generateModuleInsights,
  generateSeoOptimization,
  generateSeoSuggestions,
} from '../ai/seoAiMockService';
import { getActionApplyFields, SEO_AI_PRIMARY_ACTION } from '../ai/seoAiActions';
import { copyToClipboard } from '../../utils/clipboard';

function buildPageSummary(page) {
  if (!page) return '';
  return `${page.name} (${page.pageType}) — ${page.publicationStatus}`;
}

function resolveApplyState(applied) {
  if (applied?.full) return 'full';
  if (applied?.metaTitle || applied?.metaDescription) return 'partial';
  return 'none';
}

export function useSeoAi({ pages, selectedModuleId, selectedModule, selectedPage, showFeedback }) {
  const [tone, setTone] = useState('professional');
  const [activeOptimizationGoal, setActiveOptimizationGoal] = useState(null);
  const [pageSuggestions, setPageSuggestions] = useState({});
  const [pageAnalysis, setPageAnalysis] = useState({});
  const [moduleInsights, setModuleInsights] = useState({});
  const [improvementPlans, setImprovementPlans] = useState({});
  const [appliedFields, setAppliedFields] = useState({});
  const [pendingOptimization, setPendingOptimization] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [loadingPageId, setLoadingPageId] = useState(null);
  const [loadingModuleId, setLoadingModuleId] = useState(null);
  const [loadingPlanModuleId, setLoadingPlanModuleId] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  const moduleRawPages = useMemo(() => {
    if (!selectedModuleId) return [];
    return pages.filter((page) => page.contentModule === selectedModuleId);
  }, [pages, selectedModuleId]);

  const currentPageSuggestion = selectedPage ? pageSuggestions[selectedPage.id] : null;
  const currentPageAnalysis = selectedPage ? pageAnalysis[selectedPage.id] : null;
  const currentModuleInsights = selectedModuleId ? moduleInsights[selectedModuleId] : null;
  const currentImprovementPlan = selectedModuleId ? improvementPlans[selectedModuleId] : null;
  const pageAppliedFields = selectedPage ? appliedFields[selectedPage.id] ?? {} : {};
  const pageApplyState = resolveApplyState(pageAppliedFields);

  const fetchPageAnalysis = useCallback(async (page) => {
    if (!page) return null;
    const analysis = await analyzeSeoPage(page);
    setPageAnalysis((prev) => ({ ...prev, [page.id]: analysis }));
    return analysis;
  }, []);

  const fetchPageSuggestions = useCallback(
    async (page, optimizationGoal = null, nextTone = tone) => {
      if (!page) return null;

      setLoadingPageId(page.id);
      try {
        const suggestion = await generateSeoSuggestions({
          pageTitle: page.name,
          route: page.route,
          currentMetaTitle: page.metaTitle,
          currentMetaDescription: page.metaDescription,
          pageType: page.pageType,
          module: page.contentModule,
          existingContentSummary: buildPageSummary(page),
          tone: nextTone,
          optimizationGoal,
        });

        setPageSuggestions((prev) => ({ ...prev, [page.id]: suggestion }));
        return suggestion;
      } finally {
        setLoadingPageId(null);
      }
    },
    [tone],
  );

  useEffect(() => {
    if (!selectedPage) return;
    if (!pageAnalysis[selectedPage.id]) fetchPageAnalysis(selectedPage);
    if (!pageSuggestions[selectedPage.id]) fetchPageSuggestions(selectedPage);
  }, [selectedPage, pageAnalysis, pageSuggestions, fetchPageAnalysis, fetchPageSuggestions]);

  const analyzeModule = useCallback(async () => {
    if (!selectedModuleId || !selectedModule) return;

    setLoadingModuleId(selectedModuleId);
    try {
      const insights = await generateModuleInsights({
        moduleId: selectedModuleId,
        moduleLabel: selectedModule.label,
        pages: moduleRawPages,
      });
      setModuleInsights((prev) => ({ ...prev, [selectedModuleId]: insights }));
      showFeedback?.('Module analysis complete (preview mode)', 'info');
    } finally {
      setLoadingModuleId(null);
    }
  }, [moduleRawPages, selectedModule, selectedModuleId, showFeedback]);

  const generateModulePlan = useCallback(async () => {
    if (!selectedModuleId || !selectedModule) return;

    setLoadingPlanModuleId(selectedModuleId);
    try {
      const plan = await generateImprovementPlan({
        moduleId: selectedModuleId,
        moduleLabel: selectedModule.label,
        pages: moduleRawPages,
      });
      setImprovementPlans((prev) => ({ ...prev, [selectedModuleId]: plan }));
      showFeedback?.('Improvement plan generated (preview mode)', 'info');
    } finally {
      setLoadingPlanModuleId(null);
    }
  }, [moduleRawPages, selectedModule, selectedModuleId, showFeedback]);

  const openOptimizeReview = useCallback(async () => {
    if (!selectedPage) return;

    setLoadingReview(true);
    try {
      const optimization = await generateSeoOptimization({
        page: selectedPage,
        goal: activeOptimizationGoal,
        tone,
      });
      setPendingOptimization(optimization);
      setReviewModalOpen(true);
    } finally {
      setLoadingReview(false);
    }
  }, [activeOptimizationGoal, selectedPage, tone]);

  const regenerateReview = useCallback(async () => {
    if (!selectedPage) return;
    setLoadingReview(true);
    try {
      const optimization = await generateSeoOptimization({
        page: selectedPage,
        goal: activeOptimizationGoal,
        tone,
      });
      setPendingOptimization(optimization);
      showFeedback?.('AI optimization regenerated (preview mode)', 'info');
    } finally {
      setLoadingReview(false);
    }
  }, [activeOptimizationGoal, selectedPage, showFeedback, tone]);

  const closeReviewModal = useCallback(() => {
    setReviewModalOpen(false);
    setPendingOptimization(null);
  }, []);

  const markApplied = useCallback((pageId, updates) => {
    setAppliedFields((prev) => ({
      ...prev,
      [pageId]: { ...prev[pageId], ...updates },
    }));
  }, []);

  const buildApplyPayload = useCallback((optimization, fields) => {
    const payload = {};
    if (fields.includes('metaTitle')) payload.metaTitle = optimization.metaTitle ?? optimization.suggestedMetaTitle;
    if (fields.includes('metaDescription')) {
      payload.metaDescription = optimization.metaDescription ?? optimization.suggestedMetaDescription;
    }
    return payload;
  }, []);

  const executeSecondaryAction = useCallback(
    async (action, onApply) => {
      if (!selectedPage || !action) return;

      setActiveOptimizationGoal(action.goal);
      const optimization = await generateSeoOptimization({
        page: selectedPage,
        goal: action.goal,
        tone,
      });

      const fields = getActionApplyFields(action);
      const payload = buildApplyPayload(optimization, fields);
      onApply?.(selectedPage.id, payload);

      const appliedUpdate = {};
      if (fields.includes('metaTitle')) appliedUpdate.metaTitle = true;
      if (fields.includes('metaDescription')) appliedUpdate.metaDescription = true;
      markApplied(selectedPage.id, appliedUpdate);

      setPageSuggestions((prev) => ({
        ...prev,
        [selectedPage.id]: {
          ...optimization,
          suggestedMetaTitle: optimization.metaTitle,
          suggestedMetaDescription: optimization.metaDescription,
        },
      }));

      showFeedback?.(`${action.label} applied locally (preview mode)`, 'success');
    },
    [buildApplyPayload, markApplied, selectedPage, showFeedback, tone],
  );

  const applyFromReview = useCallback(
    (onApply) => {
      if (!selectedPage || !pendingOptimization) return;

      onApply?.(selectedPage.id, {
        metaTitle: pendingOptimization.metaTitle,
        metaDescription: pendingOptimization.metaDescription,
      });

      markApplied(selectedPage.id, { metaTitle: true, metaDescription: true, full: true });
      closeReviewModal();
      showFeedback?.('AI optimization applied locally (preview mode)', 'success');
    },
    [closeReviewModal, markApplied, pendingOptimization, selectedPage, showFeedback],
  );

  const copyReviewOptimization = useCallback(async () => {
    if (!pendingOptimization) return;
    await copyToClipboard(formatSuggestionsForCopy(pendingOptimization));
    showFeedback?.('Optimized text copied to clipboard (preview mode)', 'success');
  }, [pendingOptimization, showFeedback]);

  const copySuggestions = useCallback(async () => {
    if (!currentPageSuggestion) return;
    await copyToClipboard(formatSuggestionsForCopy(currentPageSuggestion));
    showFeedback?.('AI suggestions copied to clipboard (preview mode)', 'success');
  }, [currentPageSuggestion, showFeedback]);

  const runBatchAction = useCallback(
    (action) => {
      showFeedback?.(`${action.label} — coming soon (preview mode)`, 'info');
    },
    [showFeedback],
  );

  const regeneratePageSuggestions = useCallback(async () => {
    if (!selectedPage) return;
    await fetchPageSuggestions(selectedPage, activeOptimizationGoal, tone);
    await fetchPageAnalysis(selectedPage);
    showFeedback?.('AI analysis refreshed (preview mode)', 'info');
  }, [activeOptimizationGoal, fetchPageAnalysis, fetchPageSuggestions, selectedPage, showFeedback, tone]);

  const applyOptimizationMode = useCallback(
    async (goal) => {
      if (!selectedPage) return;
      setActiveOptimizationGoal(goal);
      await fetchPageSuggestions(selectedPage, goal, tone);
    },
    [fetchPageSuggestions, selectedPage, tone],
  );

  const changeTone = useCallback(
    async (nextTone) => {
      setTone(nextTone);
      if (selectedPage) {
        await fetchPageSuggestions(selectedPage, activeOptimizationGoal, nextTone);
      }
    },
    [activeOptimizationGoal, fetchPageSuggestions, selectedPage],
  );

  const getPageSuggestion = useCallback(
    (pageId) => pageSuggestions[pageId] ?? null,
    [pageSuggestions],
  );

  const executeModalAction = useCallback(
    async (action, applyFields) => {
      if (!selectedPage && !action._page) return;
      const page = action._page ?? selectedPage;

      if (action.type === 'analyze') {
        await fetchPageAnalysis(page);
        await fetchPageSuggestions(page);
        showFeedback?.('Fields analyzed (preview mode)', 'info');
        return;
      }

      const optimization = await generateSeoOptimization({
        page,
        goal: action.goal ?? null,
        tone,
      });

      setPageSuggestions((prev) => ({
        ...prev,
        [page.id]: {
          ...optimization,
          suggestedMetaTitle: optimization.metaTitle,
          suggestedMetaDescription: optimization.metaDescription,
          lengthFeedback: {
            title: `${optimization.metaTitle?.length ?? 0} characters`,
            description: `${optimization.metaDescription?.length ?? 0} characters`,
          },
          suggestedRewrite: `${optimization.metaTitle} — ${optimization.metaDescription?.slice(0, 90)}`,
        },
      }));

      if (action.type === 'apply-all') {
        applyFields?.({
          metaTitle: optimization.metaTitle,
          metaDescription: optimization.metaDescription,
        });
        showFeedback?.('AI suggestions applied to fields (preview mode)', 'success');
        return;
      }

      const fields = getActionApplyFields(action);
      const updates = {};
      if (fields.includes('metaTitle')) updates.metaTitle = optimization.metaTitle;
      if (fields.includes('metaDescription')) updates.metaDescription = optimization.metaDescription;
      applyFields?.(updates);
      showFeedback?.(`${action.label} applied to fields (preview mode)`, 'success');
    },
    [fetchPageAnalysis, fetchPageSuggestions, selectedPage, showFeedback, tone],
  );

  const isPageLoading = loadingPageId === selectedPage?.id;
  const isModuleAnalyzing = loadingModuleId === selectedModuleId;
  const isPlanGenerating = loadingPlanModuleId === selectedModuleId;

  return {
    tone,
    activeOptimizationGoal,
    currentPageSuggestion,
    currentPageAnalysis,
    currentModuleInsights,
    currentImprovementPlan,
    pageAppliedFields,
    pageApplyState,
    pendingOptimization,
    reviewModalOpen,
    loadingReview,
    isPageLoading,
    isModuleAnalyzing,
    isPlanGenerating,
    primaryAction: SEO_AI_PRIMARY_ACTION,
    analyzeModule,
    generateModulePlan,
    openOptimizeReview,
    closeReviewModal,
    regenerateReview,
    applyFromReview,
    copyReviewOptimization,
    executeSecondaryAction,
    regeneratePageSuggestions,
    applyOptimizationMode,
    changeTone,
    markApplied,
    copySuggestions,
    getPageSuggestion,
    fetchPageSuggestions,
    fetchPageAnalysis,
    executeModalAction,
    runBatchAction,
  };
}
