export function runSeoAudit(page) {
  const checks = [];

  if (page.metaTitle?.trim()) {
    checks.push({ id: 'meta-title', status: 'pass', label: 'Meta title exists' });
    if (page.metaTitle.length > 60) {
      checks.push({
        id: 'meta-title-long',
        status: 'warn',
        label: 'Meta title may be too long',
      });
    }
  } else {
    checks.push({ id: 'meta-title', status: 'fail', label: 'Missing meta title' });
  }

  if (page.metaDescription?.trim()) {
    checks.push({ id: 'meta-description', status: 'pass', label: 'Meta description exists' });
    const length = page.metaDescription.length;
    if (length < 70) {
      checks.push({
        id: 'meta-desc-short',
        status: 'warn',
        label: 'Meta description too short',
      });
    } else if (length > 160) {
      checks.push({
        id: 'meta-desc-long',
        status: 'warn',
        label: 'Meta description may be too long',
      });
    }
  } else {
    checks.push({ id: 'meta-description', status: 'fail', label: 'Missing meta description' });
  }

  checks.push({
    id: 'og-image',
    status: page.ogImage ? 'pass' : 'warn',
    label: page.ogImage ? 'Open Graph image present' : 'Missing OG image',
  });

  checks.push({
    id: 'canonical',
    status: page.canonical ? 'pass' : 'warn',
    label: page.canonical ? 'Canonical present' : 'Missing canonical URL',
  });

  checks.push({
    id: 'robots-index',
    status: page.robotsIndex != null ? 'pass' : 'warn',
    label:
      page.robotsIndex != null
        ? 'Robots index directive configured'
        : 'Robots index directive not configured',
  });

  checks.push({
    id: 'robots-follow',
    status: page.robotsFollow != null ? 'pass' : 'warn',
    label:
      page.robotsFollow != null
        ? 'Robots follow directive configured'
        : 'Robots follow directive not configured',
  });

  checks.push({
    id: 'sitemap',
    status: page.sitemapIncluded != null ? 'pass' : 'warn',
    label: page.sitemapIncluded != null ? 'Sitemap entry configured' : 'Sitemap not configured',
  });

  return checks;
}

export function computeSeoScore(auditChecks) {
  let score = 100;

  auditChecks.forEach((check) => {
    if (check.status === 'fail') score -= 20;
    if (check.status === 'warn') score -= 8;
  });

  return Math.max(0, Math.min(100, score));
}

export function hasSeoWarnings(auditChecks) {
  return auditChecks.some((check) => check.status === 'fail' || check.status === 'warn');
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs work';
  return 'Critical';
}

export function getScoreTone(score) {
  if (score >= 85) return 'success';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warning';
  return 'error';
}
