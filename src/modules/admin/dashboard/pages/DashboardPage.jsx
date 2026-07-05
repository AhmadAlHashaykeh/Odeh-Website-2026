import { usePageMeta } from '../../../../hooks/usePageMeta';
import WelcomeHero from '../components/WelcomeHero';
import KpiCards from '../components/KpiCards';
import ContentOverview from '../components/ContentOverview';
import QuickActions from '../components/QuickActions';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  usePageMeta({
    title: 'Dashboard — ODEH Admin',
    description: 'ODEH Website CMS administration dashboard.',
  });

  return (
    <div className={styles.page}>
      <WelcomeHero />
      <KpiCards />
      <ContentOverview />
      <QuickActions />
    </div>
  );
}
