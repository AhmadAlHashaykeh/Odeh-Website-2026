<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWebsiteSettingSectionRequest extends FormRequest
{
    /** @var array<string, array<int, string>> */
    private const SECTION_FIELDS = [
        'general-identity' => ['websiteName', 'websiteDescription', 'defaultLanguage', 'copyrightCompanyName'],
        'branding-favicon' => ['faviconSrc', 'favicon', 'brandName', 'primaryFont', 'heroPoster', 'heroVideo'],
        'search-placeholders' => ['pagePlaceholder', 'overlayPlaceholder', 'overlaySubtitle', 'available'],
        'search-limits' => ['suggestionsLimit', 'resultsLimit'],
        'integrations-maps' => ['googleMapsEmbedUrl', 'googleMapsExternalUrl', 'analytics'],
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $section = $this->route('section');

        return match ($section) {
            'general-identity' => [
                'websiteName' => ['sometimes', 'string', 'max:255'],
                'websiteDescription' => ['sometimes', 'nullable', 'string'],
                'defaultLanguage' => ['sometimes', 'string', 'max:10'],
                'copyrightCompanyName' => ['sometimes', 'nullable', 'string', 'max:255'],
            ],
            'branding-favicon' => [
                'faviconSrc' => ['sometimes', 'nullable', 'string', 'max:2048'],
                'favicon' => ['sometimes', 'nullable', 'array'],
                'brandName' => ['sometimes', 'nullable', 'string', 'max:255'],
                'primaryFont' => ['sometimes', 'nullable', 'string', 'max:255'],
                'heroPoster' => ['sometimes', 'nullable', 'string', 'max:2048'],
                'heroVideo' => ['sometimes', 'nullable', 'string', 'max:2048'],
            ],
            'search-placeholders' => [
                'pagePlaceholder' => ['sometimes', 'nullable', 'string', 'max:500'],
                'overlayPlaceholder' => ['sometimes', 'nullable', 'string', 'max:500'],
                'overlaySubtitle' => ['sometimes', 'nullable', 'string', 'max:500'],
                'available' => ['sometimes', 'boolean'],
            ],
            'search-limits' => [
                'suggestionsLimit' => ['sometimes', 'integer', 'min:1', 'max:100'],
                'resultsLimit' => ['sometimes', 'integer', 'min:1', 'max:500'],
            ],
            'integrations-maps' => [
                'googleMapsEmbedUrl' => ['sometimes', 'nullable', 'string', 'max:2048'],
                'googleMapsExternalUrl' => ['sometimes', 'nullable', 'string', 'max:2048'],
                'analytics' => ['sometimes', 'nullable'],
            ],
            default => [
                'section' => [Rule::in(array_keys(self::SECTION_FIELDS))],
            ],
        };
    }

    public function section(): string
    {
        return (string) $this->route('section');
    }

    /**
     * @return array<string, mixed>
     */
    public function sectionPayload(): array
    {
        return $this->validated();
    }
}
