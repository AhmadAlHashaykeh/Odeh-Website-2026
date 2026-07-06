import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Badge, Input } from '../../ui';
import { CmsModuleShortcut } from '../../cms/components';
import { CoverImageField } from '../../cms/action-flows/PlaceholderFieldGroup';
import { sectionEditTitles } from '../mock/homePageConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import styles from './HomePageSectionEditModal.module.css';

function StatFields({ stats, prefix }) {
  return stats.map((stat, index) => (
    <Form.Row key={`${prefix}-stat-${index}`}>
      <Form.Field label={`Stat ${index + 1} Value`} htmlFor={`${prefix}-stat-value-${index}`}>
        <Input.Field>
          <input
            id={`${prefix}-stat-value-${index}`}
            name={`${prefix}-stat-value-${index}`}
            type="text"
            className={inputStyles.input}
            defaultValue={stat.value}
          />
        </Input.Field>
      </Form.Field>
      <Form.Field label={`Stat ${index + 1} Label`} htmlFor={`${prefix}-stat-label-${index}`}>
        <Input.Field>
          <input
            id={`${prefix}-stat-label-${index}`}
            name={`${prefix}-stat-label-${index}`}
            type="text"
            className={inputStyles.input}
            defaultValue={stat.label}
          />
        </Input.Field>
      </Form.Field>
    </Form.Row>
  ));
}

function HeroForm({ data }) {
  return (
    <>
      <Form.Section title="Badge & Headline">
        <Form.Field label="Badge / Label" htmlFor="hero-badge">
          <Input.Field>
            <input
              id="hero-badge"
              name="hero-badge"
              type="text"
              className={inputStyles.input}
              defaultValue={data.badge}
            />
          </Input.Field>
        </Form.Field>
        <Form.Row>
          <Form.Field label="Main Heading" htmlFor="hero-heading-main">
            <Input.Field>
              <input
                id="hero-heading-main"
                name="hero-heading-main"
                type="text"
                className={inputStyles.input}
                defaultValue={data.headingMain}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Heading Accent" htmlFor="hero-heading-accent">
            <Input.Field>
              <input
                id="hero-heading-accent"
                name="hero-heading-accent"
                type="text"
                className={inputStyles.input}
                defaultValue={data.headingAccent}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
        <Form.Field label="Description" htmlFor="hero-description">
          <Input.Field>
            <textarea
              id="hero-description"
              name="hero-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={4}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Statistics Strip">
        <StatFields stats={data.stats} prefix="hero" />
      </Form.Section>

      <Form.Section title="Call to Action">
        <Form.Row>
          <Form.Field label="Primary CTA Label" htmlFor="hero-primary-label">
            <Input.Field>
              <input
                id="hero-primary-label"
                name="hero-primary-label"
                type="text"
                className={inputStyles.input}
                defaultValue={data.primaryCta.label}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Primary CTA Link" htmlFor="hero-primary-path">
            <Input.Field>
              <input
                id="hero-primary-path"
                name="hero-primary-path"
                type="text"
                className={inputStyles.input}
                defaultValue={data.primaryCta.path}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
        <Form.Row>
          <Form.Field label="Secondary CTA Label" htmlFor="hero-secondary-label">
            <Input.Field>
              <input
                id="hero-secondary-label"
                name="hero-secondary-label"
                type="text"
                className={inputStyles.input}
                defaultValue={data.secondaryCta.label}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Secondary CTA Link" htmlFor="hero-secondary-path">
            <Input.Field>
              <input
                id="hero-secondary-path"
                name="hero-secondary-path"
                type="text"
                className={inputStyles.input}
                defaultValue={data.secondaryCta.path}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
      </Form.Section>

      <Form.Section title="Hero Media">
        <div className={styles.mediaField}>
          <CoverImageField
            label="Hero Poster Image"
            name="posterImage"
            src={data.posterImage}
            alt="Hero poster"
            uploadModule="home-page"
            uploadField="posterImage"
          />
        </div>
        <Form.Field label="Hero Video" htmlFor="hero-video" helper="MP4 source used behind the poster">
          <Input.Field>
            <input
              id="hero-video"
              name="hero-video"
              type="text"
              className={inputStyles.input}
              defaultValue={data.videoSrc}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>
    </>
  );
}

function AboutForm({ data }) {
  return (
    <>
      <Form.Section title="Homepage Section Framing">
        <Form.Field label="Section Label" htmlFor="about-label">
          <Input.Field>
            <input
              id="about-label"
              name="about-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.sectionLabel}
            />
          </Input.Field>
        </Form.Field>
        <Form.Row>
          <Form.Field label="Read More Label" htmlFor="about-readmore-label">
            <Input.Field>
              <input
                id="about-readmore-label"
                name="about-readmore-label"
                type="text"
                className={inputStyles.input}
                defaultValue={data.readMoreLabel}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Read More Link" htmlFor="about-readmore-path">
            <Input.Field>
              <input
                id="about-readmore-path"
                name="about-readmore-path"
                type="text"
                className={inputStyles.input}
                defaultValue={data.readMorePath}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
        <p className={styles.formNote}>
          Title, body copy, stats, and image are sourced from About Pages → Overview. Edit them there, not here.
        </p>
      </Form.Section>

      <Form.Section title="Related Content">
        <CmsModuleShortcut
          title="Open About Pages"
          description="Edit company introduction, overview hero, and office gallery."
          path="/admin/about-pages"
          icon="about"
        />
      </Form.Section>
    </>
  );
}

function ServicesForm({ data }) {
  return (
    <>
      <Form.Section title="Section Header">
        <Form.Field label="Section Label" htmlFor="services-label">
          <Input.Field>
            <input
              id="services-label"
              name="services-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.sectionLabel}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Heading" htmlFor="services-heading">
          <Input.Field>
            <input
              id="services-heading"
              name="services-heading"
              type="text"
              className={inputStyles.input}
              defaultValue={data.heading}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Description" htmlFor="services-description">
          <Input.Field>
            <textarea
              id="services-description"
              name="services-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={3}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Displayed Services Count" htmlFor="services-count">
          <Input.Field>
            <input
              id="services-count"
              name="services-count"
              type="number"
              className={inputStyles.input}
              defaultValue={data.services.length}
              readOnly
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Ordered Service Cards">
        <div className={styles.cardList}>
          {data.services.map((service) => (
            <div key={service.id} className={styles.cardListItem}>
              <img src={resolveMediaUrl(service.image)} alt={service.title} className={styles.cardThumb} />
              <div className={styles.cardInfo}>
                <span className={styles.cardOrder}>#{service.order}</span>
                <strong>{service.title}</strong>
                <span className={styles.cardPath}>{service.path}</span>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.formNote}>
          Service card content is managed in the Services module. Use Manage Services to edit titles, descriptions, and images.
        </p>
        <CmsModuleShortcut
          title="Manage Services"
          description="Edit service titles, descriptions, images, and homepage visibility."
          path="/admin/services"
          icon="services"
        />
      </Form.Section>
    </>
  );
}

function ProjectsForm({ data }) {
  return (
    <>
      <Form.Section title="Section Header">
        <Form.Field label="Section Label" htmlFor="projects-label">
          <Input.Field>
            <input
              id="projects-label"
              name="projects-label"
              type="text"
              className={inputStyles.input}
              defaultValue={data.sectionLabel}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Heading" htmlFor="projects-heading">
          <Input.Field>
            <input
              id="projects-heading"
              name="projects-heading"
              type="text"
              className={inputStyles.input}
              defaultValue={data.heading}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Description" htmlFor="projects-description">
          <Input.Field>
            <textarea
              id="projects-description"
              name="projects-description"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.description}
              rows={3}
            />
          </Input.Field>
        </Form.Field>
        <Form.Field label="Displayed Project Count" htmlFor="projects-count">
          <Input.Field>
            <input
              id="projects-count"
              name="projects-count"
              type="number"
              className={inputStyles.input}
              defaultValue={data.projects.length}
              readOnly
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Selected Project Cards">
        <div className={styles.cardList}>
          {data.projects.map((project) => (
            <div key={project.id} className={styles.cardListItem}>
              <img src={resolveMediaUrl(project.image)} alt={project.title} className={styles.cardThumb} />
              <div className={styles.cardInfo}>
                <span className={styles.cardOrder}>#{project.order}</span>
                <strong>{project.title}</strong>
                <span className={styles.cardPath}>
                  /projects/{project.categorySlug}/{project.slug}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Form.Row>
          <Form.Field label="View All Label" htmlFor="projects-viewall-label">
            <Input.Field>
              <input
                id="projects-viewall-label"
                name="projects-viewall-label"
                type="text"
                className={inputStyles.input}
                defaultValue={data.viewAllLabel}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="View All Link" htmlFor="projects-viewall-path">
            <Input.Field>
              <input
                id="projects-viewall-path"
                name="projects-viewall-path"
                type="text"
                className={inputStyles.input}
                defaultValue={data.viewAllPath}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
        <p className={styles.formNote}>
          Project selection is derived from featuredProjects (first 3). Edit project details in the Projects module.
        </p>
        <CmsModuleShortcut
          title="Manage Projects"
          description="Edit project titles, galleries, categories, and featured status."
          path="/admin/projects"
          icon="projects"
        />
      </Form.Section>
    </>
  );
}

function SectionForm({ sectionId, data }) {
  switch (sectionId) {
    case 'hero':
      return <HeroForm data={data} />;
    case 'about':
      return <AboutForm data={data} />;
    case 'services':
      return <ServicesForm data={data} />;
    case 'projects':
      return <ProjectsForm data={data} />;
    default:
      return null;
  }
}

export default function HomePageSectionEditModal({
  open,
  sectionId,
  sectionData,
  onClose,
  onSave,
}) {
  if (!sectionId || !sectionData) return null;

  const title = sectionEditTitles[sectionId];

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.(sectionId, e.currentTarget);
  };

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <Badge variant="info" className={drawerStyles.moduleBadge}>
          Homepage Section
        </Badge>
        <h2 id="home-section-modal-title" className={drawerStyles.modalTitle}>
          {title}
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Update homepage section content. Changes are saved to the CMS.
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
      ariaLabelledBy="home-section-modal-title"
    >
      <Form key={sectionId} onSubmit={handleSave} className={`${drawerStyles.form} ${styles.form}`}>
        <SectionForm sectionId={sectionId} data={sectionData} />
      </Form>
    </Modal>
  );
}
