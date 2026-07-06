import { useEffect, useMemo, useState } from 'react';
import { getStats } from '../../../../api/dashboard';
import * as jobsApi from '../../../../api/jobs';
import { fetchTotalCount } from '../../../../api/utils';

const KPI_DEFINITIONS = [
  {
    id: 'projects',
    label: 'Total Projects',
    helper: 'Across all categories',
    icon: 'projects',
    accent: 'teal',
    key: 'projects',
  },
  {
    id: 'categories',
    label: 'Categories',
    helper: 'Project groupings on /projects',
    icon: 'categories',
    accent: 'blue',
    key: 'categories',
  },
  {
    id: 'team',
    label: 'Team Members',
    helper: 'Profiles on About Team',
    icon: 'team',
    accent: 'purple',
    key: 'teamMembers',
  },
  {
    id: 'jobs',
    label: 'Open Jobs',
    helperKey: 'careers',
    helperPrefix: 'listings total',
    icon: 'careers',
    accent: 'amber',
    key: 'careers',
    openPositions: true,
  },
  {
    id: 'activities',
    label: 'Activities',
    helper: 'About Activities entries',
    icon: 'activities',
    accent: 'rose',
    key: 'activities',
  },
  {
    id: 'services',
    label: 'Services',
    helper: 'Home page service cards',
    icon: 'services',
    accent: 'teal',
    key: 'services',
  },
];

const OVERVIEW_DEFINITIONS = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio entries, galleries, and project metadata.',
    path: '/admin/projects',
    icon: 'projects',
    key: 'projects',
  },
  {
    id: 'team',
    title: 'Team Members',
    description: 'Profiles, roles, and bios on the Team page.',
    path: '/admin/team-members',
    icon: 'team',
    key: 'teamMembers',
  },
  {
    id: 'activities',
    title: 'Activities',
    description: 'Community programs shown on About Activities.',
    path: '/admin/activities',
    icon: 'activities',
    key: 'activities',
  },
  {
    id: 'careers',
    title: 'Careers',
    description: 'Job listings and open positions on /careers.',
    path: '/admin/careers',
    icon: 'careers',
    key: 'careers',
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Service cards and imagery on the Home page.',
    path: '/admin/services',
    icon: 'services',
    key: 'services',
  },
  {
    id: 'home',
    title: 'Home Page',
    description: 'Hero, services section, and featured projects.',
    path: '/admin/home-page',
    icon: 'home',
    key: 'services',
  },
];

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [openJobs, setOpenJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getStats(), fetchTotalCount(jobsApi.list, { status: 'open' })])
      .then(([response, openCount]) => {
        if (!cancelled) {
          setStats(response.data);
          setOpenJobs(openCount);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStats(null);
          setError('Unable to load dashboard statistics.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const kpiCards = useMemo(() => {
    if (!stats) return [];

    return KPI_DEFINITIONS.map((card) => ({
      id: card.id,
      label: card.label,
      value: card.openPositions ? openJobs : stats[card.key] ?? 0,
      helper: card.helper ?? `${stats[card.helperKey] ?? 0} ${card.helperPrefix}`,
      icon: card.icon,
      accent: card.accent,
    }));
  }, [stats, openJobs]);

  const contentOverviewCards = useMemo(() => {
    if (!stats) return [];

    return OVERVIEW_DEFINITIONS.map((card) => ({
      ...card,
      count: stats[card.key] ?? 0,
    }));
  }, [stats]);

  return {
    stats,
    kpiCards,
    contentOverviewCards,
    isLoading,
    error,
  };
}
