import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Badge, Input } from '../../ui';
import { CoverImageField, GalleryPlaceholder } from '../../cms/action-flows/PlaceholderFieldGroup';
import { panelEditTitles } from '../mock/aboutPagesConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './AboutSectionEditModal.module.css';

function HeroForm({ data }) {
  return (
    <>
      <Form.Section title="Page Header">
        <Form.Field label="Label" htmlFor="hero-label">
          <Input.Field>
            <input
              id="hero-label"
              name="hero-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.label}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Title" htmlFor="hero-title">
          <Input.Field>
            <input
              id="hero-title"
              name="hero-title"
              type="text"
              className={inputStyles.input}
              defaultValue={data.title}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Description" htmlFor="hero-description">
          <Input.Field>
            <textarea
              id="hero-description"
              name="hero-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={3}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title="Background Image">
        <div className={styles.mediaField}>
          <CoverImageField
            label="Hero Background"
            name="backgroundImage"
            src={data.backgroundImage}
            alt={data.ariaLabel}
            uploadModule="about-pages"
            uploadField="backgroundImage"
            onChange={(nextSrc) => {
              const input = document.getElementById('hero-bg');
              if (input) input.value = nextSrc;
            }}
          />
        </div>
        <Form.Field label="Image Path" htmlFor="hero-bg">
          <Input.Field>
            <input
              id="hero-bg"
              name="hero-bg"
              type="text"
              className={inputStyles.input}
              defaultValue={data.backgroundImage}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function CompanyIntroForm({ data }) {
  return (
    <>
      <Form.Section title="Company Introduction">
        <Form.Field label="Title" htmlFor="intro-title">
          <Input.Field>
            <input
              id="intro-title"
              name="intro-title"
              type="text"
              className={inputStyles.input}
              defaultValue={data.title}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Description" htmlFor="intro-description">
          <Input.Field>
            <textarea
              id="intro-description"
              name="intro-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={6}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title="Featured Image">
        <div className={styles.mediaField}>
          <CoverImageField
            label="Office Image"
            name="intro-image-src"
            src={data.image.src}
            alt={data.image.alt}
            uploadModule="about-pages"
            uploadField="image"
            onChange={(nextSrc) => {
              const input = document.getElementById('intro-image-src');
              if (input) input.value = nextSrc;
            }}
          />
        </div>
        <Form.Row>
          <Form.Field label="Image Path" htmlFor="intro-image-src">
            <Input.Field>
              <input
                id="intro-image-src"
                name="intro-image-src"
                type="text"
                className={inputStyles.input}
                defaultValue={data.image.src}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Alt Text" htmlFor="intro-image-alt">
            <Input.Field>
              <input
                id="intro-image-alt"
                name="intro-image-alt"
                type="text"
                className={inputStyles.input}
                defaultValue={data.image.alt}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
      </Form.Section>
    </>
  );
}

function OfficeGalleryForm({ data }) {
  return (
    <>
      <Form.Section title="Gallery Header">
        <Form.Field label="Label" htmlFor="gallery-label">
          <Input.Field>
            <input
              id="gallery-label"
              name="gallery-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.label}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Description" htmlFor="gallery-description">
          <Input.Field>
            <textarea
              id="gallery-description"
              name="gallery-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={3}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title={`Office Images (${data.images.length})`}>
        <div className={styles.mediaField}>
          <GalleryPlaceholder
            label="Office Gallery"
            name="gallery-images"
            images={data.images}
            uploadModule="about-pages"
            uploadField="gallery"
          />
        </div>
        <div className={styles.imageList}>
          {data.images.map((image, index) => (
            <div key={image.src} className={styles.imageListItem}>
              <img src={resolveMediaUrl(image.src)} alt={image.alt} className={styles.imageThumb} />
              <div className={styles.imageInfo}>
                <span className={styles.imageOrder}>#{index + 1}</span>
                <span className={styles.imagePath}>{image.src}</span>
                <span className={styles.imageAlt}>{image.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </Form.Section>
    </>
  );
}

function PrinciplesForm({ data }) {
  return (
    <>
      <Form.Section title="Section Header">
        <Form.Field label="Label" htmlFor="principles-label">
          <Input.Field>
            <input
              id="principles-label"
              name="principles-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.label}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title={`Engineering Principles (${data.items.length})`}>
        <div className={styles.principleFormList}>
          {data.items.map((item) => (
            <div key={item.number} className={styles.principleFormItem}>
              <span className={styles.principleFormNum}>{item.number}</span>
              <div className={styles.principleFormFields}>
                <Form.Field label={`Title (${item.number})`} htmlFor={`principle-title-${item.number}`}>
                  <Input.Field>
                    <input
                      id={`principle-title-${item.number}`}
                      name={`principle-title-${item.number}`}
                      type="text"
                      className={inputStyles.input}
                      defaultValue={item.title}
                    />
                  </Input.Field>
                </Form.Field>
                <Form.Field label="Description" htmlFor={`principle-desc-${item.number}`}>
                  <Input.Field>
                    <textarea
                      id={`principle-desc-${item.number}`}
                      name={`principle-desc-${item.number}`}
                      className={`${inputStyles.input} ${inputStyles.textarea}`}
                      defaultValue={item.description}
                      rows={2}
                    />
                  </Input.Field>
                </Form.Field>
              </div>
            </div>
          ))}
        </div>
      </Form.Section>
    </>
  );
}

function StoryForm({ data }) {
  return (
    <Form.Section title="Company Story">
      <Form.Field label="Label" htmlFor="story-label">
        <Input.Field>
          <input
            id="story-label"
            name="story-label"
            type="text"
            className={inputStyles.input}
            defaultValue={data.label}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Lead" htmlFor="story-lead">
        <Input.Field>
          <input
            id="story-lead"
            name="story-lead"
            type="text"
            className={inputStyles.input}
            defaultValue={data.lead}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Title" htmlFor="story-title">
        <Input.Field>
          <input
            id="story-title"
            name="story-title"
            type="text"
            className={inputStyles.input}
            defaultValue={data.title}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label="Body" htmlFor="story-body">
        <Input.Field>
          <textarea
            id="story-body"
            name="story-body"
            className={`${inputStyles.input} ${inputStyles.textarea}`}
            defaultValue={data.body}
            rows={8}
          />
        </Input.Field>
      </Form.Field>
    </Form.Section>
  );
}

function CountersForm({ data }) {
  return (
    <Form.Section title="Statistics Counters">
      {data.items.map((item, index) => (
        <Form.Row key={item.label}>
          <Form.Field label={`Counter ${index + 1} Value`} htmlFor={`counter-value-${index}`}>
            <Input.Field>
              <input
                id={`counter-value-${index}`}
                name={`counter-value-${index}`}
                type="text"
                className={inputStyles.input}
                defaultValue={item.value}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label={`Counter ${index + 1} Label`} htmlFor={`counter-label-${index}`}>
            <Input.Field>
              <input
                id={`counter-label-${index}`}
                name={`counter-label-${index}`}
                type="text"
                className={inputStyles.input}
                defaultValue={item.label}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
      ))}
    </Form.Section>
  );
}

function GrowthTableForm({ data }) {
  return (
    <>
      <Form.Section title="Table Header">
        <Form.Field label="Label" htmlFor="growth-label">
          <Input.Field>
            <input
              id="growth-label"
              name="growth-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.label}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Title" htmlFor="growth-title">
          <Input.Field>
            <input
              id="growth-title"
              name="growth-title"
              type="text"
              className={inputStyles.input}
              defaultValue={data.title}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
      <Form.Section title={`Growth Data (${data.rows.length} years)`}>
        <div className={styles.tableFormWrap}>
          <table className={styles.tableForm}>
            <thead>
              <tr>
                {data.columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, index) => (
                <tr key={row.year}>
                  <td>
                    <input
                      type="number"
                      className={inputStyles.input}
                      defaultValue={row.year}
                      aria-label={`Year row ${index + 1}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={inputStyles.input}
                      defaultValue={row.projects}
                      aria-label={`Projects row ${index + 1}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className={inputStyles.input}
                      defaultValue={row.area}
                      aria-label={`Area row ${index + 1}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Form.Section>
    </>
  );
}

function PanelForm({ panelId, data }) {
  switch (panelId) {
    case 'overview-hero':
    case 'approach-hero':
    case 'history-hero':
      return <HeroForm data={data} />;
    case 'overview-intro':
      return <CompanyIntroForm data={data} />;
    case 'overview-gallery':
      return <OfficeGalleryForm data={data} />;
    case 'approach-principles':
      return <PrinciplesForm data={data} />;
    case 'history-story':
      return <StoryForm data={data} />;
    case 'history-counters':
      return <CountersForm data={data} />;
    case 'history-growth':
      return <GrowthTableForm data={data} />;
    default:
      return null;
  }
}

export default function AboutSectionEditModal({
  open,
  panelId,
  panelData,
  onClose,
  onSave,
}) {
  if (!panelId || !panelData) return null;

  const title = panelEditTitles[panelId];

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.(panelId, e.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <Badge variant="info" className={drawerStyles.moduleBadge}>
          About Page
        </Badge>
        <h2 id="about-panel-modal-title" className={drawerStyles.modalTitle}>
          {title}
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Update About page content. Changes are saved to the CMS.
        </p>
      </div>
      <button
        type="button"
        className={drawerStyles.closeBtn}
        onClick={onClose}
        aria-label="Close modal"
      >
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="check" size={16} />}
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="about-panel-modal-title"
    >
      <Form key={panelId} onSubmit={handleSave} className={`${drawerStyles.form} ${styles.form}`}>
        <PanelForm panelId={panelId} data={panelData} />
      </Form>
    </Modal>
  );
}
