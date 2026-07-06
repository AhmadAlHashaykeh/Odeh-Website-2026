import { useCallback, useEffect, useMemo, useState } from 'react';
import * as seoApi from '../../../../api/seo';
import { ApiError } from '../../../../api/client';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { computeSeoStatistics } from '../mock/seoConfig';
import {
  getSeoModuleById,
  groupPagesByModuleSection,
  computeModuleSummaries,
} from '../mock/seoModules';

function mapSeoPage(page) {
  return {
    ...page,
    name: page.pageName,
    audit: [],
    aiSuggestions: [],
  };
}

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
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAllModules, setSearchAllModules] = useState(false);
  const [statsScope, setStatsScope] = useState('website');
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const loadPages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await seoApi.list({ per_page: 100 });
      setPages(response.data.map(mapSeoPage));
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Failed to load SEO pages.');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const moduleSummaries = useMemo(() => computeModuleSummaries(pages), [pages]);
  const selectedModule = useMemo(
    () => getSeoModuleById(selectedModuleId),
    [selectedModuleId],
  );

  const moduleRawPages = useMemo(() => {
    if (!selectedModuleId) return [];
    return pages.filter((page) => page.contentModule === selectedModuleId);
  }, [pages, selectedModuleId]);

  const modulePages = useMemo(() => moduleRawPages, [moduleRawPages]);

  const searchScopePages = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) {
      return modulePages;
    }

    if (searchAllModules) {
      return filterPagesBySearch(pages, query);
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
    async (updates) => {
      if (!editingPageId) return;

      try {
        const response = await seoApi.update(editingPageId, {
          metaTitle: updates.metaTitle,
          metaDescription: updates.metaDescription,
        });

        const mapped = mapSeoPage(response.data);
        setPages((prev) => prev.map((page) => (page.id === editingPageId ? mapped : page)));
        closeEdit();
        showFeedback('SEO metadata saved.', 'success');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to save SEO metadata.',
          'error',
        );
      }
    },
    [closeEdit, editingPageId, showFeedback],
  );

  const resetPage = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const copyPageUrl = useCallback(
    async (route) => {
      await copyToClipboard(resolvePublicUrl(route));
      showFeedback('URL copied to clipboard.', 'success');
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
    showFeedback('SEO changes are saved per page.', 'info');
  }, [showFeedback]);

  const generatePreview = useCallback(() => {
    if (selectedPage) {
      showFeedback(`Preview: ${selectedPage.metaTitle || selectedPage.name}`, 'info');
    }
  }, [selectedPage, showFeedback]);

  return {
    pages,
    moduleSummaries,
    selectedModuleId,
    selectedModule,
    modulePages,
    pageSections,
    searchScopePages,
    isLoading,
    loadError,
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
    feedback,
    selectModule,
    clearModule,
    switchModule,
    selectPage,
    openEdit,
    closeEdit,
    saveEdit,
    resetPage,
    copyPageUrl,
    openPage,
    previewSelectedPage,
    saveDraft,
    generatePreview,
    showFeedback,
    closeFeedback,
    refresh: loadPages,
  };
}
