import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BackToTop from './components/BackToTop/BackToTop';
import AdminRoutes from './modules/admin/routes/AdminRoutes';
import HomePage from './pages/HomePage';
import AboutOverviewPage from './pages/AboutOverviewPage';
import AboutApproachPage from './pages/AboutApproachPage';
import AboutHistoryPage from './pages/AboutHistoryPage';
import AboutTeamPage from './pages/AboutTeamPage';
import AboutActivitiesPage from './pages/AboutActivitiesPage';
import AboutActivityDetailPage from './pages/AboutActivityDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectCategoryPage from './pages/ProjectCategoryPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import JobApplicationPage from './pages/JobApplicationPage';
import JobApplicationThankYouPage from './pages/JobApplicationThankYouPage';
import ReachOutPage from './pages/ReachOutPage';
import SearchPage from './pages/SearchPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ThankYouPage from './pages/ThankYouPage';
import ConnectPage from './pages/ConnectPage';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFoundPage from './pages/NotFoundPage';
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about/overview" element={<AboutOverviewPage />} />
        <Route path="/about/approach" element={<AboutApproachPage />} />
        <Route path="/about/history" element={<AboutHistoryPage />} />
        <Route path="/about/team-members" element={<AboutTeamPage />} />
        <Route path="/about/activities" element={<AboutActivitiesPage />} />
        <Route path="/about/activities/:slug" element={<AboutActivityDetailPage />} />
        <Route path="/about/:section" element={<PlaceholderPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:category" element={<ProjectCategoryPage />} />
        <Route path="/projects/:category/:project" element={<ProjectDetailPage />} />
        <Route path="/services/:slug" element={<PlaceholderPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:slug/apply/thank-you" element={<JobApplicationThankYouPage />} />
        <Route path="/careers/:slug/apply" element={<JobApplicationPage />} />
        <Route path="/careers/:slug" element={<JobDetailPage />} />
        <Route path="/reach-out" element={<ReachOutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isAdmin && <BackToTop />}
    </>
  );
}

export default App;
