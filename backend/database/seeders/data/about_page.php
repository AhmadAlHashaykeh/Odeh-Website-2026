<?php

$office = '/assets/about/office';
$approach = '/assets/about/approach';
$history = '/assets/about/history';

return [
    'overview' => [
        'meta' => [
            'title' => 'About Us | ODEH & PARTNERS DESIGN',
            'description' => 'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision.',
        ],
        'hero' => [
            'label' => 'About Us',
            'title' => 'Overview',
            'description' => 'A global structural engineering practice delivering innovative, transformative solutions across the Middle East and beyond.',
            'backgroundImage' => $office.'/img-03.webp',
            'ariaLabel' => 'About Us Overview',
            'breadcrumbs' => [
                ['label' => 'Home', 'path' => '/'],
                ['label' => 'About Us', 'path' => '/about/overview'],
                ['label' => 'Overview'],
            ],
        ],
        'content' => [
            'title' => 'ODEH & PARTNERS DESIGN',
            'description' => 'Welcome to the online platform of ODEH & PARTNERS DESIGN, an avant-garde structural design firm with a global vision. Our practice transcends conventional boundaries as we offer ingenious solutions to ever-evolving challenges. Our success emanates from a unique approach, encompassing innovative concepts, diverse market penetrations, profound cultural insights, and ultimately, transformative solutions. The depth of knowledge that underpins our services, spanning from initial concepts to final construction, is a testament to our collective global ingenuity.',
            'image' => [
                'src' => $office.'/img-05.webp',
                'alt' => 'Engineering team collaborating at ODEH & PARTNERS DESIGN',
            ],
        ],
        'slider' => [
            'label' => 'Our Office',
            'description' => 'A glimpse into our workspace — where engineering excellence meets collaborative design.',
            'images' => [
                ['src' => $office.'/img-01.webp', 'alt' => 'Glass-partitioned workspace at ODEH & PARTNERS DESIGN'],
                ['src' => $office.'/img-02.webp', 'alt' => 'Open-plan engineering office with team at work'],
                ['src' => $office.'/img-03.webp', 'alt' => 'Modern office with floor-to-ceiling windows'],
                ['src' => $office.'/img-04.webp', 'alt' => 'Overview of the ODEH & PARTNERS DESIGN workspace'],
                ['src' => $office.'/img-05.webp', 'alt' => 'Engineers reviewing structural designs together'],
            ],
        ],
    ],
    'approach' => [
        'meta' => [
            'title' => 'Our Approach | ODEH & PARTNERS DESIGN',
            'description' => 'Discover how ODEH & PARTNERS DESIGN approaches structural engineering — through collaboration, innovation, and technical precision at every stage.',
        ],
        'hero' => [
            'label' => 'About Us',
            'title' => 'Our Approach',
            'description' => 'Engineering excellence is achieved through collaboration, innovation, and technical precision at every stage of the project lifecycle.',
            'backgroundImage' => $approach.'/hero.webp',
            'ariaLabel' => 'Our Approach',
            'breadcrumbs' => [
                ['label' => 'Home', 'path' => '/'],
                ['label' => 'About Us', 'path' => '/about/overview'],
                ['label' => 'Approach'],
            ],
        ],
        'principles' => [
            'label' => 'Engineering Principles',
            'items' => [
                ['number' => '01', 'title' => 'Turning Visions into Reality', 'description' => 'Our expertise lies in transforming creative ideas into tangible structural masterpieces.'],
                ['number' => '02', 'title' => 'Innovative and Practical Fusion', 'description' => 'We blend inventive concepts with sound engineering to create exceptional designs.'],
                ['number' => '03', 'title' => 'Building Dreams', 'description' => 'Our designs go beyond the ordinary, making architectural dreams come true.'],
                ['number' => '04', 'title' => 'Collaborative Engineering', 'description' => 'We work closely with clients and professionals for impactful structural solutions.'],
                ['number' => '05', 'title' => 'Engineering Stories Through Design', 'description' => 'Our designs narrate stories through structural form, materials, and spatial arrangements.'],
                ['number' => '06', 'title' => 'Unconventional Problem-Solving', 'description' => 'Challenges become opportunities for innovative engineering solutions.'],
                ['number' => '07', 'title' => 'Engineering Magic', 'description' => 'Our structural engineers combine technical expertise with creative thinking to craft extraordinary structures that stand the test of time.'],
            ],
        ],
    ],
    'history' => [
        'meta' => [
            'title' => 'History | ODEH & PARTNERS DESIGN',
            'description' => 'Discover the journey of ODEH & PARTNERS DESIGN — from a visionary engineer\'s beginnings to Jordan\'s leading structural engineering firm.',
        ],
        'hero' => [
            'label' => 'About Us',
            'title' => 'History',
            'description' => 'Building a legacy of structural excellence through innovation, engineering precision, and continuous growth.',
            'backgroundImage' => $history.'/hero.webp',
            'ariaLabel' => 'About Us History',
            'breadcrumbs' => [
                ['label' => 'Home', 'path' => '/'],
                ['label' => 'About Us', 'path' => '/about/overview'],
                ['label' => 'History'],
            ],
        ],
        'story' => [
            'label' => 'Our Story',
            'title' => 'Every Great Structure Begins with a Vision',
            'lead' => 'ODEH DESIGN BUREAU',
            'body' => 'The journey starts with a glimpse into the inception and growth of our office-a tale woven by the visionary engineer Mohammad Odeh. In 2006, his voyage commenced, working briefly alongside prominent corporate entities within the nation. However, the seeds of distinction were sown as his boldness in crafting uncharted designs caught their attention. Following their guidance, he embarked on an independent path, driven by unbridled design prowess. As he connected with clients and honed his skills, the turning point came in 2018. With unwavering determination, he established the office. Today, we proudly stand as Jordan\'s leading structural design firm, a testament to Engineer Mohammad Odeh\'s journey from inception to excellence-a journey that continues to shape our present and inspire our future.',
        ],
        'counters' => [
            'items' => [
                ['label' => 'Years of Experience', 'value' => '8+'],
                ['label' => 'Qualified Employees', 'value' => '30+'],
            ],
        ],
        'growthTable' => [
            'label' => 'Growth Metrics',
            'title' => '8 Years of Continuous Growth',
            'columns' => [
                ['key' => 'year', 'label' => 'Year'],
                ['key' => 'projects', 'label' => 'Completed Projects', 'align' => 'right'],
                ['key' => 'area', 'label' => 'Area of Completed Projects (m²)', 'align' => 'right'],
            ],
            'rows' => [
                ['year' => 2018, 'projects' => 85, 'area' => 160210],
                ['year' => 2019, 'projects' => 93, 'area' => 203850],
                ['year' => 2020, 'projects' => 104, 'area' => 167275],
                ['year' => 2021, 'projects' => 118, 'area' => 175754],
                ['year' => 2022, 'projects' => 130, 'area' => 406000],
                ['year' => 2023, 'projects' => 160, 'area' => 544040],
                ['year' => 2024, 'projects' => 190, 'area' => 612462],
                ['year' => 2025, 'projects' => 164, 'area' => 744242],
            ],
        ],
    ],
];
