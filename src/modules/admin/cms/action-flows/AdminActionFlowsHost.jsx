import {
  AdminFormDrawer,
  AdminGalleryDrawer,
  AdminLinkedItemsDrawer,
  ConfirmActionModal,
  ActionFeedback,
} from './index';
import { getItemLabel } from './mapItemToForm';

export default function AdminActionFlowsHost({
  moduleKey,
  flows,
  showGallery = false,
  showLinked = false,
  linkedItemsKey = 'projectPreviews',
  linkedTitle = 'Manage Projects',
}) {
  const galleryItem = flows.galleryDrawer.item;
  const linkedItem = flows.linkedDrawer.item;

  return (
    <>
      <AdminFormDrawer
        open={flows.formDrawer.open}
        onClose={flows.closeFormDrawer}
        moduleKey={moduleKey}
        mode={flows.formDrawer.mode}
        item={flows.formDrawer.item}
        onSave={flows.handleFormSave}
      />

      {showGallery && (
        <AdminGalleryDrawer
          open={flows.galleryDrawer.open}
          onClose={flows.closeGalleryDrawer}
          coverImage={galleryItem?.coverImage}
          gallery={galleryItem?.gallery}
          itemLabel={getItemLabel(moduleKey, galleryItem)}
          onSave={flows.handleGallerySave}
        />
      )}

      {showLinked && (
        <AdminLinkedItemsDrawer
          open={flows.linkedDrawer.open}
          onClose={flows.closeLinkedDrawer}
          title={linkedTitle}
          subtitle={linkedItem ? `Projects assigned to "${linkedItem.title}"` : undefined}
          items={linkedItem?.[linkedItemsKey] || []}
          emptyMessage="No projects linked to this category"
        />
      )}

      <ConfirmActionModal
        open={flows.confirm.open}
        title={flows.confirm.title}
        message={flows.confirm.message}
        confirmLabel={flows.confirm.confirmLabel}
        variant={flows.confirm.variant}
        icon={flows.confirm.icon}
        onConfirm={flows.handleConfirm}
        onCancel={flows.closeConfirm}
      />

      <ActionFeedback
        open={flows.feedback.open}
        message={flows.feedback.message}
        type={flows.feedback.type}
        onClose={flows.hideFeedback}
      />
    </>
  );
}
