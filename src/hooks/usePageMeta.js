import { useEffect } from 'react';

/**
 * Sets document title and optional meta description.
 * Structured for future SEO metadata expansion (Open Graph, canonical, etc.).
 */
export function usePageMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');
    const hadMeta = Boolean(metaDescription);
    const previousContent = metaDescription?.getAttribute('content') ?? '';

    if (description) {
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (description && metaDescription) {
        if (hadMeta) {
          metaDescription.setAttribute('content', previousContent);
        } else {
          metaDescription.remove();
        }
      }
    };
  }, [title, description]);
}
