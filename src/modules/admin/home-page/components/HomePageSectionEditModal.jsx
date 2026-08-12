import { useEffect, useMemo, useRef, useState } from 'react';
import AdminIcon from '../../components/AdminIcons';
import { Modal, Button, Form, Badge, Input } from '../../ui';
import { CmsModuleShortcut } from '../../cms/components';
import { CoverImageField } from '../../cms/action-flows/PlaceholderFieldGroup';
import { sectionEditTitles } from '../mock/homePageConfig';
import inputStyles from '../../ui/components/Input.module.css';
import drawerStyles from '../../cms/action-flows/AdminFormDrawer.module.css';
import { getProjects } from '../../../../api/public/content';
import { resolveMediaPath, resolveMediaUrl } from '../../../../utils/mediaUrl';
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
  const stats =
    data.stats?.length > 0
      ? data.stats
      : [
          { value: '', label: '' },
          { value: '', label: '' },
        ];

  return (
    <>
      <Form.Section title="Section Header">
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
          <Form.Field label="Title Main" htmlFor="about-title-main">
            <Input.Field>
              <input
                id="about-title-main"
                name="about-title-main"
                type="text"
                className={inputStyles.input}
                defaultValue={data.titleMain}
              />
            </Input.Field>
          </Form.Field>
          <Form.Field label="Title Accent" htmlFor="about-title-accent">
            <Input.Field>
              <input
                id="about-title-accent"
                name="about-title-accent"
                type="text"
                className={inputStyles.input}
                defaultValue={data.titleAccent}
              />
            </Input.Field>
          </Form.Field>
        </Form.Row>
        <Form.Field label="Body Copy" htmlFor="about-body">
          <Input.Field>
            <textarea
              id="about-body"
              name="about-body"
              className={`${inputStyles.input} ${inputStyles.textarea}`}
              defaultValue={data.body}
              rows={5}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Statistics">
        <StatFields stats={stats} prefix="about" />
      </Form.Section>

      <Form.Section title="Featured Image">
        <div className={styles.mediaField}>
          <CoverImageField
            label="About Section Image"
            name="about-image"
            src={data.image}
            alt={data.imageAlt || 'About section image'}
            uploadModule="home-page"
            uploadField="aboutImage"
          />
        </div>
        <Form.Field label="Image Alt Text" htmlFor="about-image-alt">
          <Input.Field>
            <input
              id="about-image-alt"
              name="about-image-alt"
              type="text"
              className={inputStyles.input}
              defaultValue={data.imageAlt}
            />
          </Input.Field>
        </Form.Field>
      </Form.Section>

      <Form.Section title="Call to Action">
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
      </Form.Section>

      <Form.Section title="Related Content">
        <CmsModuleShortcut
          title="Open About Pages"
          description="Edit the full About Overview page, team, and activities content."
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
  const initialPoolIds = Array.isArray(data.poolProjectIds) ? data.poolProjectIds : [];
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(initialPoolIds);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((response) => {
        if (cancelled) return;
        const projects = response?.data?.projects ?? [];
        setOptions(Array.isArray(projects) ? projects : []);
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to load published projects.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;

    return options.filter((project) => {
      const haystack = [project.title, project.category, project.location, project.slug]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [options, search]);

  const poolPayload = useMemo(() => {
    const byId = new Map(options.map((project) => [project.id, project]));
    const orderedSelected = selectedIds
      .map((id) => byId.get(id))
      .filter(Boolean);

    const previews = orderedSelected.map((project, index) => ({
      id: project.id,
      title: project.title,
      category: project.category ?? '',
      location: project.location ?? '',
      description: project.description ?? '',
      image: resolveMediaPath(project.coverImage ?? project.image),
      slug: project.slug,
      categorySlug: project.categorySlug ?? '',
      order: index + 1,
    }));

    return JSON.stringify({
      ids: selectedIds,
      previews,
    });
  }, [options, selectedIds]);

  const toggleProject = (projectId) => {
    setSelectedIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
  };

  const selectAllFiltered = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      filteredOptions.forEach((project) => next.add(project.id));
      return Array.from(next);
    });
  };

  const clearSelection = () => setSelectedIds([]);

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
      </Form.Section>

      <Form.Section title="Homepage Project Pool">
        <p className={styles.formNote}>
          Choose the projects that can appear in this section. The homepage picks 3 at random from
          this pool on each page load — not from the full portfolio.
        </p>

        <input type="hidden" name="projects-pool" value={poolPayload} />

        <div className={styles.poolToolbar}>
          <Input.Field>
            <input
              type="search"
              className={inputStyles.input}
              placeholder="Search projects…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search projects"
            />
          </Input.Field>
          <div className={styles.poolActions}>
            <button type="button" className={styles.poolActionBtn} onClick={selectAllFiltered}>
              Select visible
            </button>
            <button type="button" className={styles.poolActionBtn} onClick={clearSelection}>
              Clear
            </button>
          </div>
        </div>

        <div className={styles.poolMeta}>
          <strong>{selectedIds.length}</strong> selected
          {!loading && <span>· {options.length} published</span>}
        </div>

        {loading && <p className={styles.formNote}>Loading projects…</p>}
        {loadError && <p className={styles.formNote}>{loadError}</p>}

        {!loading && !loadError && (
          <div className={styles.poolList}>
            {filteredOptions.length === 0 ? (
              <p className={styles.formNote}>No projects match this search.</p>
            ) : (
              filteredOptions.map((project) => {
                const checked = selectedSet.has(project.id);
                const image = resolveMediaUrl(project.coverImage ?? project.image);

                return (
                  <label
                    key={project.id}
                    className={`${styles.poolItem} ${checked ? styles.poolItemSelected : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProject(project.id)}
                      className={styles.poolCheckbox}
                    />
                    {image ? (
                      <img src={image} alt="" className={styles.cardThumb} loading="lazy" />
                    ) : (
                      <span className={styles.poolThumbFallback} aria-hidden="true" />
                    )}
                    <span className={styles.cardInfo}>
                      <strong>{project.title}</strong>
                      <span className={styles.cardPath}>
                        {[project.category, project.location].filter(Boolean).join(' · ') ||
                          project.slug}
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}

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

        <CmsModuleShortcut
          title="Manage Projects"
          description="Edit project titles, galleries, categories, and publishing status."
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
  const formRef = useRef(null);

  if (!sectionId || !sectionData) return null;

  const title = sectionEditTitles[sectionId];

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.(sectionId, formRef.current);
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
      <Form
        key={sectionId}
        ref={formRef}
        onSubmit={handleSave}
        className={`${drawerStyles.form} ${styles.form}`}
      >
        <SectionForm sectionId={sectionId} data={sectionData} />
      </Form>
    </Modal>
  );
}
