import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { initialSeoPages } from '../mock/buildSeoPages';
import {
  computeSeoStatistics,
  enrichSeoPage,
  enrichSeoPages,
  getInitialSeoPage,
} from '../mock/seoConfig';
import {
  computeModuleSummaries,
  getSeoModuleById,
  groupPagesByModuleSection,
} from '../mock/seoModules';

function filterPagesBySearch(pages, query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return pages;

  return pages.filter(
    (page) =>
      page.name.toLowerCase().includes(normalizedQuery) ||
      page.route.toLowerCase().includes(normalizedQuery) ||
      page.pageType.toLowerCase().includes(normalizedQuery),
  );
}

export function useSeoManagement() {
  const [pages, setPages] = useState(() => structuredClone(initialSeoPages));
  const isLoading = useSimulatedLoading();
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAllModules, setSearchAllModules] = useState(false);
  const [statsScope, setStatsScope] = useState('website');
  const [showAuditPanel, setShowAuditPanel] = useState(false);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const moduleSummaries = useMemo(() => computeModuleSummaries(pages), [pages]);
  const selectedModule = useMemo(
    () => getSeoModuleById(selectedModuleId),
    [selectedModuleId],
  );

  const moduleRawPages = useMemo(() => {
    if (!selectedModuleId) return [];
    return pages.filter((page) => page.contentModule === selectedModuleId);
  }, [pages, selectedModuleId]);

  const modulePages = useMemo(() => enrichSeoPages(moduleRawPages), [moduleRawPages]);

  const searchScopePages = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) {
      return modulePages;
    }

    if (searchAllModules) {
      return enrichSeoPages(filterPagesBySearch(pages, query));
    }

    return filterPagesBySearch(modulePages, query);
  }, [modulePages, pages, searchAllModules, searchQuery]);

  const pageSections = useMemo(() => {
    if (!selectedModuleId || searchQuery.trim()) {
      return [{ id: null, label: null, pages: searchScopePages }];
    }

    return groupPagesByModuleSection(selectedModuleId, searchScopePages);
  }, [searchScopePages, searchQuery, selectedModuleId]);

  const selectedPage = useMemo(() => {
    if (!selectedPageId) return null;
    return searchScopePages.find((page) => page.id === selectedPageId) ?? modulePages[0] ?? null;
  }, [modulePages, searchScopePages, selectedPageId]);

  const editingPage = useMemo(
    () => pages.find((page) => page.id === editingPageId) ?? null,
    [pages, editingPageId],
  );

  const statsPages = useMemo(() => {
    if (statsScope === 'module' && selectedModuleId) {
      return moduleRawPages;
    }
    return pages;
  }, [moduleRawPages, pages, selectedModuleId, statsScope]);

  const statistics = useMemo(
    () =>
      computeSeoStatistics(statsPages, {
        scope: statsScope === 'module' && selectedModuleId ? 'module' : 'website',
      }),
    [statsPages, selectedModuleId, statsScope],
  );

  const auditScopePages = useMemo(() => {
    if (selectedModuleId && statsScope === 'module') {
      return modulePages;
    }
    return enrichSeoPages(pages);
  }, [modulePages, pages, selectedModuleId, statsScope]);

  const siteAuditSummary = useMemo(() => {
    const allChecks = auditScopePages.flatMap((page) => page.audit);
    const pass = allChecks.filter((check) => check.status === 'pass').length;
    const warn = allChecks.filter((check) => check.status === 'warn').length;
    const fail = allChecks.filter((check) => check.status === 'fail').length;

    return { pass, warn, fail, total: allChecks.length };
  }, [auditScopePages]);

  const selectModule = useCallback(
    (moduleId) => {
      const nextModulePages = pages.filter((page) => page.contentModule === moduleId);
      setSelectedModuleId(moduleId);
      setSelectedPageId(nextModulePages[0]?.id ?? null);
      setSearchQuery('');
      setSearchAllModules(false);
      setStatsScope('module');
    },
    [pages],
  );

  const clearModule = useCallback(() => {
    setSelectedModuleId(null);
    setSelectedPageId(null);
    setSearchQuery('');
    setSearchAllModules(false);
    setStatsScope('website');
  }, []);

  const switchModule = useCallback(
    (moduleId) => {
      if (moduleId === selectedModuleId) return;
      selectModule(moduleId);
    },
    [selectModule, selectedModuleId],
  );

  const selectPage = useCallback((pageId) => {
    setSelectedPageId(pageId);
  }, []);

  const setSearchQuerySafe = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const openEdit = useCallback((pageId) => {
    setEditingPageId(pageId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPageId(null);
  }, []);

  const saveEdit = useCallback(
    (updates) => {
      if (!editingPageId) return;

      setPages((prev) =>
        prev.map((page) =>
          page.id === editingPageId
            ? {
                ...page,
                metaTitle: updates.metaTitle ?? page.metaTitle,
                metaDescription: updates.metaDescription ?? page.metaDescription,
              }
            : page,
        ),
      );
      closeEdit();
      showFeedback('SEO metadata saved (preview mode)', 'info');
    },
    [closeEdit, editingPageId, showFeedback],
  );

  const applyAiSuggestion = useCallback(
    (pageId, updates) => {
      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId
            ? {
                ...page,
                metaTitle: updates.metaTitle ?? page.metaTitle,
                metaDescription: updates.metaDescription ?? page.metaDescription,
              }
            : page,
        ),
      );
      showFeedback('AI suggestion applied locally (preview mode)', 'info');
    },
    [showFeedback],
  );

  const resetPage = useCallback(
    (pageId) => {
      const initial = getInitialSeoPage(pageId);
      if (!initial) return;

      setPages((prev) => prev.map((page) => (page.id === pageId ? initial : page)));
      showFeedback('Page reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const copyPageUrl = useCallback(
    async (route) => {
      await copyToClipboard(resolvePublicUrl(route));
      showFeedback('URL copied to clipboard (preview mode)', 'success');
    },
    [showFeedback],
  );

  const openPage = useCallback((route) => {
    openExternalUrl(route);
  }, []);

  const previewSelectedPage = useCallback(() => {
    if (selectedPage) {
      openExternalUrl(selectedPage.route);
    }
  }, [selectedPage]);

  const saveDraft = useCallback(() => {
    showFeedback('SEO workspace draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const generatePreview = useCallback(() => {
    showFeedback('Search preview generated (preview mode)', 'info');
  }, [showFeedback]);

  const toggleAuditPanel = useCallback(() => {
    setShowAuditPanel((prev) => !prev);
  }, []);

  return {
    pages,
    moduleSummaries,
    selectedModuleId,
    selectedModule,
    modulePages,
    pageSections,
    searchScopePages,
    isLoading,
    statistics,
    statsScope,
    setStatsScope,
    selectedPageId,
    selectedPage,
    editingPageId,
    editingPage,
    searchQuery,
    setSearchQuery: setSearchQuerySafe,
    searchAllModules,
    setSearchAllModules,
    showAuditPanel,
    siteAuditSummary,
    feedback,
    selectModule,
    clearModule,
    switchModule,
    selectPage,
    openEdit,
    closeEdit,
    saveEdit,
    applyAiSuggestion,
    resetPage,
    copyPageUrl,
    openPage,
    previewSelectedPage,
    saveDraft,
    generatePreview,
    toggleAuditPanel,
    showFeedback,
    closeFeedback,
    enrichSeoPage,
  };
}
