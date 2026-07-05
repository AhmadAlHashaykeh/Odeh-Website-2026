import { AboutPageShell } from '../components/AboutSection';
import { ReachOutHero, ContactSection, OfficeMap } from '../components/ReachOut';
import { reachOutContent } from '../data/reachOutContent';

export default function ReachOutPage() {
  const { meta, hero, form, map } = reachOutContent;

  return (
    <AboutPageShell meta={meta}>
      <ReachOutHero {...hero} />
      <ContactSection form={form} />
      <OfficeMap {...map} />
    </AboutPageShell>
  );
}
