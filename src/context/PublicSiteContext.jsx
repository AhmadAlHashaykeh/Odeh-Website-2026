import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getNavigationFooter, getWebsiteSettings } from '../api/public/content';
import { normalizePublicMedia } from '../utils/mediaUrl';

const PublicSiteContext = createContext(null);

export function PublicSiteProvider({ children }) {
  const [navigationFooter, setNavigationFooter] = useState(null);
  const [websiteSettings, setWebsiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);
  const inFlightRef = useRef(null);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) {
      return inFlightRef.current;
    }

    const requestId = ++requestIdRef.current;

    const promise = (async () => {
      try {
        const [navResponse, settingsResponse] = await Promise.all([
          getNavigationFooter(),
          getWebsiteSettings(),
        ]);

        if (requestId !== requestIdRef.current) return;

        setNavigationFooter(normalizePublicMedia(navResponse.data));
        setWebsiteSettings(normalizePublicMedia(settingsResponse.data));
        setError(null);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
        if (inFlightRef.current === promise) {
          inFlightRef.current = null;
        }
      }
    })();

    inFlightRef.current = promise;
    return promise;
  }, []);

  useEffect(() => {
    refresh();

    return () => {
      requestIdRef.current += 1;
      inFlightRef.current = null;
    };
  }, [refresh]);

  const value = useMemo(
    () => ({
      navigationFooter,
      websiteSettings,
      loading,
      error,
      refresh,
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
    [navigationFooter, websiteSettings, loading, error, refresh],
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
