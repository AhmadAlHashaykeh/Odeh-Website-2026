import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import LoginPage from '../pages/LoginPage';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';
import ModulePermissionRoute from './ModulePermissionRoute';

/* Dashboard */
import DashboardPage from '../dashboard/pages/DashboardPage';

/* Content listing modules */
import ProjectsPage from '../projects/pages/ProjectsPage';
import CategoriesPage from '../project-categories/pages/CategoriesPage';
import TeamMembersPage from '../team-members/pages/TeamMembersPage';
import TeamCategoriesPage from '../team-categories/pages/TeamCategoriesPage';
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

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={(
              <ModulePermissionRoute moduleId="dashboard">
                <DashboardPage />
              </ModulePermissionRoute>
            )}
          />

          <Route
            path="projects"
            element={(
              <ModulePermissionRoute moduleId="projects">
                <ProjectsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="project-categories"
            element={(
              <ModulePermissionRoute moduleId="project-categories">
                <CategoriesPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="team-categories"
            element={(
              <ModulePermissionRoute moduleId="team-categories">
                <TeamCategoriesPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="team-members"
            element={(
              <ModulePermissionRoute moduleId="team-members">
                <TeamMembersPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="activities"
            element={(
              <ModulePermissionRoute moduleId="activities">
                <ActivitiesPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="services"
            element={(
              <ModulePermissionRoute moduleId="services">
                <ServicesPage />
              </ModulePermissionRoute>
            )}
          />

          <Route
            path="careers"
            element={(
              <ModulePermissionRoute moduleId="careers">
                <CareersPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="applications"
            element={(
              <ModulePermissionRoute moduleId="applications">
                <ApplicationsPage />
              </ModulePermissionRoute>
            )}
          />

          <Route
            path="contact-messages"
            element={(
              <ModulePermissionRoute moduleId="contact-messages">
                <ContactMessagesPage />
              </ModulePermissionRoute>
            )}
          />

          <Route
            path="home-page"
            element={(
              <ModulePermissionRoute moduleId="home-page">
                <HomePageCmsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="about-pages"
            element={(
              <ModulePermissionRoute moduleId="about-pages">
                <AboutPagesCmsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="navigation-footer"
            element={(
              <ModulePermissionRoute moduleId="navigation-footer">
                <NavigationFooterCmsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="connect-page"
            element={(
              <ModulePermissionRoute moduleId="connect-page">
                <ConnectPageCmsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="legal-pages"
            element={(
              <ModulePermissionRoute moduleId="legal-pages">
                <LegalPagesCmsPage />
              </ModulePermissionRoute>
            )}
          />

          <Route
            path="seo"
            element={(
              <ModulePermissionRoute moduleId="seo">
                <SeoManagementPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="website-settings"
            element={(
              <ModulePermissionRoute moduleId="website-settings">
                <WebsiteSettingsPage />
              </ModulePermissionRoute>
            )}
          />
          <Route
            path="users-roles"
            element={(
              <ModulePermissionRoute moduleId="users-roles">
                <UsersRolesPage />
              </ModulePermissionRoute>
            )}
          />
        </Route>
      </Route>
    </Routes>
  );
}
