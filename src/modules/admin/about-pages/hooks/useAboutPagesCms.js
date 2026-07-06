import { useCallback, useMemo, useState } from 'react';
import * as aboutPagesApi from '../../../../api/aboutPages';
import { ApiError } from '../../../../api/client';
import { extractFormValues } from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useCmsSingleton } from '../../hooks/useCmsSingleton';
import { openExternalUrl } from '../../utils/openExternalUrl';
import { computeAboutPagesStatistics } from '../mock/aboutPagesConfig';

const PANEL_MAP = {
  'overview-hero': { sectionKey: 'overview', dataKey: 'hero' },
  'overview-intro': { sectionKey: 'overview', dataKey: 'content' },
  'overview-gallery': { sectionKey: 'overview', dataKey: 'slider' },
  'approach-hero': { sectionKey: 'approach', dataKey: 'hero' },
  'approach-principles': { sectionKey: 'approach', dataKey: 'principles' },
  'history-hero': { sectionKey: 'history', dataKey: 'hero' },
  'history-story': { sectionKey: 'history', dataKey: 'story' },
  'history-counters': { sectionKey: 'history', dataKey: 'counters' },
  'history-growth': { sectionKey: 'history', dataKey: 'growthTable' },
};

export function useAboutPagesCms() {
  const singleton = useCmsSingleton({
    showFn: aboutPagesApi.show,
    updateFn: aboutPagesApi.update,
  });
  const [activeSection, setActiveSection] = useState('overview');
  const [editingPanelId, setEditingPanelId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const pagesData = singleton.data ?? { overview: {}, approach: {}, history: {} };

  const statistics = useMemo(
    () => computeAboutPagesStatistics(singleton.data?.lastUpdated),
    [singleton.data?.lastUpdated],
  );

  const openEdit = useCallback((panelId) => {
    setEditingPanelId(panelId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPanelId(null);
  }, []);

  const savePanel = useCallback(
    async (panelId, formElement) => {
      const mapping = PANEL_MAP[panelId];
      if (!mapping || !singleton.data) return;

      const { sectionKey, dataKey } = mapping;
      const currentPanel = pagesData[sectionKey]?.[dataKey] ?? {};
      const values = formElement ? extractFormValues(formElement) : {};
      const updatedPanel =
        Object.keys(values).length > 0 ? { ...currentPanel, ...values } : currentPanel;

      const result = await singleton.update({
        ...singleton.data,
        [sectionKey]: {
          ...pagesData[sectionKey],
          [dataKey]: updatedPanel,
        },
      });

      closeEdit();
      showFeedback(
        result.success ? 'Panel saved.' : (result.error?.message ?? 'Failed to save panel.'),
        result.success ? 'success' : 'error',
      );
    },
    [pagesData, singleton, closeEdit, showFeedback],
  );

  const resetPanel = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const previewAbout = useCallback(() => {
    openExternalUrl('/about/overview');
  }, []);

  const saveDraft = useCallback(async () => {
    if (!singleton.data) return;
    const result = await singleton.update(singleton.data);
    showFeedback(
      result.success ? 'About pages saved.' : 'Failed to save about pages.',
      result.success ? 'success' : 'error',
    );
  }, [singleton, showFeedback]);

  const previewPanel = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const editingPanelData = useMemo(() => {
    if (!editingPanelId) return null;
    const mapping = PANEL_MAP[editingPanelId];
    if (!mapping) return null;
    return pagesData[mapping.sectionKey]?.[mapping.dataKey] ?? null;
  }, [editingPanelId, pagesData]);

  const getPanelDataByDefinition = useCallback(
    (panel) => {
      if (!panel?.sectionKey || !panel?.dataKey) return null;
      return pagesData[panel.sectionKey]?.[panel.dataKey] ?? null;
    },
    [pagesData],
  );

  return {
    pagesData,
    activeSection,
    setActiveSection,
    isLoading: singleton.isLoading,
    loadError: singleton.error,
    isSaving: singleton.isSaving,
    statistics,
    editingPanelId,
    editingPanelData,
    feedback,
    openEdit,
    closeEdit,
    savePanel,
    resetPanel,
    previewAbout,
    saveDraft,
    previewPanel,
    getPanelDataByDefinition,
    showFeedback,
    closeFeedback,
  };
}
