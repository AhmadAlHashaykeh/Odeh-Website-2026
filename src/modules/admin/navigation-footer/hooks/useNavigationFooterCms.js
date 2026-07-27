import { useCallback, useMemo, useState } from 'react';
import * as navigationFooterApi from '../../../../api/navigationFooter';
import { usePublicSite } from '../../../../context/PublicSiteContext';
import {
  extractFormValues,
  mapNavigationFooterFromForm,
} from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useCmsSingleton } from '../../hooks/useCmsSingleton';
import { openExternalUrl } from '../../utils/openExternalUrl';
import { computeNavigationFooterStatistics, getPanelData } from '../mock/navigationFooterConfig';

export function useNavigationFooterCms() {
  const { refresh: refreshPublicSite } = usePublicSite();
  const singleton = useCmsSingleton({
    showFn: navigationFooterApi.show,
    updateFn: navigationFooterApi.update,
  });
  const [activeSection, setActiveSection] = useState('main-navigation');
  const [editingPanelId, setEditingPanelId] = useState(null);
  const [editingNavItemId, setEditingNavItemId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const cmsData = singleton.data ?? {
    logo: {},
    navigationItems: [],
    footerBrand: {},
    footerNavGroups: [],
    contact: {},
    socialLinks: [],
    copyright: {},
  };

  const statistics = useMemo(
    () => computeNavigationFooterStatistics(cmsData, singleton.data?.lastUpdated),
    [cmsData, singleton.data?.lastUpdated],
  );

  const openEdit = useCallback((panelId, navItemId = null) => {
    setEditingPanelId(panelId);
    setEditingNavItemId(navItemId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPanelId(null);
    setEditingNavItemId(null);
  }, []);

  const savePanel = useCallback(
    async (panelId, formElement) => {
      if (!singleton.data) return;

      const values = formElement ? extractFormValues(formElement) : {};
      const nextData = mapNavigationFooterFromForm(
        panelId,
        singleton.data,
        values,
        editingNavItemId,
      );

      const result = await singleton.update(nextData);
      if (result.success) {
        await refreshPublicSite();
      }
      closeEdit();
      showFeedback(
        result.success ? 'Panel saved.' : (result.error?.message ?? 'Failed to save panel.'),
        result.success ? 'success' : 'error',
      );
    },
    [singleton, editingNavItemId, closeEdit, showFeedback, refreshPublicSite],
  );

  const resetPanel = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const previewWebsite = useCallback(() => {
    openExternalUrl('/');
  }, []);

  const saveDraft = useCallback(async () => {
    if (!singleton.data) return;
    const result = await singleton.update(singleton.data);
    if (result.success) {
      await refreshPublicSite();
    }
    showFeedback(
      result.success ? 'Navigation & footer saved.' : 'Failed to save.',
      result.success ? 'success' : 'error',
    );
  }, [singleton, showFeedback, refreshPublicSite]);

  const previewPanel = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const previewSocial = useCallback((href) => {
    openExternalUrl(href);
  }, []);

  const editingPanelData = useMemo(() => {
    if (!editingPanelId) return null;

    if (editingPanelId === 'nav-menu' && editingNavItemId) {
      return cmsData.navigationItems.find((item) => item.id === editingNavItemId) ?? null;
    }

    const panelDefs = [
      { id: 'nav-logo', sectionKey: 'logo', dataKey: 'logo' },
      { id: 'nav-menu', sectionKey: 'navigation', dataKey: 'navigationItems' },
      { id: 'footer-brand', sectionKey: 'footerBrand', dataKey: 'footerBrand' },
      { id: 'footer-copyright', sectionKey: 'copyright', dataKey: 'copyright' },
    ];

    const panel = panelDefs.find((entry) => entry.id === editingPanelId);
    if (!panel) return null;
    return getPanelData(cmsData, { ...panel, id: editingPanelId });
  }, [editingPanelId, editingNavItemId, cmsData]);

  const getPanelDataByDefinition = useCallback(
    (panel) => getPanelData(cmsData, panel),
    [cmsData],
  );

  return {
    cmsData,
    activeSection,
    setActiveSection,
    isLoading: singleton.isLoading,
    loadError: singleton.error,
    isSaving: singleton.isSaving,
    statistics,
    editingPanelId,
    editingNavItemId,
    editingPanelData,
    feedback,
    openEdit,
    closeEdit,
    savePanel,
    resetPanel,
    previewWebsite,
    saveDraft,
    previewPanel,
    previewSocial,
    getPanelDataByDefinition,
    showFeedback,
    closeFeedback,
  };
}
