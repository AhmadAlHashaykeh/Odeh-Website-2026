import { resolveMediaPath } from '../../../../utils/mediaUrl';

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 'Yes' || value === 'true' || value === '1') return true;
  if (value === 'No' || value === 'false' || value === '0') return false;
  return undefined;
}

function parseNumber(value) {
  if (value === '' || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function parseLines(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function omitEmpty(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  );
}

function parseGallery(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function mapFormValuesToApi(moduleKey, values, context = {}) {
  switch (moduleKey) {
    case 'categories':
      return omitEmpty({
        title: values.title,
        description: values.description,
        status: values.status === 'hidden' ? 'draft' : values.status,
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'projects': {
      const categoryRecord = (context.categories || []).find(
        (category) =>
          category.id === values.category ||
          category.title === values.category ||
          category.slug === values.category,
      );

      return omitEmpty({
        title: values.title,
        projectCategoryId: categoryRecord?.id,
        location: values.location,
        architect: values.architect,
        area: values.area,
        coverImage: values.coverImage,
        gallery: parseGallery(values.gallery),
        status: values.status,
      });
    }

    case 'services':
      return omitEmpty({
        title: values.title,
        description: values.description,
        image: values.image,
        icon: values.icon,
        usedOnHomepage: parseBoolean(values.usedOnHomepage),
        displayOrder: parseNumber(values.displayOrder),
        status: values.status === 'hidden' ? 'hidden' : values.status,
      });

    case 'activities':
      return omitEmpty({
        title: values.title,
        activityDate: values.activityDate,
        location: values.location,
        description: values.description,
        coverImage: values.coverImage,
        gallery: parseGallery(values.gallery),
        status: values.status,
        featured: parseBoolean(values.featured),
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'team-members':
      return omitEmpty({
        fullName: values.fullName,
        position: values.position,
        teamCategoryId: values.teamCategoryId,
        teamRankId: values.teamRankId,
        experience: values.experience,
        email: values.email,
        linkedinUrl: values.linkedinUrl,
        photo: values.photo,
        status: values.status,
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'team-categories':
      return omitEmpty({
        name: values.name,
        slug: values.slug,
        description: values.description,
        borderColor: values.borderColor,
        icon: values.icon,
        parentId: values.parentId || null,
        isActive: values.status ? values.status === 'active' : undefined,
        displayOrder: parseNumber(values.displayOrder),
      });

    case 'careers':
      return omitEmpty({
        title: values.title,
        slug: values.slug,
        department: values.department,
        location: values.location,
        employmentType: values.employmentType,
        workMode: values.workMode,
        experienceLevel: values.experienceLevel,
        postedDate: values.postedDate,
        closingDate: values.closingDate,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        responsibilities: parseLines(values.responsibilities),
        requirements: parseLines(values.requirements),
        benefits: parseLines(values.benefits),
        status: values.status,
      });

    default:
      return values;
  }
}

/** Map homepage section form fields (kebab-case) onto the API camelCase section shape. */
export function mapHomeSectionFromForm(sectionId, currentSection, values) {
  if (!currentSection || !values || Object.keys(values).length === 0) {
    return currentSection;
  }

  switch (sectionId) {
    case 'hero':
      return {
        ...currentSection,
        badge: values['hero-badge'] ?? currentSection.badge,
        headingMain: values['hero-heading-main'] ?? currentSection.headingMain,
        headingAccent: values['hero-heading-accent'] ?? currentSection.headingAccent,
        description: values['hero-description'] ?? currentSection.description,
        stats: (currentSection.stats ?? []).map((stat, index) => ({
          value: values[`hero-stat-value-${index}`] ?? stat.value,
          label: values[`hero-stat-label-${index}`] ?? stat.label,
        })),
        primaryCta: {
          ...currentSection.primaryCta,
          label: values['hero-primary-label'] ?? currentSection.primaryCta?.label,
          path: values['hero-primary-path'] ?? currentSection.primaryCta?.path,
        },
        secondaryCta: {
          ...currentSection.secondaryCta,
          label: values['hero-secondary-label'] ?? currentSection.secondaryCta?.label,
          path: values['hero-secondary-path'] ?? currentSection.secondaryCta?.path,
        },
        posterImage: values.posterImage ?? currentSection.posterImage,
        videoSrc: values['hero-video'] ?? currentSection.videoSrc,
      };

    case 'about':
      return {
        ...currentSection,
        sectionLabel: values['about-label'] ?? currentSection.sectionLabel,
        titleMain: values['about-title-main'] ?? currentSection.titleMain,
        titleAccent: values['about-title-accent'] ?? currentSection.titleAccent,
        body: values['about-body'] ?? currentSection.body,
        stats: (() => {
          const existing = currentSection.stats ?? [];
          const count = Math.max(existing.length, 2);
          return Array.from({ length: count }, (_, index) => ({
            value: values[`about-stat-value-${index}`] ?? existing[index]?.value ?? '',
            label: values[`about-stat-label-${index}`] ?? existing[index]?.label ?? '',
          }));
        })(),
        image: values['about-image'] ?? currentSection.image,
        imageAlt: values['about-image-alt'] ?? currentSection.imageAlt,
        readMoreLabel: values['about-readmore-label'] ?? currentSection.readMoreLabel,
        readMorePath: values['about-readmore-path'] ?? currentSection.readMorePath,
      };

    case 'services':
      return {
        ...currentSection,
        sectionLabel: values['services-label'] ?? currentSection.sectionLabel,
        heading: values['services-heading'] ?? currentSection.heading,
        description: values['services-description'] ?? currentSection.description,
      };

    case 'projects': {
      let poolProjectIds = Array.isArray(currentSection.poolProjectIds)
        ? currentSection.poolProjectIds
        : [];
      let projects = Array.isArray(currentSection.projects) ? currentSection.projects : [];

      if (typeof values['projects-pool'] === 'string' && values['projects-pool'].trim()) {
        try {
          const parsed = JSON.parse(values['projects-pool']);
          if (Array.isArray(parsed?.ids)) {
            poolProjectIds = parsed.ids.filter((id) => typeof id === 'string' && id);
          }
          if (Array.isArray(parsed?.previews)) {
            projects = parsed.previews;
          }
        } catch {
          // Keep existing pool when JSON is invalid.
        }
      }

      return {
        ...currentSection,
        sectionLabel: values['projects-label'] ?? currentSection.sectionLabel,
        heading: values['projects-heading'] ?? currentSection.heading,
        description: values['projects-description'] ?? currentSection.description,
        viewAllLabel: values['projects-viewall-label'] ?? currentSection.viewAllLabel,
        viewAllPath: values['projects-viewall-path'] ?? currentSection.viewAllPath,
        poolProjectIds,
        projects,
      };
    }

    default:
      return currentSection;
  }
}

/** Map About CMS panel form fields onto the nested API panel shape. */
export function mapAboutPanelFromForm(panelId, currentPanel, values) {
  if (!currentPanel || !values || Object.keys(values).length === 0) {
    return currentPanel;
  }

  if (
    panelId === 'overview-hero' ||
    panelId === 'approach-hero' ||
    panelId === 'history-hero' ||
    panelId === 'team-hero' ||
    panelId === 'activities-hero'
  ) {
    const nextPanel = {
      ...currentPanel,
      label: values['hero-label'] ?? currentPanel.label,
      title: values['hero-title'] ?? currentPanel.title,
      description: values['hero-description'] ?? currentPanel.description,
      backgroundImage: resolveMediaPath(
        values.backgroundImage ?? values['hero-bg'] ?? currentPanel.backgroundImage,
      ),
    };

    if (panelId === 'team-hero' || Object.prototype.hasOwnProperty.call(currentPanel, 'subtitle')) {
      nextPanel.subtitle = values['hero-subtitle'] ?? currentPanel.subtitle;
    }

    return nextPanel;
  }

  if (panelId === 'team-meta' || panelId === 'activities-meta') {
    return {
      ...currentPanel,
      title: values['meta-title'] ?? currentPanel.title,
      description: values['meta-description'] ?? currentPanel.description,
    };
  }

  if (panelId === 'overview-intro') {
    return {
      ...currentPanel,
      title: values['intro-title'] ?? currentPanel.title,
      description: values['intro-description'] ?? currentPanel.description,
      image: {
        ...currentPanel.image,
        src: values['intro-image-src'] ?? currentPanel.image?.src,
        alt: values['intro-image-alt'] ?? currentPanel.image?.alt,
      },
    };
  }

  if (panelId === 'overview-gallery') {
    let images = currentPanel.images;

    if (typeof values['gallery-images'] === 'string') {
      try {
        const parsed = JSON.parse(values['gallery-images']);
        if (Array.isArray(parsed)) {
          images = parsed;
        }
      } catch {
        // Keep existing gallery images when JSON is invalid.
      }
    }

    return {
      ...currentPanel,
      label: values['gallery-label'] ?? currentPanel.label,
      description: values['gallery-description'] ?? currentPanel.description,
      images,
    };
  }

  if (panelId === 'approach-principles') {
    return {
      ...currentPanel,
      label: values['principles-label'] ?? currentPanel.label,
      items: (currentPanel.items ?? []).map((item) => ({
        ...item,
        title: values[`principle-title-${item.number}`] ?? item.title,
        description: values[`principle-desc-${item.number}`] ?? item.description,
      })),
    };
  }

  if (panelId === 'history-story') {
    return {
      ...currentPanel,
      label: values['story-label'] ?? currentPanel.label,
      lead: values['story-lead'] ?? currentPanel.lead,
      title: values['story-title'] ?? currentPanel.title,
      body: values['story-body'] ?? currentPanel.body,
    };
  }

  if (panelId === 'history-counters') {
    return {
      ...currentPanel,
      items: (currentPanel.items ?? []).map((item, index) => ({
        ...item,
        value: values[`counter-value-${index}`] ?? item.value,
        label: values[`counter-label-${index}`] ?? item.label,
      })),
    };
  }

  if (panelId === 'history-growth') {
    return {
      ...currentPanel,
      label: values['growth-label'] ?? currentPanel.label,
      title: values['growth-title'] ?? currentPanel.title,
      rows: (currentPanel.rows ?? []).map((row, index) => ({
        ...row,
        year: parseNumber(values[`growth-year-${index}`]) ?? row.year,
        projects: parseNumber(values[`growth-projects-${index}`]) ?? row.projects,
        area: parseNumber(values[`growth-area-${index}`]) ?? row.area,
      })),
    };
  }

  return currentPanel;
}

/** Map Connect page header form fields onto hero (does not pollute meta). */
export function mapConnectHeaderFromForm(cmsData, values) {
  return {
    hero: {
      ...cmsData.hero,
      description: values['hero-description'] ?? cmsData.hero?.description,
    },
  };
}

/** Map Connect link form fields onto a single link object. */
export function mapConnectLinkFromForm(link, values) {
  if (!link || !values || Object.keys(values).length === 0) {
    return link;
  }

  return {
    ...link,
    title: values['link-title'] ?? link.title,
    subtitle: values['link-subtitle'] ?? link.subtitle,
    url: values['link-url'] ?? link.url,
    icon: values['link-icon'] ?? link.icon,
    order: parseNumber(values['link-order']) ?? link.order,
    external: parseBoolean(values['link-external']) ?? link.external,
    enabled: parseBoolean(values['link-enabled']) ?? link.enabled,
  };
}

/** Map Legal page form fields onto the admin update payload (API contract). */
export function mapLegalPageFromForm(page, values) {
  if (!page) return page;

  if (!values || Object.keys(values).length === 0) {
    return {
      title: page.title,
      hero: page.hero,
      body: page.body,
      publicationStatus: page.publicationStatus,
    };
  }

  const body = { ...(page.body ?? {}) };

  for (const section of page.sections ?? []) {
    const paragraphs = page.body?.[section.id] ?? [];
    body[section.id] = paragraphs.map(
      (text, index) => values[`${section.id}-p-${index}`] ?? text,
    );

    const listKey = `${section.id}-list`;
    const listItems = page.body?.[listKey];
    if (Array.isArray(listItems)) {
      body[listKey] = listItems.map(
        (item, index) => values[`${section.id}-l-${index}`] ?? item,
      );
    }
  }

  return {
    title: values['page-title'] ?? page.title,
    hero: {
      ...page.hero,
      label: values['hero-label'] ?? page.hero?.label,
      title: values['hero-title'] ?? page.hero?.title,
      description: values['hero-description'] ?? page.hero?.description,
    },
    body,
    publicationStatus: values['publication-status'] ?? page.publicationStatus,
  };
}

/** Map Navigation & Footer panel form fields onto the singleton CMS payload. */
export function mapNavigationFooterFromForm(panelId, cmsData, values, editingNavItemId = null) {
  if (!cmsData) return cmsData;

  const nextData = { ...cmsData };

  if (panelId === 'nav-menu' && editingNavItemId) {
    nextData.navigationItems = (nextData.navigationItems ?? []).map((item) => {
      if (item.id !== editingNavItemId) return item;

      const updated = {
        ...item,
        label: values['nav-label'] ?? item.label,
        path: values['nav-path'] ?? item.path,
        status: values['nav-status'] ?? item.status,
      };

      if (item.hasDropdown && Array.isArray(item.dropdown)) {
        updated.dropdown = item.dropdown.map((sub, index) => ({
          ...sub,
          label: values[`dropdown-label-${index}`] ?? sub.label,
          path: values[`dropdown-path-${index}`] ?? sub.path,
          description: values[`dropdown-desc-${index}`] ?? sub.description,
        }));
      }

      return updated;
    });

    return nextData;
  }

  switch (panelId) {
    case 'nav-logo':
      nextData.logo = {
        ...nextData.logo,
        src: values.src || values['logo-src'] || nextData.logo?.src,
        alt: values['logo-alt'] || nextData.logo?.alt,
      };
      break;

    case 'footer-brand':
      nextData.footerBrand = {
        ...nextData.footerBrand,
        text: values['footer-brand-text'] ?? nextData.footerBrand?.text,
        logo: {
          ...nextData.footerBrand?.logo,
          src: values['footer-logo-src'] || nextData.footerBrand?.logo?.src,
          alt: nextData.footerBrand?.logo?.alt,
        },
      };
      break;

    case 'footer-nav-get-started':
    case 'footer-nav-about': {
      const groupTitle = panelId === 'footer-nav-get-started' ? 'Get Started' : 'About Us';
      nextData.footerNavGroups = (nextData.footerNavGroups ?? []).map((group) => {
        if (group.title !== groupTitle) return group;
        return {
          ...group,
          links: (group.links ?? []).map((link, index) => ({
            ...link,
            label: values[`footer-link-label-${index}`] ?? link.label,
            path: values[`footer-link-path-${index}`] ?? link.path,
          })),
        };
      });
      break;
    }

    case 'footer-reach-us':
      nextData.contact = {
        ...nextData.contact,
        location: values['footer-location'] ?? nextData.contact?.location,
        contacts: (nextData.contact?.contacts ?? []).map((contact, index) => ({
          ...contact,
          email: values[`footer-email-${index}`] ?? contact.email,
          phone: values[`footer-phone-${index}`] ?? contact.phone,
        })),
      };
      break;

    case 'footer-copyright':
      nextData.copyright = {
        ...nextData.copyright,
        companyName: values['copyright-company'] ?? nextData.copyright?.companyName,
      };
      break;

    case 'contact-office':
      nextData.contact = {
        ...nextData.contact,
        officeName: values['office-name'] ?? nextData.contact?.officeName,
        location: values['office-location'] ?? nextData.contact?.location,
        workingHours: {
          ...nextData.contact?.workingHours,
          days: values['office-days'] ?? nextData.contact?.workingHours?.days,
          hours: values['office-hours'] ?? nextData.contact?.workingHours?.hours,
        },
      };
      break;

    case 'contact-direct':
      nextData.contact = {
        ...nextData.contact,
        contacts: (nextData.contact?.contacts ?? []).map((contact, index) => ({
          ...contact,
          email: values[`contact-email-${index}`] ?? contact.email,
          phone: values[`contact-phone-${index}`] ?? contact.phone,
        })),
      };
      break;

    default:
      if (panelId?.startsWith('social-')) {
        const icon = panelId.slice('social-'.length);
        nextData.socialLinks = (nextData.socialLinks ?? []).map((link) => {
          if (link.icon !== icon) return link;
          return {
            ...link,
            label: values['social-label'] ?? link.label,
            href: values['social-href'] ?? link.href,
          };
        });
      }
      break;
  }

  return nextData;
}

export function extractFormValues(formElement) {
  if (!formElement) {
    return {};
  }

  const formData = new FormData(formElement);
  const values = {};

  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }

  return values;
}
