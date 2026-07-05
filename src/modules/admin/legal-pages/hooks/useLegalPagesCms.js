import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { initialLegalPagesData } from '../mock/legalPagesData';
import { computeLegalPagesStatistics, getInitialLegalPage } from '../mock/legalPagesConfig';

export function useLegalPagesCms() {
  const [pages, setPages] = useState(() => structuredClone(initialLegalPagesData));
  const isLoading = useSimulatedLoading();
  const [previewPageId, setPreviewPageId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

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

  const saveEdit = useCallback(() => {
    closeEdit();
    showFeedback('Legal page saved (preview mode)', 'info');
  }, [closeEdit, showFeedback]);

  const resetPage = useCallback(
    (pageId) => {
      const initial = getInitialLegalPage(pageId);
      if (!initial) return;

      setPages((prev) => prev.map((page) => (page.id === pageId ? initial : page)));
      showFeedback('Page reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const previewWebsite = useCallback((path) => {
    openExternalUrl(path);
  }, []);

  const previewFirstPage = useCallback(() => {
    const first = pages[0];
    if (first) {
      openExternalUrl(first.path);
    }
  }, [pages]);

  const saveDraft = useCallback(() => {
    showFeedback('Legal pages draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const copyPageUrl = useCallback(
    async (path) => {
      await copyToClipboard(resolvePublicUrl(path));
      showFeedback('URL copied to clipboard (preview mode)', 'success');
    },
    [showFeedback],
  );

  return {
    pages,
    isLoading,
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
  };
}
