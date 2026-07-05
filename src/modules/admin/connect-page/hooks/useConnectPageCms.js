import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { copyToClipboard } from '../../utils/clipboard';
import { openExternalUrl, resolvePublicUrl } from '../../utils/openExternalUrl';
import { initialConnectPageData } from '../mock/connectPageData';
import {
  computeConnectPageStatistics,
  getConnectLinkType,
  getInitialHeaderData,
  getInitialLinkData,
  getLinksForPanel,
} from '../mock/connectPageConfig';

export function useConnectPageCms() {
  const [cmsData, setCmsData] = useState(() => structuredClone(initialConnectPageData));
  const isLoading = useSimulatedLoading();
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editingHeader, setEditingHeader] = useState(false);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const statistics = useMemo(() => computeConnectPageStatistics(cmsData.links), [cmsData.links]);

  const enabledLinks = useMemo(
    () => cmsData.links.filter((link) => link.enabled).sort((a, b) => a.order - b.order),
    [cmsData.links],
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

  const saveEdit = useCallback(() => {
    closeEdit();
    showFeedback('Connect page changes saved (preview mode)', 'info');
  }, [closeEdit, showFeedback]);

  const toggleLinkEnabled = useCallback(
    (linkId) => {
      setCmsData((prev) => {
        const next = structuredClone(prev);
        const link = next.links.find((entry) => entry.id === linkId);
        if (!link) return prev;

        link.enabled = !link.enabled;
        showFeedback(
          `${link.title} ${link.enabled ? 'enabled' : 'disabled'} (preview mode)`,
          'info',
        );
        return next;
      });
    },
    [showFeedback],
  );

  const resetLink = useCallback(
    (linkId) => {
      const initial = getInitialLinkData(linkId);
      if (!initial) return;

      setCmsData((prev) => {
        const next = structuredClone(prev);
        const index = next.links.findIndex((entry) => entry.id === linkId);
        if (index === -1) return prev;
        next.links[index] = initial;
        return next;
      });

      showFeedback('Link reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const resetHeader = useCallback(() => {
    const initial = getInitialHeaderData();
    setCmsData((prev) => ({
      ...prev,
      meta: initial.meta,
      hero: initial.hero,
    }));
    showFeedback('Header reset to website defaults (preview mode)', 'info');
  }, [showFeedback]);

  const previewConnectPage = useCallback(() => {
    openExternalUrl('/connect');
  }, []);

  const saveDraft = useCallback(() => {
    showFeedback('Connect page draft saved (preview mode)', 'info');
  }, [showFeedback]);

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
      showFeedback('URL copied to clipboard (preview mode)', 'success');
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
    isLoading,
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
