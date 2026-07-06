import { AboutPageShell } from '../components/AboutSection';
import {
  InternalPageHero,
  PageContainer,
  DocumentLayout,
  DocumentSection,
} from '../components/Utility';
import PageLoader from '../components/Utility/PageLoader';
import { getLegalPage } from '../api/public/content';
import { usePublicQuery } from '../hooks/usePublicQuery';
import styles from './LegalDocumentPage.module.css';

function renderParagraphs(paragraphs) {
  if (!paragraphs?.length) return null;
  return paragraphs.map((text) => <p key={text.slice(0, 24)}>{text}</p>);
}

function renderList(items) {
  if (!items?.length) return null;
  return (
    <ul>
      {items.map((item) => (
        <li key={item.slice(0, 24)}>{item}</li>
      ))}
    </ul>
  );
}

const FALLBACK_META = {
  title: 'Privacy Policy | ODEH & PARTNERS DESIGN',
  description: 'Learn how ODEH & PARTNERS DESIGN collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  const { data, loading, error } = usePublicQuery(() => getLegalPage('privacy-policy'), []);
  const content = data?.data;

  if (loading) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <PageLoader />
      </AboutPageShell>
    );
  }

  if (error || !content) {
    return (
      <AboutPageShell meta={FALLBACK_META}>
        <p>Unable to load page content.</p>
      </AboutPageShell>
    );
  }

  const { meta, hero, sections, lastUpdated, body } = content;

  return (
    <AboutPageShell meta={meta}>
      <InternalPageHero {...hero} />

      <PageContainer narrow ariaLabel="Privacy Policy">
        <DocumentLayout sections={sections} lastUpdated={lastUpdated}>
          <DocumentSection id="introduction" title="Introduction">
            {renderParagraphs(body.introduction)}
          </DocumentSection>

          <DocumentSection id="information-we-collect" title="Information We Collect">
            {renderParagraphs(body['information-we-collect'])}
            {renderList(body['information-we-collect-list'])}
          </DocumentSection>

          <DocumentSection id="how-we-use-information" title="How We Use Information">
            {renderParagraphs(body['how-we-use-information'])}
            {renderList(body['how-we-use-information-list'])}
          </DocumentSection>

          <DocumentSection id="legal-basis" title="Legal Basis for Processing">
            {renderParagraphs(body['legal-basis'])}
          </DocumentSection>

          <DocumentSection id="sharing-and-disclosure" title="Sharing and Disclosure">
            {renderParagraphs(body['sharing-and-disclosure'])}
          </DocumentSection>

          <DocumentSection id="data-retention" title="Data Retention">
            {renderParagraphs(body['data-retention'])}
          </DocumentSection>

          <DocumentSection id="security" title="Security Measures">
            {renderParagraphs(body.security)}
          </DocumentSection>

          <DocumentSection id="your-rights" title="Your Rights">
            {renderParagraphs(body['your-rights'])}
          </DocumentSection>

          <DocumentSection id="cookies" title="Cookies and Analytics">
            {renderParagraphs(body.cookies)}
          </DocumentSection>

          <DocumentSection id="contact" title="Contact Us">
            <div className={styles.contactBlock}>
              {renderParagraphs(body.contact)}
            </div>
          </DocumentSection>
        </DocumentLayout>
      </PageContainer>
    </AboutPageShell>
  );
}
