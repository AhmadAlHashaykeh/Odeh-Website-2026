import { AboutPageShell } from '../components/AboutSection';
import {
  InternalPageHero,
  PageContainer,
  DocumentLayout,
  DocumentSection,
} from '../components/Utility';
import { privacyPolicyContent } from '../data/privacyPolicyContent';
import styles from './LegalDocumentPage.module.css';

function renderParagraphs(paragraphs) {
  return paragraphs.map((text) => <p key={text.slice(0, 24)}>{text}</p>);
}

function renderList(items) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.slice(0, 24)}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  const { meta, hero, sections, lastUpdated, body } = privacyPolicyContent;

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
