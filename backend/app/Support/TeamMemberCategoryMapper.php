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
            if (self::includesAny($department, ['board', 'director', 'founder', 'executive', 'leadership'])) {
                return 'board-of-directors';
            }

            return 'team-members';
        }

        if (self::includesAny($position, ['founder', 'ceo', 'associate partner', 'project & design manager'])) {
            return 'board-of-directors';
        }

        if (self::includesAny($legacyCategory, ['board', 'founder', 'partner', 'director', 'executive'])) {
            return 'board-of-directors';
        }

        return 'team-members';
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
