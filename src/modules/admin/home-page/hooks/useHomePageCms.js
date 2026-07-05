import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { initialHomePageSections } from '../mock/homePageData';
import {
  computeHomePageStatistics,
  getInitialSectionData,
} from '../mock/homePageConfig';

export function useHomePageCms() {
  const [sections, setSections] = useState(() => structuredClone(initialHomePageSections));
  const isLoading = useSimulatedLoading();
  const [editingSectionId, setEditingSectionId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const statistics = useMemo(() => computeHomePageStatistics(sections), [sections]);

  const openEdit = useCallback((sectionId) => {
    setEditingSectionId(sectionId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingSectionId(null);
  }, []);

  const saveSection = useCallback(
    (sectionId) => {
      closeEdit();
      showFeedback(`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} section saved (preview mode)`, 'info');
    },
    [closeEdit, showFeedback],
  );

  const resetSection = useCallback(
    (sectionId) => {
      const initial = getInitialSectionData(sectionId);
      if (!initial) return;

      setSections((prev) => ({
        ...prev,
        [sectionId]: initial,
      }));
      showFeedback('Section reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const previewHomepage = useCallback(() => {
    openExternalUrl('/');
  }, []);

  const saveDraft = useCallback(() => {
    showFeedback('Homepage draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const previewSection = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const copySectionLink = useCallback(
    async (anchor) => {
      const copied = await copyToClipboard(resolvePublicUrl(anchor));
      showFeedback(
        copied ? 'Section link copied to clipboard' : 'Could not copy link (preview mode)',
        copied ? 'success' : 'info',
      );
    },
    [showFeedback],
  );

  return {
    sections,
    isLoading,
    statistics,
    editingSectionId,
    feedback,
    openEdit,
    closeEdit,
    saveSection,
    resetSection,
    previewHomepage,
    saveDraft,
    previewSection,
    copySectionLink,
    showFeedback,
    closeFeedback,
  };
}
