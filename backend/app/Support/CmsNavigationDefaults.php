<?php

namespace App\Support;

class CmsNavigationDefaults
{
    /**
     * @return array<string, mixed>
     */
    public static function settings(): array
    {
        $logo = ['src' => '/odeh-logo2.png', 'alt' => 'ODEH & PARTNERS DESIGN'];

        $footerQuickLinks = [
            ['label' => 'Home', 'path' => '/'],
            ['label' => 'Overview', 'path' => '/about/overview'],
            ['label' => 'Approach', 'path' => '/about/approach'],
            ['label' => 'History', 'path' => '/about/history'],
            ['label' => 'Team Members', 'path' => '/about/team-members'],
            ['label' => 'Activities', 'path' => '/about/activities'],
            ['label' => 'Selected Projects', 'path' => '/projects'],
            ['label' => 'Careers', 'path' => '/careers'],
            ['label' => 'Reach Out', 'path' => '/reach-out'],
            ['label' => 'Search', 'path' => '/search'],
            ['label' => 'Privacy Policy', 'path' => '/privacy-policy'],
            ['label' => 'Terms & Conditions', 'path' => '/terms-and-conditions'],
        ];

        $contactOffice = [
            'officeName' => 'ODEH & PARTNERS DESIGN',
            'location' => 'Amman, Jordan',
            'workingHours' => [
                'days' => 'Sunday – Thursday',
                'hours' => '8:00 AM – 5:00 PM',
            ],
        ];

        $directContacts = [
            'contacts' => [
                ['email' => 'ODEH@ODEHDESIGN.COM', 'phone' => '+962799200301'],
                ['email' => 'NAJJAR@ODEHDESIGN.COM', 'phone' => '+962795728939'],
                ['email' => 'YAZAN@ODEHDESIGN.COM', 'phone' => '+962785511401'],
            ],
        ];

        return [
            'logo' => $logo,
            'navigation_items' => self::navigationItems(),
            'footer_brand' => [
                'text' => 'ODEH & PARTNERS DESIGN is a leading Design firm that combines creativity and expertise to deliver innovative solutions that transcend traditional boundaries.',
                'logo' => $logo,
            ],
            'footer_groups' => [
                'navGroups' => self::footerNavGroups($footerQuickLinks),
                'quickLinks' => $footerQuickLinks,
            ],
            'contact_office' => $contactOffice,
            'direct_contacts' => $directContacts,
            'social_links' => [
                ['label' => 'Facebook', 'href' => 'https://facebook.com', 'icon' => 'facebook'],
                ['label' => 'Instagram', 'href' => 'https://instagram.com', 'icon' => 'instagram'],
                ['label' => 'LinkedIn', 'href' => 'https://linkedin.com', 'icon' => 'linkedin'],
            ],
            'copyright' => ['companyName' => 'ODEH & PARTNERS DESIGN'],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function navigationItems(): array
    {
        $aboutDropdown = [
            ['label' => 'Overview', 'path' => '/about/overview', 'description' => 'Company profile and vision', 'icon' => 'overview'],
            ['label' => 'Approach', 'path' => '/about/approach', 'description' => 'How we deliver excellence', 'icon' => 'approach'],
            ['label' => 'History', 'path' => '/about/history', 'description' => 'Our journey since 2017', 'icon' => 'history'],
            ['label' => 'Team Members', 'path' => '/about/team-members', 'description' => 'The people behind the work', 'icon' => 'team'],
            ['label' => 'Activities', 'path' => '/about/activities', 'description' => 'Events and community', 'icon' => 'activities'],
        ];

        $navLinks = [
            ['label' => 'Home', 'path' => '/', 'dropdown' => null],
            ['label' => 'About us', 'path' => '/about/overview', 'dropdown' => $aboutDropdown],
            ['label' => 'Selected Projects', 'path' => '/projects', 'dropdown' => null],
            ['label' => 'Careers', 'path' => '/careers', 'dropdown' => null],
            ['label' => 'Reach Out', 'path' => '/reach-out', 'dropdown' => null],
        ];

        return array_map(function (array $link, int $index): array {
            $slug = trim(str_replace('/', '-', ltrim($link['path'], '/')), '-') ?: 'home';

            return [
                'id' => $link['dropdown'] ? 'nav-about-us' : 'nav-'.$slug,
                'label' => $link['label'],
                'path' => $link['path'],
                'order' => $index + 1,
                'status' => 'published',
                'visible' => true,
                'hasDropdown' => $link['dropdown'] !== null,
                'dropdown' => $link['dropdown']
                    ? array_map(function (array $item, int $subIndex): array {
                        $itemSlug = trim(str_replace('/', '-', ltrim($item['path'], '/')), '-');

                        return [
                            'id' => 'dropdown-'.$itemSlug,
                            'label' => $item['label'],
                            'path' => $item['path'],
                            'description' => $item['description'],
                            'icon' => $item['icon'],
                            'order' => $subIndex + 1,
                            'status' => 'published',
                            'visible' => true,
                        ];
                    }, $link['dropdown'], array_keys($link['dropdown']))
                    : null,
            ];
        }, $navLinks, array_keys($navLinks));
    }

    /**
     * @param  array<int, array<string, string>>  $quickLinks
     * @return array<int, array<string, mixed>>
     */
    private static function footerNavGroups(array $quickLinks): array
    {
        $linkMap = [];
        foreach ($quickLinks as $link) {
            if (! in_array($link['path'], ['/privacy-policy', '/terms'], true)) {
                $linkMap[$link['path']] = $link;
            }
        }

        $groups = [
            ['title' => 'Get Started', 'paths' => ['/', '/projects', '/careers', '/reach-out', '/search']],
            ['title' => 'About Us', 'paths' => ['/about/overview', '/about/approach', '/about/history', '/about/team-members', '/about/activities']],
        ];

        return array_map(function (array $group) use ($linkMap): array {
            return [
                'title' => $group['title'],
                'links' => array_values(array_filter(array_map(
                    fn (string $path) => $linkMap[$path] ?? null,
                    $group['paths']
                ))),
            ];
        }, $groups);
    }
}
