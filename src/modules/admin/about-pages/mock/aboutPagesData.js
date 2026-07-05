/**
 * Mock About Pages CMS data derived from public website source files.
 * overviewContent.js, approachContent.js, historyContent.js,
 * teamContent.js, activitiesContent.js
 */

import { overviewContent } from '../../../../data/overviewContent';
import { approachContent } from '../../../../data/approachContent';
import { historyContent } from '../../../../data/historyContent';

export const aboutPagesLastUpdated = '2026-03-10';

export const initialOverviewData = {
  meta: structuredClone(overviewContent.meta),
  hero: structuredClone(overviewContent.hero),
  content: structuredClone(overviewContent.content),
  slider: structuredClone(overviewContent.slider),
};

export const initialApproachData = {
  meta: structuredClone(approachContent.meta),
  hero: structuredClone(approachContent.hero),
  principles: structuredClone(approachContent.principles),
};

export const initialHistoryData = {
  meta: structuredClone(historyContent.meta),
  hero: structuredClone(historyContent.hero),
  story: structuredClone(historyContent.story),
  counters: structuredClone(historyContent.counters),
  growthTable: structuredClone(historyContent.growthTable),
};

export const initialAboutPagesData = {
  overview: initialOverviewData,
  approach: initialApproachData,
  history: initialHistoryData,
};
