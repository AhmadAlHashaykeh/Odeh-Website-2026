const OFFICE = '/assets/about/office';

export const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d875.2792572966247!2d35.83548932764389!3d31.99579087476341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1004033fd4f%3A0x285c02aa79e41619!2sOdeh%20Design%20Office!5e1!3m2!1sen!2sjo!4v1782622481425!5m2!1sen!2sjo';

export const reachOutContent = {
  meta: {
    title: 'Reach Out | ODEH & PARTNERS DESIGN',
    description:
      'Get in touch with ODEH & PARTNERS DESIGN for structural engineering, design consultation, and project inquiries.',
  },

  hero: {
    label: 'Reach Out',
    title: "Let's Start a Conversation",
    description:
      "Whether you're planning a new project, looking for engineering consultation, or simply have a question, our team is here to help.",
    backgroundImage: `${OFFICE}/img-01.webp`,
    ariaLabel: 'Reach Out',
    breadcrumbs: [{ label: 'Home', path: '/' }, { label: 'Reach Out' }],
  },

  form: {
    label: 'Contact Form',
    heading: 'Send Us a Message',
    description:
      'Share your project details or inquiry and our team will respond as soon as possible.',
    submitLabel: 'Send Message',
  },

  map: {
    heading: 'Visit Our Office',
    subheading: 'Find us at our headquarters in Amman, Jordan.',
    embedUrl: MAP_EMBED_URL,
  },
};
