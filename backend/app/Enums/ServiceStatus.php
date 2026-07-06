<?php

namespace App\Enums;

enum ServiceStatus: string
{
    case Published = 'published';
    case Draft = 'draft';
    case Hidden = 'hidden';
}
