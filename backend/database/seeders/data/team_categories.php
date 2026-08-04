<?php

/**
 * Public team page sections:
 * - Board of Directors (leadership)
 * - Team Members (everyone else)
 *
 * border_color is section accent only; card colours come from ranks.
 */
return [
    [
        'name' => 'Board of Directors',
        'slug' => 'board-of-directors',
        'description' => null,
        'border_color' => '#1B4F9C',
        'display_order' => 1,
    ],
    [
        'name' => 'Team Members',
        'slug' => 'team-members',
        'description' => null,
        'border_color' => '#3DCF6A',
        'display_order' => 2,
    ],
    [
        'name' => 'Other Team Members',
        'slug' => 'other-team-members',
        'description' => null,
        'border_color' => '#7A7F85',
        'display_order' => 99,
    ],
];
