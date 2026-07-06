<?php

return [
    'hero' => [
        'id' => 'hero',
        'badge' => 'Trusted Structural Engineering Partner Across the Middle East',
        'headingMain' => 'ODEH & PARTNERS',
        'headingAccent' => 'DESIGN',
        'description' => 'Delivering innovative structural engineering and design solutions across the Middle East with expertise, precision, and sustainability.',
        'stats' => [
            ['value' => '1000+', 'label' => 'Projects Delivered'],
            ['value' => '7+', 'label' => 'Years of Practice'],
            ['value' => 'Middle East', 'label' => 'Regional Focus'],
        ],
        'primaryCta' => ['label' => 'Explore Projects', 'path' => '/projects'],
        'secondaryCta' => ['label' => 'Reach Out', 'path' => '/reach-out'],
        'posterImage' => '/hero-poster.jpg',
        'videoSrc' => '/video-slider.mp4',
    ],
    'about' => [
        'id' => 'about',
        'sectionLabel' => 'About Us',
        'titleMain' => 'ODEH &',
        'titleAccent' => 'PARTNERS DESIGN',
        'body' => 'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision. Our practice transcends conventional boundaries by delivering innovative engineering solutions backed by technical expertise, cultural insight, and a commitment to excellence. From concept to construction, we create sustainable structures that shape the future of the built environment.',
        'stats' => [
            ['value' => '7+', 'label' => 'Years of Excellence'],
            ['value' => '1000+', 'label' => 'Projects Completed'],
        ],
        'image' => '/assets/about/odeh-about-office.webp',
        'imageAlt' => 'ODEH & PARTNERS DESIGN workspace',
        'readMoreLabel' => 'Read More',
        'readMorePath' => '/about/overview',
    ],
    'services' => [
        'id' => 'services',
        'sectionLabel' => 'What We Do',
        'heading' => 'Our Services',
        'description' => "A dedicated section showcasing the company's primary engineering and consulting services.",
        'services' => [
            ['id' => 'design-solutions', 'title' => 'Design Solutions', 'description' => 'Expert design services for concrete and steel elements.', 'image' => '/assets/services/design-solutions.webp', 'path' => '/services/design-solutions', 'order' => 1],
            ['id' => 'site-supervision', 'title' => 'Site Supervision', 'description' => 'Oversee construction processes on-site to ensure design integrity.', 'image' => '/assets/services/site-supervision.webp', 'path' => '/services/site-supervision', 'order' => 2],
            ['id' => 'bim-services', 'title' => 'BIM Services', 'description' => '3D modeling, 4D/5D visualizations for all the project targets.', 'image' => '/assets/services/bim-services.webp', 'path' => '/services/bim-services', 'order' => 3],
            ['id' => 'design-review', 'title' => 'Design Review', 'description' => 'Conduct comprehensive reviews of technical designs.', 'image' => '/assets/services/design-review.webp', 'path' => '/services/design-review', 'order' => 4],
            ['id' => 'quantity-estimation', 'title' => 'Quantity Estimation', 'description' => 'Quantity estimation services to support project planning.', 'image' => '/assets/services/quantity-estimation.webp', 'path' => '/services/quantity-estimation', 'order' => 5],
            ['id' => 'university-engagements', 'title' => 'University Engagements', 'description' => 'Lectures at Jordanian universities to share industry insights & knowledge.', 'image' => '/assets/services/university-engagements.webp', 'path' => '/services/university-engagements', 'order' => 6],
            ['id' => 'retrofitting', 'title' => 'Retrofitting', 'description' => 'Specialized in retrofitting and modernizing existing structures.', 'image' => '/assets/services/retrofitting.webp', 'path' => '/services/retrofitting', 'order' => 7],
        ],
    ],
    'projects' => [
        'id' => 'projects',
        'sectionLabel' => 'Selected Projects',
        'heading' => 'Engineering Excellence Across the Middle East',
        'description' => 'Landmark structures and infrastructure delivered with precision — a curated selection from our portfolio across the region.',
        'projects' => [
            ['id' => 'himmeh-resort', 'title' => 'Himmeh Resort', 'category' => 'Resorts & Hotels', 'location' => 'Jordan', 'description' => 'The main challenges in the design were the arch vaults (the larger of which is over 7m high), multiple cross vaults, tapered cantilevers, and variable thickness slabs.', 'image' => '/assets/projects/himmeh-resort/cover.webp', 'slug' => 'himmeh-resort', 'categorySlug' => 'resorts-and-hotels', 'order' => 1],
            ['id' => 'leen-park', 'title' => 'Leen Park', 'category' => 'Resorts & Hotels', 'location' => 'Jordan, Dead Sea', 'description' => 'A collection of chalets designed with a luxurious touch, offering premium services in the Dead Sea area.', 'image' => '/assets/projects/leen-park/cover.webp', 'slug' => 'leen-park', 'categorySlug' => 'resorts-and-hotels', 'order' => 2],
            ['id' => 'fairmont-hotel', 'title' => 'Fairmont Hotel', 'category' => 'Resorts & Hotels', 'location' => 'Jordan, Amman', 'description' => 'A landmark hospitality project featuring complex structural systems and premium finishes in the heart of Amman.', 'image' => '/assets/projects/fairmont-hotel/cover.webp', 'slug' => 'fairmont-hotel', 'categorySlug' => 'resorts-and-hotels', 'order' => 3],
        ],
        'viewAllLabel' => 'View All Projects',
        'viewAllPath' => '/projects',
    ],
];
