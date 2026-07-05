import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Input } from '../../ui';
import { getEditableSettingTitle } from '../mock/websiteSettingsConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';

function GeneralIdentityForm({ data }) {
  return (
    <Form.Section title="Site Identity">
      <Form.Field label="Website Name" htmlFor="ws-website-name">
        <Input.Field>
          <input
            id="ws-website-name"
            name="websiteName"
            type="text"
            className={inputStyles.input}
            defaultValue={data.general.websiteName}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Website Description" htmlFor="ws-website-desc">
        <Input.Field>
          <textarea
            id="ws-website-desc"
            name="websiteDescription"
            className={`${inputStyles.input} ${inputStyles.textarea}`}
            defaultValue={data.general.websiteDescription}
            rows={3}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Default Language" htmlFor="ws-default-lang">
        <Input.Field>
          <input
            id="ws-default-lang"
            name="defaultLanguage"
            type="text"
            className={inputStyles.input}
            defaultValue={data.general.defaultLanguage}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function FaviconForm({ data }) {
  return (
    <Form.Section title="Favicon">
      <Form.Field label="Favicon Path" htmlFor="ws-favicon-src">
        <Input.Field>
          <input
            id="ws-favicon-src"
            name="faviconSrc"
            type="text"
            className={inputStyles.input}
            defaultValue={data.branding.favicon.src}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Type" htmlFor="ws-favicon-type">
        <Input.Field>
          <input
            id="ws-favicon-type"
            name="faviconType"
            type="text"
            className={inputStyles.input}
            defaultValue={data.branding.favicon.type}
            readOnly
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function SearchPlaceholdersForm({ data }) {
  return (
    <Form.Section title="Search Placeholders">
      <Form.Field label="Search Page Placeholder" htmlFor="ws-page-placeholder">
        <Input.Field>
          <input
            id="ws-page-placeholder"
            name="pagePlaceholder"
            type="text"
            className={inputStyles.input}
            defaultValue={data.search.pagePlaceholder}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Overlay Placeholder" htmlFor="ws-overlay-placeholder">
        <Input.Field>
          <input
            id="ws-overlay-placeholder"
            name="overlayPlaceholder"
            type="text"
            className={inputStyles.input}
            defaultValue={data.search.overlayPlaceholder}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Overlay Subtitle" htmlFor="ws-overlay-subtitle">
        <Input.Field>
          <input
            id="ws-overlay-subtitle"
            name="overlaySubtitle"
            type="text"
            className={inputStyles.input}
            defaultValue={data.search.overlaySubtitle}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function SearchLimitsForm({ data }) {
  return (
    <Form.Section title="Search Limits">
      <Form.Field label="Suggestions Limit" htmlFor="ws-suggestions-limit">
        <Input.Field>
          <input
            id="ws-suggestions-limit"
            name="suggestionsLimit"
            type="number"
            min="1"
            max="20"
            className={inputStyles.input}
            defaultValue={data.search.suggestionsLimit}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Results Limit" htmlFor="ws-results-limit">
        <Input.Field>
          <input
            id="ws-results-limit"
            name="resultsLimit"
            type="number"
            min="1"
            max="100"
            className={inputStyles.input}
            defaultValue={data.search.resultsLimit}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function GoogleMapsForm({ data }) {
  return (
    <Form.Section title="Google Maps">
      <Form.Field label="Embed URL" htmlFor="ws-maps-embed">
        <Input.Field>
          <textarea
            id="ws-maps-embed"
            name="googleMapsEmbedUrl"
            className={`${inputStyles.input} ${inputStyles.textarea}`}
            defaultValue={data.integrations.googleMapsEmbedUrl}
            rows={4}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function EditForm({ editKey, data }) {
  switch (editKey) {
    case 'general-identity':
      return <GeneralIdentityForm data={data} />;
    case 'branding-favicon':
      return <FaviconForm data={data} />;
    case 'search-placeholders':
      return <SearchPlaceholdersForm data={data} />;
    case 'search-limits':
      return <SearchLimitsForm data={data} />;
    case 'integrations-maps':
      return <GoogleMapsForm data={data} />;
    default:
      return null;
  }
}

export default function WebsiteSettingsEditModal({ open, editKey, settings, onClose, onSave }) {
  if (!editKey) return null;

  const title = getEditableSettingTitle(editKey);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    onSave(editKey, values);
  };

  const modalHeader = (
    <div className={drawerStyles.header}>
      <div>
        <h2 id="ws-edit-title" className={drawerStyles.title}>
          Edit {title}
        </h2>
        <p className={drawerStyles.subtitle}>Changes apply in preview mode only.</p>
      </div>
      <button type="button" className={drawerStyles.closeBtn} onClick={onClose} aria-label="Close">
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <div className={drawerStyles.footer}>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" form="ws-edit-form" icon={<AdminIcon name="check" size={14} />}>
        Save Changes
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="ws-edit-title"
    >
      <form id="ws-edit-form" onSubmit={handleSubmit}>
        <EditForm editKey={editKey} data={settings} />
      </form>
    </Modal>
  );
}
