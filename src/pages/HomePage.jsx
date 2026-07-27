import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Services from '../components/Services/Services';
import Projects from '../components/Projects/Projects';
import Footer from '../components/Footer/Footer';
import PublicPageSkeleton from '../components/Utility/PublicPageSkeleton';
import { getHome, getProjects, getServices } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { mapProject, mapService } from '../utils/contentMappers';
import { normalizePublicMedia } from '../utils/mediaUrl';
import styles from './HomePage.module.css';

const HOMEPAGE_PROJECT_COUNT = 3;

/** Fisher–Yates shuffle; returns up to `count` unique items. */
function pickRandomItems(items, count) {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

async function loadHomepage() {
  const [homeResult, servicesResult, projectsResult] = await Promise.allSettled([
    getHome(),
    getServices({ homepage: true }),
    getProjects(),
  ]);

  if (homeResult.status === 'rejected') {
    throw homeResult.reason;
  }

  const projectsResponse =
    projectsResult.status === 'fulfilled' ? projectsResult.value : null;
  const allPublished = projectsResponse?.data?.projects ?? [];
  // Randomize once per page load (inside the loader), not on React re-renders.
  const selectedProjects = pickRandomItems(allPublished, HOMEPAGE_PROJECT_COUNT);

  return {
    home: homeResult.value,
    services: servicesResult.status === 'fulfilled' ? servicesResult.value : null,
    projects: projectsResponse
      ? {
          ...projectsResponse,
          data: {
            ...projectsResponse.data,
            projects: selectedProjects,
          },
        }
      : null,
  };
}

export default function HomePage() {
  const { data, loading, error } = usePublicQuery(() => loadHomepage(), []);
  const home = data?.home?.data ? normalizePublicMedia(data.home.data) : undefined;
  const services = (data?.services?.data ?? []).map(mapService);
  const projects = (data?.projects?.data?.projects ?? []).map(mapProject);

  useSeoMeta('/', {
    title: 'ODEH & PARTNERS DESIGN',
    description:
      'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
  });

  if (loading) {
    return (
      <div className={styles.home}>
        <Navbar />
        <main>
          <PublicPageSkeleton variant="home" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !home) {
    return (
      <div className={styles.home}>
        <Navbar />
        <main className={styles.error}>Unable to load homepage content.</main>
        <Footer />
      </div>
    );
  }

  const servicesContent = {
    ...home.services,
    services,
  };

  const projectsContent = {
    ...home.projects,
    projects,
  };

  return (
    <div className={styles.home}>
      <Navbar />
      <main>
        <Hero content={home.hero} />
        <About content={home.about} />
        <Services content={servicesContent} />
        <Projects content={projectsContent} />
      </main>
      <Footer />
    </div>
  );
}
