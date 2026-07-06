import { Navigate, useParams } from 'react-router-dom';
import { AboutPageShell } from '../components/AboutSection';
import {
  ActivityDetailHero,
  ActivityGallerySlider,
  ActivityNavigation,
  RelatedActivities,
} from '../components/AboutActivities';
import PageLoader from '../components/Utility/PageLoader';
import { getActivity } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import { mapActivity } from '../utils/contentMappers';

export default function AboutActivityDetailPage() {
  const { slug } = useParams();
  const { data, loading, error } = usePublicQuery(() => getActivity(slug), [slug]);

  if (loading) {
    return (
      <AboutPageShell meta={{ title: 'Activity | ODEH & PARTNERS DESIGN' }}>
        <PageLoader />
      </AboutPageShell>
    );
  }

  const activity = data?.data?.activity ? mapActivity(data.data.activity) : null;

  if (error || !activity) {
    return <Navigate to="/about/activities" replace />;
  }

  const { prev, next } = data.data.navigation ?? {};
  const related = (data.data.related ?? []).map(mapActivity);
  const heroImage = activity.gallery?.[0]?.src ?? activity.coverImage;

  const meta = {
    title: `${activity.title} | Activities | ODEH & PARTNERS DESIGN`,
    description: `${activity.title} — ${activity.date}. Visual memories from ODEH & PARTNERS DESIGN.`,
  };

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about/overview' },
    { label: 'Activities', path: '/about/activities' },
    { label: activity.title },
  ];

  return (
    <AboutPageShell meta={meta}>
      <ActivityDetailHero
        title={activity.title}
        date={activity.date}
        heroImage={heroImage}
        breadcrumbs={breadcrumbs}
        ariaLabel={activity.title}
      />
      <ActivityGallerySlider gallery={activity.gallery} activityTitle={activity.title} />
      <ActivityNavigation prev={prev} next={next} />
      <RelatedActivities activities={related} />
    </AboutPageShell>
  );
}
