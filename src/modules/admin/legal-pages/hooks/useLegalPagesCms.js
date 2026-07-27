import { useCallback, useEffect, useMemo, useState } from 'react';
import * as legalPagesApi from '../../../../api/legalPages';
import { ApiError } from '../../../../api/client';
import {
  extractFormValues,
  mapLegalPageFromForm,
} from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { computeLegalPagesStatistics } from '../mock/legalPagesConfig';

export function useLegalPagesCms() {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewPageId, setPreviewPageId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const loadPages = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await legalPagesApi.list();
      setPages(Array.isArray(response) ? response : []);
    } catch (error) {
      setLoadError(error instanceof ApiError ? error.message : 'Failed to load legal pages.');
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const statistics = useMemo(() => computeLegalPagesStatistics(pages), [pages]);

  const previewPage = useMemo(
    () => pages.find((page) => page.id === previewPageId) ?? null,
    [pages, previewPageId],
  );

  const editingPage = useMemo(
    () => pages.find((page) => page.id === editingPageId) ?? null,
    [pages, editingPageId],
  );

  const openPreview = useCallback((pageId) => {
    setPreviewPageId(pageId);
    setEditingPageId(null);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewPageId(null);
  }, []);

  const openEdit = useCallback((pageId) => {
    setEditingPageId(pageId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPageId(null);
  }, []);

  const saveEdit = useCallback(
    async (formElement) => {
      if (!editingPageId) return;

      const page = pages.find((entry) => entry.id === editingPageId);
      if (!page) return;

      const values = formElement ? extractFormValues(formElement) : {};
      const payload = mapLegalPageFromForm(page, values);

      setIsSaving(true);

      try {
        const response = await legalPagesApi.update(page.slug, payload);
        setPages((prev) =>
          prev.map((entry) => (entry.id === editingPageId ? response.data : entry)),
        );
        closeEdit();
        showFeedback('Legal page saved.', 'success');
      } catch (error) {
        showFeedback(
          error instanceof ApiError ? error.message : 'Failed to save legal page.',
          'error',
        );
      } finally {
        setIsSaving(false);
      }
    },
    [editingPageId, pages, closeEdit, showFeedback],
  );

  const resetPage = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const previewWebsite = useCallback((path) => {
    openExternalUrl(path);
  }, []);

  const previewFirstPage = useCallback(() => {
    const first = pages[0];
    if (first) {
      openExternalUrl(first.path);
    }
  }, [pages]);

  const saveDraft = useCallback(async () => {
    showFeedback('Legal pages are saved individually.', 'info');
  }, [showFeedback]);

  const copyPageUrl = useCallback(
    async (path) => {
      await copyToClipboard(resolvePublicUrl(path));
      showFeedback('URL copied to clipboard.', 'success');
    },
    [showFeedback],
  );

  return {
    pages,
    isLoading,
    loadError,
    isSaving,
    statistics,
    previewPageId,
    previewPage,
    editingPageId,
    editingPage,
    feedback,
    openPreview,
    closePreview,
    openEdit,
    closeEdit,
    saveEdit,
    resetPage,
    previewWebsite,
    previewFirstPage,
    saveDraft,
    copyPageUrl,
    showFeedback,
    closeFeedback,
    refresh: loadPages,
  };
}
