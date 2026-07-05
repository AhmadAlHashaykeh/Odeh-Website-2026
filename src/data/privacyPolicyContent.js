const OFFICE = '/assets/about/office';

export const privacyPolicyContent = {
  meta: {
    title: 'Privacy Policy | ODEH & PARTNERS DESIGN',
    description:
      'Learn how ODEH & PARTNERS DESIGN collects, uses, and protects your personal information when you visit our website or contact our team.',
  },
  hero: {
    label: 'Legal',
    title: 'Privacy Policy',
    description:
      'This policy explains how we handle personal information when you browse our website, submit inquiries, or apply for career opportunities.',
    backgroundImage: `${OFFICE}/img-05.webp`,
    compact: true,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Privacy Policy' },
    ],
  },
  lastUpdated: 'June 28, 2026',
  sections: [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-we-collect', title: 'Information We Collect' },
    { id: 'how-we-use-information', title: 'How We Use Information' },
    { id: 'legal-basis', title: 'Legal Basis for Processing' },
    { id: 'sharing-and-disclosure', title: 'Sharing and Disclosure' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'security', title: 'Security Measures' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies and Analytics' },
    { id: 'contact', title: 'Contact Us' },
  ],
  body: {
    introduction: [
      'ODEH & PARTNERS DESIGN ("ODEH", "we", "our", or "us") respects your privacy and is committed to protecting personal information submitted through our website, email communications, and digital forms.',
      'This Privacy Policy applies to visitors of odehdesign.com and related web properties operated by ODEH & PARTNERS DESIGN, a structural engineering and design firm based in Amman, Jordan.',
    ],
    'information-we-collect': [
      'We may collect the following categories of information depending on how you interact with our website:',
    ],
    'information-we-collect-list': [
      'Contact details such as your name, email address, phone number, and company name when you submit an inquiry through our Reach Out form.',
      'Career application information including your résumé, cover letter, portfolio links, and employment history when you apply for an open role.',
      'Technical data such as IP address, browser type, device information, and pages visited, collected automatically through standard server logs.',
      'Communication records when you correspond with our team by email or phone regarding projects, services, or employment.',
    ],
    'how-we-use-information': [
      'We use personal information for legitimate business purposes related to our engineering practice, including:',
    ],
    'how-we-use-information-list': [
      'Responding to project inquiries, quotation requests, and general contact messages.',
      'Reviewing and evaluating job applications for open positions.',
      'Improving website performance, content relevance, and user experience.',
      'Maintaining records required for business operations, compliance, and professional obligations.',
      'Protecting the security and integrity of our website and internal systems.',
    ],
    'legal-basis': [
      'Where applicable, we process personal information based on one or more of the following grounds: your consent, performance of a contract or pre-contractual steps, compliance with legal obligations, and our legitimate interests in operating and improving our business.',
      'You may withdraw consent at any time where processing is consent-based, without affecting the lawfulness of processing carried out before withdrawal.',
    ],
    'sharing-and-disclosure': [
      'We do not sell personal information. We may share information with trusted service providers who assist us with website hosting, email delivery, applicant tracking, or analytics, subject to appropriate confidentiality and data protection obligations.',
      'We may also disclose information when required by law, regulation, court order, or to protect the rights, property, or safety of ODEH, our clients, or others.',
    ],
    'data-retention': [
      'We retain personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.',
      'Career application materials are typically retained for up to twelve months unless you request earlier deletion or we extend retention for a specific recruitment cycle.',
    ],
    security: [
      'We implement reasonable administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, alteration, disclosure, or destruction.',
      'While we strive to protect your data, no method of transmission over the internet or electronic storage is completely secure. We encourage you to use secure channels when submitting sensitive information.',
    ],
    'your-rights': [
      'Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal information, or to object to certain processing activities.',
      'To exercise these rights, contact us using the details in the Contact Us section below. We will respond within a reasonable timeframe.',
    ],
    cookies: [
      'Our website may use essential cookies required for basic functionality and, where enabled, analytics cookies to understand how visitors use our pages.',
      'You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.',
    ],
    contact: [
      'If you have questions about this Privacy Policy or wish to submit a privacy-related request, please contact us:',
      'ODEH & PARTNERS DESIGN — Amman, Jordan',
      'Email: ODEH@ODEHDESIGN.COM',
    ],
  },
};
