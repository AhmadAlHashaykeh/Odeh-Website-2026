import { AboutPageShell } from '../components/AboutSection';
import { OverviewHero } from '../components/AboutOverview';
import { HistoryStory, HistoryCounters, HistoryDataTable } from '../components/AboutHistory';
import { historyContent } from '../data/historyContent';

export default function AboutHistoryPage() {
  const { meta, hero, story, counters, growthTable } = historyContent;

  return (
    <AboutPageShell meta={meta}>
      <OverviewHero {...hero} />
      <HistoryStory {...story} />
      <HistoryCounters {...counters} />
      <HistoryDataTable {...growthTable} />
    </AboutPageShell>
  );
}
