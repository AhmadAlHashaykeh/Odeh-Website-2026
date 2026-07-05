import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { openExternalUrl } from '../../utils/openExternalUrl';
import { initialNavigationFooterData } from '../mock/navigationFooterData';
import {
  computeNavigationFooterStatistics,
  getInitialPanelData,
  getPanelData,
} from '../mock/navigationFooterConfig';

export function useNavigationFooterCms() {
  const [cmsData, setCmsData] = useState(() => structuredClone(initialNavigationFooterData));
  const [activeSection, setActiveSection] = useState('main-navigation');
  const isLoading = useSimulatedLoading();
  const [editingPanelId, setEditingPanelId] = useState(null);
  const [editingNavItemId, setEditingNavItemId] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const statistics = useMemo(() => computeNavigationFooterStatistics(), []);

  const openEdit = useCallback((panelId, navItemId = null) => {
    setEditingPanelId(panelId);
    setEditingNavItemId(navItemId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingPanelId(null);
    setEditingNavItemId(null);
  }, []);

  const savePanel = useCallback(
    (panelId) => {
      closeEdit();
      const label = panelId
        .split('-')
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      showFeedback(`${label} saved (preview mode)`, 'info');
    },
    [closeEdit, showFeedback],
  );

  const resetPanel = useCallback(
    (panelId) => {
      const initial = getInitialPanelData(panelId);
      if (!initial) return;

      setCmsData((prev) => {
        const next = structuredClone(prev);

        switch (panelId) {
          case 'nav-logo':
            next.logo = initial;
            break;
          case 'nav-menu':
            next.navigationItems = initial;
            break;
          case 'footer-brand':
            next.footerBrand = initial;
            break;
          case 'footer-nav-get-started':
            next.footerNavGroups = next.footerNavGroups.map((group) =>
              group.title === 'Get Started' ? initial : group,
            );
            break;
          case 'footer-nav-about':
            next.footerNavGroups = next.footerNavGroups.map((group) =>
              group.title === 'About Us' ? initial : group,
            );
            break;
          case 'footer-reach-us':
            next.contact = initial;
            break;
          case 'footer-copyright':
            next.copyright = initial;
            break;
          case 'contact-office':
            next.contact.officeName = initial.officeName;
            next.contact.location = initial.location;
            next.contact.workingHours = initial.workingHours;
            break;
          case 'contact-direct':
            next.contact.contacts = initial;
            break;
          default:
            if (panelId.startsWith('social-')) {
              const icon = panelId.replace('social-', '');
              next.socialLinks = next.socialLinks.map((link) =>
                link.icon === icon ? initial : link,
              );
            }
            break;
        }

        return next;
      });

      showFeedback('Panel reset to website defaults (preview mode)', 'info');
    },
    [showFeedback],
  );

  const previewWebsite = useCallback(() => {
    openExternalUrl('/');
  }, []);

  const saveDraft = useCallback(() => {
    showFeedback('Navigation & footer draft saved (preview mode)', 'info');
  }, [showFeedback]);

  const previewPanel = useCallback((anchor) => {
    openExternalUrl(anchor);
  }, []);

  const previewSocial = useCallback((href) => {
    openExternalUrl(href);
  }, []);

  const editingPanelData = useMemo(() => {
    if (!editingPanelId) return null;

    const panelDefs = [
      { id: 'nav-logo', sectionKey: 'logo', dataKey: 'logo' },
      { id: 'nav-menu', sectionKey: 'navigation', dataKey: 'navigationItems' },
      { id: 'footer-brand', sectionKey: 'footerBrand', dataKey: 'footerBrand' },
      { id: 'footer-nav-get-started', sectionKey: 'footerNav', dataKey: 'getStarted' },
      { id: 'footer-nav-about', sectionKey: 'footerNav', dataKey: 'aboutUs' },
      { id: 'footer-reach-us', sectionKey: 'footerContact', dataKey: 'contact' },
      { id: 'footer-copyright', sectionKey: 'copyright', dataKey: 'copyright' },
      { id: 'contact-office', sectionKey: 'contact', dataKey: 'office' },
      { id: 'contact-direct', sectionKey: 'contact', dataKey: 'contacts' },
      ...cmsData.socialLinks.map((link) => ({
        id: `social-${link.icon}`,
        sectionKey: 'social',
        dataKey: link.icon,
        platform: link.icon,
      })),
    ];

    const panel = panelDefs.find((entry) => entry.id === editingPanelId);
    if (!panel) return null;

    const data = getPanelData(cmsData, { ...panel, id: editingPanelId });

    if (editingPanelId === 'nav-menu' && editingNavItemId) {
      const navItem = cmsData.navigationItems.find((item) => item.id === editingNavItemId);
      if (navItem) return navItem;
    }

    return data;
  }, [editingPanelId, editingNavItemId, cmsData]);

  const getPanelDataByDefinition = useCallback(
    (panel) => getPanelData(cmsData, panel),
    [cmsData],
  );

  return {
    cmsData,
    activeSection,
    setActiveSection,
    isLoading,
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
