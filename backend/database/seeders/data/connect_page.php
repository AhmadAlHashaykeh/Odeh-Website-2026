<?php

return [
    'hero' => [
        'companyName' => 'ODEH & PARTNERS DESIGN',
        'description' => 'Structural Engineering & Design Excellence Across the Middle East.',
        'logoSrc' => '/odeh-logo2.png',
        'logoAlt' => 'ODEH & PARTNERS DESIGN logo',
    ],
    'tagline' => 'Structural Engineering & Design Excellence Across the Middle East.',
    'links' => [
        'meta' => [
            'title' => 'Connect | ODEH & PARTNERS DESIGN',
            'description' => 'Access all official ODEH & PARTNERS DESIGN links, contact information, social media, and company resources in one place.',
        ],
        'items' => [
            ['id' => 'website', 'title' => 'Official Website', 'subtitle' => 'Explore our full portfolio', 'icon' => 'website', 'url' => '/', 'external' => false, 'enabled' => true, 'order' => 1],
            ['id' => 'company-profile', 'title' => 'Company Profile', 'subtitle' => 'Download our profile (PDF)', 'icon' => 'document', 'url' => '/assets/company-profile.pdf', 'external' => true, 'enabled' => true, 'order' => 2],
            ['id' => 'projects', 'title' => 'Selected Projects', 'subtitle' => 'Browse our engineering work', 'icon' => 'projects', 'url' => '/projects', 'external' => false, 'enabled' => false, 'order' => 3],
            ['id' => 'careers', 'title' => 'Careers', 'subtitle' => 'Join our growing team', 'icon' => 'careers', 'url' => '/careers', 'external' => false, 'enabled' => true, 'order' => 3],
            ['id' => 'reach-out', 'title' => 'Reach Out', 'subtitle' => 'Send us a message', 'icon' => 'reach-out', 'url' => '/reach-out', 'external' => false, 'enabled' => false, 'order' => 5],
            ['id' => 'call', 'title' => 'Call Us', 'subtitle' => '+962 79 920 0301', 'icon' => 'phone', 'url' => 'tel:+962799200301', 'external' => true, 'enabled' => false, 'order' => 6],
            ['id' => 'email', 'title' => 'Email Us', 'subtitle' => 'ODEH@ODEHDESIGN.COM', 'icon' => 'email', 'url' => 'mailto:ODEH@ODEHDESIGN.COM', 'external' => true, 'enabled' => false, 'order' => 7],
            ['id' => 'whatsapp', 'title' => 'WhatsApp', 'subtitle' => 'Chat with our team', 'icon' => 'whatsapp', 'url' => 'https://wa.me/962799200301', 'external' => true, 'enabled' => false, 'order' => 8],
            ['id' => 'linkedin', 'title' => 'LinkedIn', 'subtitle' => 'Follow our company updates', 'icon' => 'linkedin', 'url' => 'https://linkedin.com', 'external' => true, 'enabled' => true, 'order' => 8],
            ['id' => 'instagram', 'title' => 'Instagram', 'subtitle' => 'See our latest work', 'icon' => 'instagram', 'url' => 'https://instagram.com', 'external' => true, 'enabled' => true, 'order' => 9],
            ['id' => 'facebook', 'title' => 'Facebook', 'subtitle' => 'Connect on Facebook', 'icon' => 'facebook', 'url' => 'https://facebook.com', 'external' => true, 'enabled' => true, 'order' => 10],
            ['id' => 'maps', 'title' => 'Google Maps', 'subtitle' => 'Find our Amman office', 'icon' => 'maps', 'url' => 'https://maps.google.com/?q=Odeh+Design+Office+Amman+Jordan', 'external' => true, 'enabled' => true, 'order' => 11],
        ],
    ],
];
