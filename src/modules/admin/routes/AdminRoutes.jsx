import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import LoginPage from '../pages/LoginPage';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

/* Dashboard */
import DashboardPage from '../dashboard/pages/DashboardPage';

/* Content listing modules */
import ProjectsPage from '../projects/pages/ProjectsPage';
import CategoriesPage from '../project-categories/pages/CategoriesPage';
import TeamMembersPage from '../team-members/pages/TeamMembersPage';
import ActivitiesPage from '../activities/pages/ActivitiesPage';
import ServicesPage from '../services/pages/ServicesPage';

/* Recruitment */
import CareersPage from '../careers/pages/CareersPage';
import ApplicationsPage from '../applications/pages/ApplicationsPage';

/* Communication */
import ContactMessagesPage from '../contact-messages/pages/ContactMessagesPage';

/* Website CMS editors */
import HomePageCmsPage from '../home-page/pages/HomePageCmsPage';
import AboutPagesCmsPage from '../about-pages/pages/AboutPagesCmsPage';
import NavigationFooterCmsPage from '../navigation-footer/pages/NavigationFooterCmsPage';
import ConnectPageCmsPage from '../connect-page/pages/ConnectPageCmsPage';
import LegalPagesCmsPage from '../legal-pages/pages/LegalPagesCmsPage';

/* Settings */
import SeoManagementPage from '../seo/pages/SeoManagementPage';
import WebsiteSettingsPage from '../website-settings/pages/WebsiteSettingsPage';
import UsersRolesPage from '../users-roles/pages/UsersRolesPage';

/* Dev preview */
import ListingPreviewPage from '../cms/pages/ListingPreviewPage';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Content */}
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="project-categories" element={<CategoriesPage />} />
        <Route path="team-members" element={<TeamMembersPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="services" element={<ServicesPage />} />

        {/* Recruitment */}
        <Route path="careers" element={<CareersPage />} />
        <Route path="applications" element={<ApplicationsPage />} />

        {/* Communication */}
        <Route path="contact-messages" element={<ContactMessagesPage />} />

        {/* Website CMS */}
        <Route path="home-page" element={<HomePageCmsPage />} />
        <Route path="about-pages" element={<AboutPagesCmsPage />} />
        <Route path="navigation-footer" element={<NavigationFooterCmsPage />} />
        <Route path="connect-page" element={<ConnectPageCmsPage />} />
        <Route path="legal-pages" element={<LegalPagesCmsPage />} />

        {/* Settings */}
        <Route path="seo" element={<SeoManagementPage />} />
        <Route path="website-settings" element={<WebsiteSettingsPage />} />
        <Route path="users-roles" element={<UsersRolesPage />} />

        {/* Dev preview — not in sidebar nav */}
        <Route path="cms-preview" element={<ListingPreviewPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
