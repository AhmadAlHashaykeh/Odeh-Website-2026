<?php

namespace App\Support;

class CmsModules
{
    public const DASHBOARD = 'dashboard';

    public const PROJECTS = 'projects';

    public const PROJECT_CATEGORIES = 'project-categories';

    public const SERVICES = 'services';

    public const ACTIVITIES = 'activities';

    public const TEAM_MEMBERS = 'team-members';

    public const TEAM_CATEGORIES = 'team-categories';

    public const JOBS = 'jobs';

    public const APPLICATIONS = 'applications';

    public const CONTACT_MESSAGES = 'contact-messages';

    public const HOME_PAGE = 'home-page';

    public const ABOUT_PAGES = 'about-pages';

    public const NAVIGATION_FOOTER = 'navigation-footer';

    public const CONNECT_PAGE = 'connect-page';

    public const WEBSITE_SETTINGS = 'website-settings';

    public const LEGAL_PAGES = 'legal-pages';

    public const SEO = 'seo';

    public const USERS_ROLES = 'users-roles';

    /** @return array<int, string> */
    public static function all(): array
    {
        return [
            self::DASHBOARD,
            self::PROJECTS,
            self::PROJECT_CATEGORIES,
            self::SERVICES,
            self::ACTIVITIES,
            self::TEAM_MEMBERS,
            self::TEAM_CATEGORIES,
            self::JOBS,
            self::APPLICATIONS,
            self::CONTACT_MESSAGES,
            self::HOME_PAGE,
            self::ABOUT_PAGES,
            self::NAVIGATION_FOOTER,
            self::CONNECT_PAGE,
            self::WEBSITE_SETTINGS,
            self::LEGAL_PAGES,
            self::SEO,
            self::USERS_ROLES,
        ];
    }

    public static function isValid(string $module): bool
    {
        return in_array($module, self::all(), true);
    }
}
