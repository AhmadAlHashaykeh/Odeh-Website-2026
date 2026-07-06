import { useCallback, useMemo, useState } from 'react';
import * as connectPageApi from '../../../../api/connectPage';
import { extractFormValues } from '../../cms/action-flows/mapFormValuesToApi';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useCmsSingleton } from '../../hooks/useCmsSingleton';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import {
  computeConnectPageStatistics,
  getConnectLinkType,
  getLinksForPanel,
} from '../mock/connectPageConfig';

export function useConnectPageCms() {
  const singleton = useCmsSingleton({
    showFn: connectPageApi.show,
    updateFn: connectPageApi.update,
  });
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const cmsData = singleton.data ?? { meta: {}, hero: {}, links: [] };

  const enabledLinks = useMemo(
    () => cmsData.links.filter((link) => link.enabled).sort((a, b) => a.order - b.order),
    [cmsData.links],
  );

  const statistics = useMemo(
    () => computeConnectPageStatistics(cmsData.links, singleton.data?.lastUpdated),
    [cmsData.links, singleton.data?.lastUpdated],
  );

  const openEditHeader = useCallback(() => {
    setEditingHeader(true);
    setEditingLinkId(null);
  }, []);

  const openEditLink = useCallback((linkId) => {
    setEditingLinkId(linkId);
    setEditingHeader(false);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingLinkId(null);
    setEditingHeader(false);
  }, []);

  const saveEdit = useCallback(
    async (formElement) => {
      if (!singleton.data) return;

      const values = formElement ? extractFormValues(formElement) : {};
      let nextData = { ...singleton.data };

      if (editingHeader) {
        nextData = {
          ...nextData,
          meta: { ...nextData.meta, ...values },
          hero: { ...nextData.hero, ...values },
        };
      } else if (editingLinkId) {
        nextData = {
          ...nextData,
          links: nextData.links.map((link) =>
            link.id === editingLinkId ? { ...link, ...values } : link,
          ),
        };
      }

      const result = await singleton.update(nextData);
      closeEdit();
      showFeedback(
        result.success ? 'Connect page saved.' : (result.error?.message ?? 'Failed to save.'),
        result.success ? 'success' : 'error',
      );
    },
    [singleton, editingHeader, editingLinkId, closeEdit, showFeedback],
  );

  const toggleLinkEnabled = useCallback(
    async (linkId) => {
      if (!singleton.data) return;

      const link = singleton.data.links.find((entry) => entry.id === linkId);
      if (!link) return;

      const nextData = {
        ...singleton.data,
        links: singleton.data.links.map((entry) =>
          entry.id === linkId ? { ...entry, enabled: !entry.enabled } : entry,
        ),
      };

      const result = await singleton.update(nextData);
      showFeedback(
        result.success
          ? `${link.title} ${!link.enabled ? 'enabled' : 'disabled'}.`
          : 'Failed to update link.',
        result.success ? 'success' : 'error',
      );
    },
    [singleton, showFeedback],
  );

  const resetLink = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const resetHeader = useCallback(() => {
    showFeedback('Reload the page to discard unsaved local changes.', 'info');
  }, [showFeedback]);

  const previewConnectPage = useCallback(() => {
    openExternalUrl('/connect');
  }, []);

  const saveDraft = useCallback(async () => {
    if (!singleton.data) return;
    const result = await singleton.update(singleton.data);
    showFeedback(
      result.success ? 'Connect page saved.' : 'Failed to save.',
      result.success ? 'success' : 'error',
    );
  }, [singleton, showFeedback]);

  const previewLink = useCallback(
    (link) => {
      const type = getConnectLinkType(link);

      if (type === 'internal') {
        showFeedback(`Internal route: ${link.url}`, 'info');
        return;
      }

      if (
        link.url.startsWith('http') ||
        link.url.startsWith('tel:') ||
        link.url.startsWith('mailto:')
      ) {
        openExternalUrl(link.url);
        return;
      }

      if (link.url.startsWith('/')) {
        openExternalUrl(link.url);
        return;
      }

      showFeedback(`Preview: ${link.url}`, 'info');
    },
    [showFeedback],
  );

  const copyLinkUrl = useCallback(
    async (url) => {
      const fullUrl = resolvePublicUrl(url);
      await copyToClipboard(fullUrl);
      showFeedback('URL copied to clipboard.', 'success');
    },
    [showFeedback],
  );

  const getPanelLinks = useCallback(
    (panelId) => getLinksForPanel(panelId, cmsData.links),
    [cmsData.links],
  );

  const editingLink = useMemo(() => {
    if (!editingLinkId) return null;
    return cmsData.links.find((link) => link.id === editingLinkId) ?? null;
  }, [editingLinkId, cmsData.links]);

  const editingHeaderData = useMemo(() => {
    if (!editingHeader) return null;
    return { meta: cmsData.meta, hero: cmsData.hero };
  }, [editingHeader, cmsData.meta, cmsData.hero]);

  return {
    cmsData,
    enabledLinks,
    isLoading: singleton.isLoading,
    loadError: singleton.error,
    isSaving: singleton.isSaving,
    statistics,
    editingLinkId,
    editingLink,
    editingHeader,
    editingHeaderData,
    feedback,
    openEditHeader,
    openEditLink,
    closeEdit,
    saveEdit,
    toggleLinkEnabled,
    resetLink,
    resetHeader,
    previewConnectPage,
    saveDraft,
    previewLink,
    copyLinkUrl,
    getPanelLinks,
    showFeedback,
    closeFeedback,
  };
}
