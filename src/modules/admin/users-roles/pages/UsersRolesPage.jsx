import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import AboutSectionNav from '../../about-pages/components/AboutSectionNav';
import { useUsersRoles } from '../hooks/useUsersRoles';
import { usersRolesMeta, usersRolesSectionNav } from '../mock/usersRolesConfig';
import { useModulePermissions } from '../../hooks/useModulePermissions';
import UsersRolesSectionContent from '../components/UsersRolesSectionContent';
import UsersRolesSkeleton from '../components/UsersRolesSkeleton';
import UserDetailsDrawer from '../components/UserDetailsDrawer';
import UserInviteModal from '../components/UserInviteModal';
import UserEditModal from '../components/UserEditModal';
import RoleEditModal from '../components/RoleEditModal';
import styles from './UsersRolesPage.module.css';

export default function UsersRolesPage() {
  const cms = useUsersRoles();
  const { canCreate, canEdit, canDelete } = useModulePermissions('users-roles');

  useAdminBreadcrumbs(usersRolesMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${usersRolesMeta.title} — ODEH Admin`,
    description: usersRolesMeta.description,
  });

  const secondaryActions = usersRolesMeta.secondaryActions.map((action) => ({
    ...action,
    onClick: cms.saveDraft,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={usersRolesMeta.title}
        description={usersRolesMeta.description}
        breadcrumbs={usersRolesMeta.breadcrumbs}
        primaryAction={
          canCreate
            ? { ...usersRolesMeta.primaryAction, onClick: cms.openInvite }
            : undefined
        }
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <UsersRolesSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.layout}>
            <AboutSectionNav
              sections={usersRolesSectionNav}
              activeSection={cms.activeSection}
              onSelect={cms.setActiveSection}
              ariaLabel="Users and roles sections"
            />

            <div className={styles.mainArea}>
              <UsersRolesSectionContent
                activeSection={cms.activeSection}
                users={cms.users}
                roles={cms.roles}
                allRoles={cms.allRoles}
                viewMode={cms.viewMode}
                setViewMode={cms.setViewMode}
                searchQuery={cms.searchQuery}
                setSearchQuery={cms.setSearchQuery}
                statusFilter={cms.statusFilter}
                setStatusFilter={cms.setStatusFilter}
                roleFilter={cms.roleFilter}
                setRoleFilter={cms.setRoleFilter}
                sortBy={cms.sortBy}
                setSortBy={cms.setSortBy}
                selectedUserIds={cms.selectedUserIds}
                toggleUserSelect={cms.toggleUserSelect}
                toggleSelectAllUsers={cms.toggleSelectAllUsers}
                clearUserSelection={cms.clearUserSelection}
                isAllUsersSelected={cms.isAllUsersSelected}
                isSomeUsersSelected={cms.isSomeUsersSelected}
                onUserClick={cms.openUserView}
                onViewUser={cms.openUserView}
                onUserAction={cms.handleUserAction}
                onRoleAction={cms.handleRoleAction}
                onRoleEdit={cms.openRoleEdit}
                onAddRole={cms.openRoleCreate}
                onBulkAction={undefined}
                simulateRefresh={cms.simulateRefresh}
                isLoading={cms.isLoading}
                matrixRole={cms.matrixRole}
                matrixRoleId={cms.matrixRoleId}
                setMatrixRoleId={cms.setMatrixRoleId}
                roleOptions={cms.roleOptions}
                canEdit={canEdit}
                onSavePermissions={cms.savePermissions}
                isSavingPermissions={cms.isSavingPermissions}
              />
            </div>
          </div>
        </div>
      )}

      <UserDetailsDrawer
        user={cms.viewingUser}
        roles={cms.allRoles}
        onClose={cms.closeUserView}
      />

      <UserInviteModal
        open={cms.inviteModalOpen}
        onClose={cms.closeInvite}
        onSave={cms.saveInvite}
        roleOptions={cms.roleOptions}
      />

      <UserEditModal
        open={Boolean(cms.editingUser)}
        user={cms.editingUser}
        onClose={cms.closeUserEdit}
        onSave={cms.saveUserEdit}
        roleOptions={cms.roleOptions}
      />

      <RoleEditModal
        key={`${cms.roleModalMode}-${cms.editingRole?.id ?? 'new'}`}
        open={cms.roleModalOpen}
        mode={cms.roleModalMode}
        role={cms.editingRole}
        onClose={cms.closeRoleModal}
        onSave={cms.saveRoleEdit}
      />

      <ActionFeedback
        open={cms.feedback.open}
        message={cms.feedback.message}
        type={cms.feedback.type}
        onClose={cms.closeFeedback}
      />
    </div>
  );
}
