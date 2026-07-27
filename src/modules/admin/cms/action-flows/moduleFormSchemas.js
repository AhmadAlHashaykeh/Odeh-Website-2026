/**
 * Form field schemas for admin action-flow modals.
 * Frontend-only — no persistence.
 */

export const MODULE_FORM_SCHEMAS = {
  projects: {
    addTitle: 'Add Project',
    editTitle: 'Edit Project',
    subtitle: 'Configure project details, media, and publishing settings.',
    badge: 'Projects',
    sections: [
      {
        title: 'Project Details',
        fields: [
          { name: 'title', label: 'Project Title', type: 'text', required: true },
          { name: 'slug', label: 'Slug', type: 'text', helper: 'Leave blank to auto-generate on create. Changing this updates the public URL.' },
          { name: 'category', label: 'Category', type: 'select', options: ['Commercial', 'Residential', 'Hospitality', 'Infrastructure'] },
          { name: 'description', label: 'Description', type: 'textarea', rows: 4, fullWidth: true },
        ],
      },
      {
        title: 'Media',
        fields: [
          { name: 'coverImage', label: 'Cover Image', type: 'cover', fullWidth: true },
          { name: 'gallery', label: 'Gallery', type: 'gallery', fullWidth: true },
        ],
      },
      {
        title: 'Technical Information',
        fields: [
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'projectType', label: 'Project Type', type: 'text' },
          { name: 'area', label: 'Area', type: 'text' },
          { name: 'completionStatus', label: 'Completion Status', type: 'text', helper: 'e.g. Completed, 2023' },
          { name: 'year', label: 'Year', type: 'number' },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['published', 'draft', 'archived'] },
          { name: 'published', label: 'Published on Website', type: 'select', options: ['Yes', 'No'] },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
        ],
      },
    ],
    seoDelegation: true,
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
    subtitle: 'Manage team member profile, contact details, and visibility.',
    badge: 'Team',
    sections: [
      {
        title: 'Profile',
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', required: true },
          { name: 'position', label: 'Position', type: 'text' },
          { name: 'department', label: 'Department', type: 'text' },
          {
            name: 'teamCategoryId',
            label: 'Category',
            type: 'select',
            required: true,
            options: [],
            helper: 'Controls the public Team Members grouping and card border colour.',
          },
          { name: 'experience', label: 'Experience', type: 'text' },
        ],
      },
      {
        title: 'Media',
        fields: [
          { name: 'photo', label: 'Profile Photo', type: 'cover', fullWidth: true },
        ],
      },
      {
        title: 'Contact',
        fields: [
          { name: 'email', label: 'Email', type: 'text' },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          { name: 'status', label: 'Status', type: 'select', options: ['active', 'hidden'] },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
        ],
      },
    ],
    seoDelegation: true,
  },

  'team-categories': {
    addTitle: 'Add Team Category',
    editTitle: 'Edit Team Category',
    subtitle: 'Define directory groups and card border colours for the public team page.',
    badge: 'Team Categories',
    sections: [
      {
        title: 'Category Details',
        fields: [
          { name: 'name', label: 'Category Name', type: 'text', required: true },
          { name: 'slug', label: 'Slug', type: 'text', helper: 'Auto-generated from the name when left blank.' },
          { name: 'description', label: 'Description', type: 'textarea', rows: 3, fullWidth: true },
          {
            name: 'parentId',
            label: 'Parent Category',
            type: 'select',
            options: [{ value: '', label: 'None' }],
            helper: 'Optional. Reserved for future nested groupings.',
          },
        ],
      },
      {
        title: 'Appearance',
        fields: [
          {
            name: 'borderColor',
            label: 'Border Color',
            type: 'color',
            required: true,
            previewTitleField: 'name',
            fullWidth: true,
          },
          { name: 'icon', label: 'Icon', type: 'cover', fullWidth: true },
        ],
      },
      {
        title: 'Publishing',
        fields: [
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
          },
          { name: 'displayOrder', label: 'Display Order', type: 'number' },
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
