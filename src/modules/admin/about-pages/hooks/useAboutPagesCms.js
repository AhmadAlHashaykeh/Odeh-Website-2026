import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { openExternalUrl } from '../../utils/openExternalUrl';
import { initialAboutPagesData } from '../mock/aboutPagesData';
import {
  computeAboutPagesStatistics,
  getInitialPanelData,
  getPanelData,
} from '../mock/aboutPagesConfig';

export function useAboutPagesCms() {
  const [pagesData, setPagesData] = useState(() => structuredClone(initialAboutPagesData));
  const [activeSection, setActiveSection] = useState('overview');
  const isLoading = useSimulatedLoading();
  const [editingPanelId, setEditingPanelId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const statistics = useMemo(() => computeAboutPagesStatistics(), []);

  const openEdit = useCallback((panelId) => {
    setEditingPanelId(panelId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPanelId(null);
  }, []);

  const savePanel = useCallback(
    (panelId) => {
      closeEdit();
      const title = panelId
        .split('-')
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      showFeedback(`${title} saved (preview mode)`, 'info');
    },
    [closeEdit, showFeedback],
  );

  const resetPanel = useCallback(
    (panelId, panel) => {
      const initial = getInitialPanelData(panelId);
      if (!initial || !panel) return;

      setPagesData((prev) => ({
        ...prev,
        [panel.sectionKey]: {
          ...prev[panel.sectionKey],
          [panel.dataKey]: initial,
        },
      }));
      showFeedback('Panel reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const previewAbout = useCallback(() => {
    openExternalUrl('/about/overview');
  }, []);

  const saveDraft = useCallback(() => {
    showFeedback('About pages draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const previewPanel = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const editingPanelData = useMemo(() => {
    if (!editingPanelId) return null;

    const allPanels = [
      ...['overview', 'approach', 'history'].flatMap((section) => {
        const panels = {
          overview: [
            { id: 'overview-hero', sectionKey: 'overview', dataKey: 'hero' },
            { id: 'overview-intro', sectionKey: 'overview', dataKey: 'content' },
            { id: 'overview-gallery', sectionKey: 'overview', dataKey: 'slider' },
          ],
          approach: [
            { id: 'approach-hero', sectionKey: 'approach', dataKey: 'hero' },
            { id: 'approach-principles', sectionKey: 'approach', dataKey: 'principles' },
          ],
          history: [
            { id: 'history-hero', sectionKey: 'history', dataKey: 'hero' },
            { id: 'history-story', sectionKey: 'history', dataKey: 'story' },
            { id: 'history-counters', sectionKey: 'history', dataKey: 'counters' },
            { id: 'history-growth', sectionKey: 'history', dataKey: 'growthTable' },
          ],
        }[section];
        return panels;
      }),
    ];

    const panel = allPanels.find((p) => p.id === editingPanelId);
    if (!panel) return null;

    return pagesData[panel.sectionKey][panel.dataKey];
  }, [editingPanelId, pagesData]);

  const getPanelDataByDefinition = useCallback(
    (panel) => getPanelData(pagesData, panel),
    [pagesData],
  );

  return {
    pagesData,
    activeSection,
    setActiveSection,
    isLoading,
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
