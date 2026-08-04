/**
 * Form field schemas for admin action-flow modals.
 * Frontend-only — no persistence.
 */

export const MODULE_FORM_SCHEMAS = {
  projects: {
    addTitle: 'Add Project',
    editTitle: 'Edit Project',
    subtitle: 'Project Name, Area, Location, Architect, and Category.',
    badge: 'Projects',
    sections: [
      {
        title: 'Project Details',
        fields: [
          { name: 'title', label: 'Project Name', type: 'text', required: true },
          { name: 'area', label: 'Area (m²)', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'architect', label: 'Architect', type: 'text' },
          { name: 'category', label: 'Category', type: 'select', options: ['Commercial', 'Residential', 'Hospitality', 'Infrastructure'] },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
        ],
      },
    ],
    seoDelegation: false,
  },

  categories: {
    addTitle: 'Add Category',
    editTitle: 'Edit Category',
    subtitle: 'Organize project categories and control visibility on the website.',
    badge: 'Categories',
    sections: [
      {
        title: 'Category Details',
        fields: [
          { name: 'title', label: 'Category Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', rows: 4, fullWidth: true },
        ],
      },
      {
        title: 'Category Image',
        fields: [
          {
            name: 'categoryImageNotice',
            type: 'notice',
            fullWidth: true,
            title: 'Automatic category images',
            content:
              'Category images are generated automatically from published projects in this category.',
          },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft'] },
          { name: 'published', label: 'Visible on Website', type: 'select', options: ['Yes', 'No'] },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
        ],
      },
    ],
    seoDelegation: true,
  },

  'team-members': {
    addTitle: 'Add Member',
    editTitle: 'Edit Member',
    subtitle: 'Section = where they appear. Rank = card colour on the website.',
    badge: 'Team',
    sections: [
      {
        title: 'Basic info',
        fields: [
          { name: 'fullName', label: 'Full name', type: 'text', required: true },
          {
            name: 'position',
            label: 'Job title',
            type: 'text',
            helper: 'Shown under the name, e.g. Senior Structural Engineer',
          },
          {
            name: 'experience',
            label: 'Experience (optional)',
            type: 'text',
            helper: 'e.g. 7+ Years',
          },
        ],
      },
      {
        title: 'Website grouping & colour',
        fields: [
          {
            name: 'teamCategoryId',
            label: 'Section',
            type: 'select',
            required: true,
            options: [],
            helper: 'Board of Directors or Team Members — the group on the public page.',
          },
          {
            name: 'teamRankId',
            label: 'Rank (card colour)',
            type: 'select',
            required: true,
            options: [],
            helper: 'Matches the org chart colours: Founder, Partner, Senior, Engineer, Academic, Support.',
          },
        ],
      },
      {
        title: 'Photo',
        fields: [
          { name: 'photo', label: 'Profile photo', type: 'cover', fullWidth: true },
        ],
      },
      {
        title: 'Contact',
        fields: [
          { name: 'email', label: 'Email (optional)', type: 'text' },
          {
            name: 'linkedinUrl',
            label: 'LinkedIn URL (optional)',
            type: 'text',
            helper: 'Full profile link, e.g. https://www.linkedin.com/in/...',
            fullWidth: true,
          },
        ],
      },
      {
        title: 'Visibility',
        fields: [
          {
            name: 'status',
            label: 'Show on website?',
            type: 'select',
            options: [
              { value: 'active', label: 'Yes — visible' },
              { value: 'hidden', label: 'No — hidden' },
            ],
          },
          {
            name: 'displayOrder',
            label: 'Order in list',
            type: 'number',
            helper: 'Smaller number appears first (1, 2, 3…).',
          },
        ],
      },
    ],
    seoDelegation: true,
  },

  'team-categories': {
    addTitle: 'Add Team Section',
    editTitle: 'Edit Team Section',
    subtitle: 'A section is a group on the public Team Members page (e.g. Board of Directors).',
    badge: 'Team Sections',
    sections: [
      {
        title: 'Section details',
        fields: [
          { name: 'name', label: 'Section name', type: 'text', required: true },
          { name: 'slug', label: 'Slug', type: 'text', helper: 'Auto-generated from the name when left blank.' },
          { name: 'description', label: 'Description (optional)', type: 'textarea', rows: 3, fullWidth: true },
        ],
      },
      {
        title: 'Appearance',
        fields: [
          {
            name: 'borderColor',
            label: 'Section accent colour',
            type: 'color',
            required: true,
            previewTitleField: 'name',
            fullWidth: true,
            helper: 'Only colours the section header line. Each person\'s card colour comes from Rank.',
          },
        ],
      },
      {
        title: 'Visibility',
        fields: [
          {
            name: 'status',
            label: 'Active?',
            type: 'select',
            options: [
              { value: 'active', label: 'Yes — usable in forms' },
              { value: 'inactive', label: 'No — archived' },
            ],
          },
          {
            name: 'displayOrder',
            label: 'Order on website',
            type: 'number',
            helper: 'Smaller number appears first.',
          },
        ],
      },
    ],
    seoDelegation: false,
  },

  services: {
    addTitle: 'Add Service',
    editTitle: 'Edit Service',
    subtitle: 'Configure service details, media, homepage visibility, and publishing.',
    badge: 'Services',
    sections: [
      {
        title: 'Service Details',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'textarea', rows: 4, fullWidth: true },
        ],
      },
      {
        title: 'Media',
        fields: [
          { name: 'image', label: 'Image', type: 'cover', fullWidth: true },
          { name: 'icon', label: 'Icon', type: 'cover', fullWidth: true },
        ],
      },
      {
        title: 'Homepage Visibility',
        fields: [
          { name: 'usedOnHomepage', label: 'Used On Homepage', type: 'select', options: ['Yes', 'No'] },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'hidden'] },
        ],
      },
    ],
    seoDelegation: true,
  },

  activities: {
    addTitle: 'Add Activity',
    editTitle: 'Edit Activity',
    subtitle: 'Document company activities, gallery media, and event timeline.',
    badge: 'Activities',
    sections: [
      {
        title: 'Activity Details',
        fields: [
          { name: 'title', label: 'Activity Title', type: 'text', required: true },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea', rows: 4, fullWidth: true },
        ],
      },
      {
        title: 'Gallery',
        fields: [
          { name: 'coverImage', label: 'Cover Image', type: 'cover', fullWidth: true },
          { name: 'gallery', label: 'Gallery', type: 'gallery', fullWidth: true },
        ],
      },
      {
        title: 'Timeline',
        fields: [
          { name: 'activityDate', label: 'Activity Date', type: 'text', helper: 'Event date or date range' },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
          { name: 'published', label: 'Published on Website', type: 'select', options: ['Yes', 'No'] },
          { name: 'featured', label: 'Featured', type: 'select', options: ['Yes', 'No'] },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
        ],
      },
    ],
    seoDelegation: true,
  },

  careers: {
    addTitle: 'Add Job',
    editTitle: 'Edit Job',
    subtitle: 'Configure job details, role information, and publishing settings.',
    badge: 'Careers',
    sections: [
      {
        title: 'Job Details',
        fields: [
          { name: 'title', label: 'Job Title', type: 'text', required: true },
          { name: 'slug', label: 'Slug', type: 'text', helper: 'Leave blank to auto-generate on create. Changing this updates the public URL.' },
          { name: 'department', label: 'Department', type: 'select', options: ['Structural Engineering', 'BIM & Digital Delivery', 'Site Supervision', 'Estimation & Planning'] },
          { name: 'location', label: 'Location', type: 'text' },
        ],
      },
      {
        title: 'Role Information',
        fields: [
          { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Internship', 'Part-time', 'Contract'] },
          { name: 'workMode', label: 'Work Mode', type: 'select', options: ['On-site', 'Hybrid', 'Remote'] },
          { name: 'experienceLevel', label: 'Experience Level', type: 'select', options: ['Entry-level', 'Junior', 'Mid-level', 'Senior'] },
          { name: 'postedDate', label: 'Posted Date', type: 'text', helper: 'YYYY-MM-DD' },
          { name: 'closingDate', label: 'Closing Date', type: 'text', helper: 'YYYY-MM-DD' },
        ],
      },
      {
        title: 'Description',
        fields: [
          { name: 'shortDescription', label: 'Short Description', type: 'textarea', rows: 3, fullWidth: true },
          { name: 'fullDescription', label: 'Full Description', type: 'textarea', rows: 5, fullWidth: true },
        ],
      },
      {
        title: 'Responsibilities',
        fields: [
          { name: 'responsibilities', label: 'Responsibilities', type: 'textarea', rows: 5, fullWidth: true, helper: 'One item per line' },
        ],
      },
      {
        title: 'Requirements',
        fields: [
          { name: 'requirements', label: 'Requirements', type: 'textarea', rows: 5, fullWidth: true, helper: 'One item per line' },
        ],
      },
      {
        title: 'Benefits',
        fields: [
          { name: 'benefits', label: 'Benefits', type: 'textarea', rows: 4, fullWidth: true, helper: 'One item per line' },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['open', 'closed', 'draft'] },
        ],
      },
    ],
    seoDelegation: true,
  },
};
