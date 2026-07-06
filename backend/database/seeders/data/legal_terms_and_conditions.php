<?php

$office = '/assets/about/office';

return [
    'slug' => 'terms-and-conditions',
    'title' => 'Terms & Conditions',
    'hero' => [
        'label' => 'Legal',
        'title' => 'Terms & Conditions',
        'description' => 'These terms govern your access to and use of the ODEH & PARTNERS DESIGN website and digital communications with our firm.',
        'backgroundImage' => $office.'/img-03.webp',
        'compact' => true,
        'breadcrumbs' => [
            ['label' => 'Home', 'path' => '/'],
            ['label' => 'Terms & Conditions'],
        ],
    ],
    'sections' => [
        'meta' => [
            'title' => 'Terms & Conditions | ODEH & PARTNERS DESIGN',
            'description' => 'Read the terms and conditions governing use of the ODEH & PARTNERS DESIGN website and related digital services.',
        ],
        'sections' => [
            ['id' => 'acceptance', 'title' => 'Acceptance of Terms'],
            ['id' => 'website-usage', 'title' => 'Website Usage'],
            ['id' => 'services', 'title' => 'Engineering Services'],
            ['id' => 'intellectual-property', 'title' => 'Intellectual Property'],
            ['id' => 'liability', 'title' => 'Limitation of Liability'],
            ['id' => 'privacy', 'title' => 'Privacy'],
            ['id' => 'third-party-links', 'title' => 'Third-Party Links'],
            ['id' => 'governing-law', 'title' => 'Governing Law'],
            ['id' => 'contact', 'title' => 'Contact'],
        ],
        'body' => [
            'acceptance' => [
                'By accessing or using the ODEH & PARTNERS DESIGN website ("Website"), you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the Website.',
                'We may update these terms from time to time. Continued use of the Website after changes are posted constitutes acceptance of the revised terms.',
            ],
            'website-usage' => [
                'The Website is provided for general information about ODEH & PARTNERS DESIGN, our portfolio, services, team, and career opportunities. You agree to use the Website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the Website.',
                'You must not attempt to gain unauthorized access to any part of the Website, its servers, or connected systems. You must not introduce malware, scrape content at scale without permission, or use automated tools in a way that disrupts normal operation.',
                'Information on the Website does not constitute a binding offer, professional advice, or engineering certification unless expressly confirmed in a signed agreement between you and ODEH & PARTNERS DESIGN.',
            ],
            'services' => [
                'ODEH & PARTNERS DESIGN provides structural engineering, design coordination, BIM modeling, peer review, and related professional services. Any engagement for professional services is subject to a separate proposal, scope of work, and contractual agreement.',
                'Project descriptions, images, and case studies on the Website are illustrative of our capabilities and may not reflect current availability, pricing, or jurisdictional requirements. Final deliverables, timelines, and responsibilities are defined only in signed project agreements.',
                'Submitting a contact form, quotation request, or career application does not create a client relationship, employment contract, or obligation on either party until explicitly confirmed in writing by ODEH & PARTNERS DESIGN.',
            ],
            'intellectual-property' => [
                'All content on the Website—including text, graphics, logos, photographs, drawings, models, layouts, and software—is owned by or licensed to ODEH & PARTNERS DESIGN and is protected by applicable intellectual property laws.',
                'You may view and download content for personal, non-commercial reference. You may not reproduce, distribute, modify, publicly display, or create derivative works from Website content without prior written consent, except as permitted by law.',
                'Project imagery and technical descriptions remain the property of ODEH & PARTNERS DESIGN and/or respective clients and partners. Unauthorized use of project materials may violate contractual and copyright obligations.',
            ],
            'liability' => [
                'The Website and its content are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, ODEH & PARTNERS DESIGN disclaims warranties of any kind, whether express or implied, including warranties of accuracy, completeness, merchantability, or fitness for a particular purpose.',
                'ODEH & PARTNERS DESIGN shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of the Website, reliance on Website content, or inability to access the Website, even if advised of the possibility of such damages.',
                'Nothing in these terms excludes or limits liability that cannot be excluded or limited under applicable law, including liability for fraud or willful misconduct.',
            ],
            'privacy' => [
                'Your use of the Website is also governed by our Privacy Policy, which describes how we collect, use, and safeguard personal information.',
                'By submitting forms on the Website, you confirm that the information provided is accurate to the best of your knowledge and that you are authorized to share any third-party information included in your submission.',
            ],
            'third-party-links' => [
                'The Website may contain links to third-party websites or platforms. These links are provided for convenience only. ODEH & PARTNERS DESIGN does not endorse and is not responsible for the content, policies, or practices of third-party sites.',
            ],
            'governing-law' => [
                'These Terms & Conditions are governed by the laws of the Hashemite Kingdom of Jordan, without regard to conflict-of-law principles. Any disputes arising from use of the Website shall be subject to the exclusive jurisdiction of the competent courts in Amman, Jordan, unless otherwise required by mandatory law.',
            ],
            'contact' => [
                'For questions regarding these Terms & Conditions, please contact:',
                'ODEH & PARTNERS DESIGN — Amman, Jordan',
                'Email: ODEH@ODEHDESIGN.COM',
                'Phone: +962 799 200 301',
            ],
        ],
        'lastUpdated' => 'June 28, 2026',
    ],
    'publication_status' => 'published',
];
