import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getNavigationFooter, getWebsiteSettings } from '../api/public/content';

const PublicSiteContext = createContext(null);

export function PublicSiteProvider({ children }) {
  const [navigationFooter, setNavigationFooter] = useState(null);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [navResponse, settingsResponse] = await Promise.all([
          getNavigationFooter(),
          getWebsiteSettings(),
        ]);

        if (!cancelled) {
          setNavigationFooter(navResponse.data);
          setWebsiteSettings(settingsResponse.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      navigationFooter,
      websiteSettings,
      loading,
      error,
      navLinks: navigationFooter?.navigationItems ?? [],
      footerQuickLinks: navigationFooter?.footerQuickLinks ?? [],
      socialLinks: navigationFooter?.socialLinks ?? [],
      contactInfo: navigationFooter?.contact ?? {},
      publicPages: websiteSettings?.publicPages ?? {},
      searchSettings: websiteSettings?.search ?? {},
      integrations: websiteSettings?.integrations ?? {},
      branding: websiteSettings?.branding ?? {},
      general: websiteSettings?.general ?? {},
    }),
    [navigationFooter, websiteSettings, loading, error],
  );

  return <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>;
}

export function usePublicSite() {
  const context = useContext(PublicSiteContext);
  if (!context) {
    throw new Error('usePublicSite must be used within PublicSiteProvider');
  }
  return context;
}
