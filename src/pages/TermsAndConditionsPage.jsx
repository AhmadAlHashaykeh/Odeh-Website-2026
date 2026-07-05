import { AboutPageShell } from '../components/AboutSection';
import {
  InternalPageHero,
  PageContainer,
  DocumentLayout,
  DocumentSection,
} from '../components/Utility';
import { termsContent } from '../data/termsContent';
import styles from './LegalDocumentPage.module.css';

function renderParagraphs(paragraphs) {
  return paragraphs.map((text) => <p key={text.slice(0, 24)}>{text}</p>);
}

export default function TermsAndConditionsPage() {
  const { meta, hero, sections, lastUpdated, body } = termsContent;

  return (
    <AboutPageShell meta={meta}>
      <InternalPageHero {...hero} />

      <PageContainer narrow ariaLabel="Terms and Conditions">
        <DocumentLayout sections={sections} lastUpdated={lastUpdated}>
          <DocumentSection id="acceptance" title="Acceptance of Terms">
            {renderParagraphs(body.acceptance)}
          </DocumentSection>

          <DocumentSection id="website-usage" title="Website Usage">
            {renderParagraphs(body['website-usage'])}
          </DocumentSection>

          <DocumentSection id="services" title="Engineering Services">
            {renderParagraphs(body.services)}
          </DocumentSection>

          <DocumentSection id="intellectual-property" title="Intellectual Property">
            {renderParagraphs(body['intellectual-property'])}
          </DocumentSection>

          <DocumentSection id="liability" title="Limitation of Liability">
            {renderParagraphs(body.liability)}
          </DocumentSection>

          <DocumentSection id="privacy" title="Privacy">
            {renderParagraphs(body.privacy)}
          </DocumentSection>

          <DocumentSection id="third-party-links" title="Third-Party Links">
            {renderParagraphs(body['third-party-links'])}
          </DocumentSection>

          <DocumentSection id="governing-law" title="Governing Law">
            {renderParagraphs(body['governing-law'])}
          </DocumentSection>

          <DocumentSection id="contact" title="Contact">
            <div className={styles.contactBlock}>
              {renderParagraphs(body.contact)}
            </div>
          </DocumentSection>
        </DocumentLayout>
      </PageContainer>
    </AboutPageShell>
  );
}
