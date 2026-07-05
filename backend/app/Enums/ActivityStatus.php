<?php

namespace App\Enums;

enum ActivityStatus: string
{
    case Published = 'published';
    case Draft = 'draft';
    case Archived = 'archived';
}
