import { useCallback, useMemo, useState } from 'react';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useSimulatedLoading } from '../../hooks/useSimulatedLoading';
import { openExternalUrl } from '../../utils/openExternalUrl';
import {
  computeWebsiteSettingsStatistics,
  getInitialSettingsData,
} from '../mock/websiteSettingsConfig';

export function useWebsiteSettings() {
  const [settings, setSettings] = useState(getInitialSettingsData);
  const [activeSection, setActiveSection] = useState('general');
  const isLoading = useSimulatedLoading(420);
  const [editingKey, setEditingKey] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  const statistics = useMemo(() => computeWebsiteSettingsStatistics(settings), [settings]);

  const openEdit = useCallback((editKey) => {
    setEditingKey(editKey);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingKey(null);
  }, []);

  const saveEdit = useCallback(
    (editKey, values) => {
      setSettings((prev) => {
        switch (editKey) {
          case 'general-identity':
            return {
              ...prev,
              general: {
                ...prev.general,
                websiteName: values.websiteName,
                websiteDescription: values.websiteDescription,
                defaultLanguage: values.defaultLanguage,
              },
            };
          case 'branding-favicon':
            return {
              ...prev,
              branding: {
                ...prev.branding,
                favicon: {
                  ...prev.branding.favicon,
                  src: values.faviconSrc,
                },
              },
            };
          case 'search-placeholders':
            return {
              ...prev,
              search: {
                ...prev.search,
                pagePlaceholder: values.pagePlaceholder,
                overlayPlaceholder: values.overlayPlaceholder,
                overlaySubtitle: values.overlaySubtitle,
              },
            };
          case 'search-limits':
            return {
              ...prev,
              search: {
                ...prev.search,
                suggestionsLimit: Number(values.suggestionsLimit),
                resultsLimit: Number(values.resultsLimit),
              },
            };
          case 'integrations-maps':
            return {
              ...prev,
              integrations: {
                ...prev.integrations,
                googleMapsEmbedUrl: values.googleMapsEmbedUrl,
              },
            };
          default:
            return prev;
        }
      });

      closeEdit();
      showFeedback('Setting saved (preview mode)', 'info');
    },
    [closeEdit, showFeedback],
  );

  const previewWebsite = useCallback(() => {
    openExternalUrl('/');
  }, []);

  const saveDraft = useCallback(() => {
    showFeedback('Website settings draft saved (preview mode)', 'info');
  }, [showFeedback]);

  return {
    settings,
    activeSection,
    setActiveSection,
    isLoading,
    statistics,
    editingKey,
    openEdit,
    closeEdit,
    saveEdit,
    previewWebsite,
    saveDraft,
    feedback,
    closeFeedback,
  };
}
