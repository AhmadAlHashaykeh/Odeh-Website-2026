<?php

namespace App\Support;

class UploadModuleFields
{
    /** @return array<string, array<int, string>> */
    public static function allowed(): array
    {
        return [
            'projects' => ['coverImage', 'gallery'],
            'project-categories' => ['coverImage', 'featuredImage'],
            'services' => ['image', 'icon'],
            'activities' => ['coverImage', 'gallery'],
            'team-members' => ['photo'],
            'team-categories' => ['icon'],
            'home-page' => ['posterImage', 'aboutImage'],
            'about-pages' => ['backgroundImage', 'image', 'gallery'],
            'navigation-footer' => ['logo', 'footerLogo'],
            'connect-page' => ['logo'],
            'website-settings' => ['favicon'],
            'legal-pages' => ['image'],
        ];
    }

    public static function isValidModule(string $module): bool
    {
        return array_key_exists($module, self::allowed());
    }

    public static function isValidField(string $module, string $field): bool
    {
        if (! self::isValidModule($module)) {
            return false;
        }

        return in_array($field, self::allowed()[$module], true);
    }

    public static function cmsModuleFor(string $module): ?string
    {
        return match ($module) {
            'projects' => CmsModules::PROJECTS,
            'project-categories' => CmsModules::PROJECT_CATEGORIES,
            'services' => CmsModules::SERVICES,
            'activities' => CmsModules::ACTIVITIES,
            'team-members' => CmsModules::TEAM_MEMBERS,
            'team-categories' => CmsModules::TEAM_CATEGORIES,
            'home-page' => CmsModules::HOME_PAGE,
            'about-pages' => CmsModules::ABOUT_PAGES,
            'navigation-footer' => CmsModules::NAVIGATION_FOOTER,
            'connect-page' => CmsModules::CONNECT_PAGE,
            'website-settings' => CmsModules::WEBSITE_SETTINGS,
            'legal-pages' => CmsModules::LEGAL_PAGES,
            default => null,
        };
    }
}
