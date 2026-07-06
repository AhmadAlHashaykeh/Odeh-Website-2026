<?php

return [
    'general_identity' => [
        'websiteName' => 'ODEH & PARTNERS DESIGN',
        'websiteDescription' => 'ODEH & PARTNERS DESIGN — Innovative structural engineering and design solutions across the Middle East.',
        'defaultLanguage' => 'en',
        'copyrightCompanyName' => 'ODEH & PARTNERS DESIGN',
    ],
    'branding_favicon' => [
        'favicon' => ['src' => '/odeh-logo2.png', 'type' => 'image/png'],
        'brandName' => 'ODEH & PARTNERS DESIGN',
        'primaryFont' => 'Poppins',
        'heroPoster' => '/hero-poster.jpg',
        'heroVideo' => '/video-slider.mp4',
    ],
    'search_placeholders' => [
        'pagePlaceholder' => 'Search projects, activities, careers, pages...',
        'overlayPlaceholder' => 'Search projects, services, careers...',
        'overlaySubtitle' => 'Search across projects, services and careers.',
        'available' => true,
    ],
    'search_limits' => [
        'suggestionsLimit' => 8,
        'resultsLimit' => 50,
    ],
    'integrations_maps' => [
        'googleMapsEmbedUrl' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d875.2792572966247!2d35.83548932764389!3d31.99579087476341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1004033fd4f%3A0x285c02aa79e41619!2sOdeh%20Design%20Office!5e1!3m2!1sen!2sjo!4v1782622481425!5m2!1sen!2sjo',
        'googleMapsExternalUrl' => 'https://maps.google.com/?q=Odeh+Design+Office+Amman+Jordan',
        'analytics' => null,
    ],
    'public_pages' => [
        'projects' => [
            'meta' => [
                'title' => 'Selected Projects | ODEH & PARTNERS DESIGN',
                'description' => 'Discover a curated portfolio of structural engineering projects delivered across multiple sectors throughout the Middle East.',
            ],
            'hero' => [
                'label' => 'PORTFOLIO',
                'title' => 'Selected Projects',
                'description' => 'Discover a curated portfolio of structural engineering projects delivered across multiple sectors throughout the Middle East.',
                'breadcrumbs' => [
                    ['label' => 'Home', 'path' => '/'],
                    ['label' => 'Selected Projects'],
                ],
                'ariaLabel' => 'Selected Projects',
            ],
        ],
        'careers' => [
            'meta' => [
                'title' => 'Careers | ODEH & PARTNERS DESIGN',
                'description' => 'Explore career opportunities at ODEH & PARTNERS DESIGN. Join our structural engineering team and contribute to projects across the Middle East.',
            ],
            'hero' => [
                'label' => 'Careers',
                'title' => 'Build Your Future With Us',
                'description' => 'Join ODEH & PARTNERS DESIGN and contribute to structural engineering projects that shape communities across the Middle East.',
                'backgroundImage' => '/assets/careers/hero.webp',
                'breadcrumbs' => [
                    ['label' => 'Home', 'path' => '/'],
                    ['label' => 'Careers'],
                ],
                'ariaLabel' => 'Careers at ODEH & PARTNERS DESIGN',
            ],
            'intro' => [
                'title' => 'Where Engineering Talent Grows',
                'description' => 'At ODEH & PARTNERS DESIGN, we believe exceptional structures are built by exceptional people. We welcome engineers, designers, and professionals who value precision, collaboration, and continuous learning.',
            ],
            'emptyState' => [
                'heading' => 'No Open Positions at the Moment',
                'description' => 'We are always interested in meeting talented engineers and professionals. Please check back soon for future opportunities.',
                'buttonLabel' => 'Reach Out',
                'buttonTo' => '/reach-out',
            ],
        ],
        'reachOut' => [
            'meta' => [
                'title' => 'Reach Out | ODEH & PARTNERS DESIGN',
                'description' => 'Get in touch with ODEH & PARTNERS DESIGN for structural engineering, design consultation, and project inquiries.',
            ],
            'hero' => [
                'label' => 'Reach Out',
                'title' => "Let's Start a Conversation",
                'description' => "Whether you're planning a new project, looking for engineering consultation, or simply have a question, our team is here to help.",
                'backgroundImage' => '/assets/about/office/img-01.webp',
                'ariaLabel' => 'Reach Out',
                'breadcrumbs' => [
                    ['label' => 'Home', 'path' => '/'],
                    ['label' => 'Reach Out'],
                ],
            ],
            'form' => [
                'label' => 'Contact Form',
                'heading' => 'Send Us a Message',
                'description' => 'Share your project details or inquiry and our team will respond as soon as possible.',
                'submitLabel' => 'Send Message',
            ],
            'map' => [
                'heading' => 'Visit Our Office',
                'subheading' => 'Find us at our headquarters in Amman, Jordan.',
            ],
        ],
        'search' => [
            'meta' => [
                'title' => 'Search | ODEH & PARTNERS DESIGN',
                'description' => 'Search across projects, activities, careers, and pages on the ODEH & PARTNERS DESIGN website.',
            ],
            'hero' => [
                'label' => 'Search',
                'title' => 'Search Results',
                'description' => 'Find projects, activities, career opportunities, and pages across our website.',
                'backgroundImage' => '/assets/about/office/img-03.webp',
                'compact' => true,
                'breadcrumbs' => [
                    ['label' => 'Home', 'path' => '/'],
                    ['label' => 'Search'],
                ],
            ],
            'empty' => [
                'heading' => 'No results found.',
                'primaryLabel' => 'Return Home',
                'primaryTo' => '/',
            ],
        ],
        'thankYou' => [
            'meta' => [
                'title' => 'Thank You | ODEH & PARTNERS DESIGN',
                'description' => 'Thank you for contacting ODEH & PARTNERS DESIGN. We have received your submission and will respond shortly.',
            ],
            'default' => [
                'label' => 'Confirmation',
                'heading' => 'Thank You!',
                'description' => 'Your message has been received successfully. A member of our team will review your submission and respond as soon as possible.',
                'primaryLabel' => 'Return Home',
                'primaryTo' => '/',
                'secondaryLabel' => 'Explore Projects',
                'secondaryTo' => '/projects',
            ],
            'contact' => [
                'description' => 'Thank you for reaching out. Your inquiry has been received and our team will get back to you shortly.',
            ],
            'career' => [
                'description' => 'Thank you for your application. We have received your submission and will review your profile for the role.',
                'secondaryLabel' => 'View Careers',
                'secondaryTo' => '/careers',
            ],
            'quotation' => [
                'description' => 'Thank you for your quotation request. Our team will review your project details and contact you to discuss next steps.',
            ],
        ],
    ],
];
