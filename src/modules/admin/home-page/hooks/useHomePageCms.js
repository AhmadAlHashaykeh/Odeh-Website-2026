import { useCallback, useMemo, useState } from 'react';
import * as homePageApi from '../../../../api/homePage';
import { ApiError } from '../../../../api/client';
import { extractFormValues } from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useCmsSingleton } from '../../hooks/useCmsSingleton';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import {
  computeHomePageStatistics,
  sectionDefinitions,
} from '../mock/homePageConfig';

function mergeSectionFromForm(sectionId, currentSection, formElement) {
  const values = extractFormValues(formElement);
  if (!values || Object.keys(values).length === 0) {
    return currentSection;
  }

  return { ...currentSection, ...values };
}

export function useHomePageCms() {
  const singleton = useCmsSingleton({
    showFn: homePageApi.show,
    updateFn: homePageApi.update,
  });
  const [editingSectionId, setEditingSectionId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const sections = useMemo(() => {
    if (!singleton.data) return {};
    const { hero, about, services, projects } = singleton.data;
    return { hero, about, services, projects };
  }, [singleton.data]);

  const statistics = useMemo(
    () => (sections.hero ? computeHomePageStatistics(sections, singleton.data?.lastUpdated) : []),
    [sections, singleton.data?.lastUpdated],
  );

  const openEdit = useCallback((sectionId) => {
    setEditingSectionId(sectionId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingSectionId(null);
  }, []);

  const saveSection = useCallback(
    async (sectionId, formElement) => {
      const currentSection = sections[sectionId];
      if (!currentSection) return;

      const updatedSection = formElement
        ? mergeSectionFromForm(sectionId, currentSection, formElement)
        : currentSection;

      const result = await singleton.update({
        ...singleton.data,
        [sectionId]: updatedSection,
      });

      closeEdit();

      if (result.success) {
        showFeedback('Homepage section saved.', 'success');
      } else {
        const message =
          result.error instanceof ApiError ? result.error.message : 'Failed to save section.';
        showFeedback(message, 'error');
      }
    },
    [sections, singleton, closeEdit, showFeedback],
  );

  const resetSection = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const previewHomepage = useCallback(() => {
    openExternalUrl('/');
  }, []);

  const saveDraft = useCallback(async () => {
    if (!singleton.data) return;
    const result = await singleton.update(singleton.data);
    showFeedback(
      result.success ? 'Homepage saved.' : 'Failed to save homepage.',
      result.success ? 'success' : 'error',
    );
  }, [singleton, showFeedback]);

  const previewSection = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const copySectionLink = useCallback(
    async (anchor) => {
      const copied = await copyToClipboard(resolvePublicUrl(anchor));
      showFeedback(
        copied ? 'Section link copied to clipboard.' : 'Could not copy link.',
        copied ? 'success' : 'info',
      );
    },
    [showFeedback],
  );

  return {
    sections,
    isLoading: singleton.isLoading,
    loadError: singleton.error,
    isSaving: singleton.isSaving,
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
    sectionDefinitions,
  };
}
