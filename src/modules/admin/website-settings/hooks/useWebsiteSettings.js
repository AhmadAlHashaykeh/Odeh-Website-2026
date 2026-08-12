import { useCallback, useEffect, useMemo, useState } from 'react';
import * as websiteSettingsApi from '../../../../api/websiteSettings';
import * as seoApi from '../../../../api/seo';
import { ApiError } from '../../../../api/client';
import { usePublicSite } from '../../../../context/PublicSiteContext';
import { useActionFeedback } from '../../hooks/useActionFeedback';
import { useCmsSingleton } from '../../hooks/useCmsSingleton';
import { openExternalUrl } from '../../utils/openExternalUrl';
import { computeWebsiteSettingsStatistics } from '../mock/websiteSettingsConfig';

const SECTION_PATCH_MAP = {
  'general-identity': 'general-identity',
  'branding-favicon': 'branding-favicon',
  'search-placeholders': 'search-placeholders',
  'search-limits': 'search-limits',
  'integrations-maps': 'integrations-maps',
};

export function useWebsiteSettings() {
  const { refresh: refreshPublicSite } = usePublicSite();
  const singleton = useCmsSingleton({
    showFn: websiteSettingsApi.show,
    updateFn: websiteSettingsApi.update,
  });
  const [activeSection, setActiveSection] = useState('general');
  const [publicPageCount, setPublicPageCount] = useState(0);
  const [editingKey, setEditingKey] = useState(null);
  const { feedback, showFeedback, closeFeedback } = useActionFeedback();

  useEffect(() => {
    let cancelled = false;

    seoApi
      .list({ per_page: 1 })
      .then((response) => {
        if (!cancelled) {
          setPublicPageCount(response.meta?.total ?? response.data?.length ?? 0);
        }
      })
      .catch(() => {
        if (!cancelled) setPublicPageCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const settings = singleton.data ?? {
    general: {},
    branding: {},
    search: {},
    integrations: {},
  };

  const statistics = useMemo(
    () => computeWebsiteSettingsStatistics(settings, publicPageCount),
    [settings, publicPageCount],
  );

  const openEdit = useCallback((editKey) => {
    setEditingKey(editKey);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingKey(null);
  }, []);

  const saveEdit = useCallback(
    async (editKey, values) => {
      const section = SECTION_PATCH_MAP[editKey];
      let result;

      if (section) {
        setEditingKey(null);
        try {
          const response = await websiteSettingsApi.updateSection(section, values);
          singleton.setData(response.data);
          result = { success: true };
        } catch (error) {
          result = {
            success: false,
            error: error instanceof ApiError ? error : new ApiError('Failed to save setting.', 0),
          };
        }
      } else if (singleton.data) {
        result = await singleton.update({
          ...singleton.data,
          ...values,
        });
      } else {
        result = { success: false, error: new ApiError('Settings not loaded.', 0) };
      }

      if (result.success) {
        await refreshPublicSite();
      }

      closeEdit();
      showFeedback(
        result.success ? 'Setting saved.' : (result.error?.message ?? 'Failed to save setting.'),
        result.success ? 'success' : 'error',
      );
    },
    [singleton, closeEdit, showFeedback, refreshPublicSite],
  );

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
      result.success ? 'Website settings saved.' : 'Failed to save settings.',
      result.success ? 'success' : 'error',
    );
  }, [singleton, showFeedback, refreshPublicSite]);

  return {
    settings,
    activeSection,
    setActiveSection,
    isLoading: singleton.isLoading,
    loadError: singleton.error,
    isSaving: singleton.isSaving,
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
