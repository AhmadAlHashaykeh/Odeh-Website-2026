<?php

namespace App\Support;

class TeamMemberCategoryMapper
{
    /**
     * Map a team member position/title (and optional legacy fields) to a category slug.
     */
    public static function resolveSlug(?string $position, ?string $department = null, ?string $legacyCategory = null): string
    {
        $position = self::normalize($position);
        $department = self::normalize($department);
        $legacyCategory = self::normalize($legacyCategory);

        if ($department !== '') {
            if (self::includesAny($department, ['founder', 'executive', 'leadership'])) {
                return 'founders-executive-leadership';
            }
            if (self::includesAny($department, ['partner', 'director'])) {
                return 'partners-directors';
            }
            if (self::includesAny($department, ['project management', 'project controls', 'project delivery'])) {
                return 'project-management';
            }
            if (self::includesAny($department, ['structural', 'steel'])) {
                return 'structural-engineering';
            }
            if (self::includesAny($department, ['architect', 'architecture', 'design', 'interior'])) {
                return 'architecture-design';
            }
            if (self::includesAny($department, ['mep', 'mechanical', 'electrical', 'plumbing', 'hvac'])) {
                return 'mep-engineering';
            }
            if (self::includesAny($department, ['site'])) {
                return 'site-engineers';
            }
            if (self::includesAny($department, ['admin', 'administration', 'support', 'it', 'hr', 'operations', 'finance'])) {
                return 'administration-support';
            }
        }

        if (self::includesAny($position, ['founder', 'ceo', 'chief executive', 'managing director', 'president'])) {
            return 'founders-executive-leadership';
        }

        if (self::includesAny($position, ['partner', 'director']) && ! self::includesAny($position, ['site director'])) {
            return 'partners-directors';
        }

        if (self::includesAny($position, ['project manager', 'projects manager', 'programme manager', 'program manager'])) {
            return 'project-management';
        }

        if (self::includesAny($position, ['architect', 'designer', 'interior design'])) {
            return 'architecture-design';
        }

        if (self::includesAny($position, ['mep', 'mechanical engineer', 'electrical engineer', 'plumbing', 'hvac'])) {
            return 'mep-engineering';
        }

        if (self::includesAny($position, ['site engineer', 'site manager', 'resident engineer'])) {
            return 'site-engineers';
        }

        if (self::includesAny($position, ['structural', 'steel structure'])) {
            return 'structural-engineering';
        }

        if (self::includesAny($position, [
            'it support',
            'technician',
            'administrator',
            'administration',
            'receptionist',
            'office manager',
            'support',
        ])) {
            return 'administration-support';
        }

        if (self::includesAny($legacyCategory, ['leadership'])) {
            if ($position === '' || self::includesAny($position, [
                'founder', 'ceo', 'chief', 'executive', 'partner', 'director', 'president',
            ])) {
                return 'founders-executive-leadership';
            }
        }

        if (self::includesAny($legacyCategory, ['site'])) {
            return 'site-engineers';
        }

        if (self::includesAny($legacyCategory, ['support', 'technical support'])) {
            return 'administration-support';
        }

        if (self::includesAny($position, ['engineer'])) {
            return 'structural-engineering';
        }

        return 'other-team-members';
    }

    private static function normalize(?string $value): string
    {
        return trim(mb_strtolower((string) $value));
    }

    /**
     * @param  array<int, string>  $terms
     */
    private static function includesAny(string $text, array $terms): bool
    {
        foreach ($terms as $term) {
            if ($term !== '' && str_contains($text, $term)) {
                return true;
            }
        }

        return false;
    }
}
