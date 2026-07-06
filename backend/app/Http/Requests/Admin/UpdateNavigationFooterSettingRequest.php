<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNavigationFooterSettingRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'navigationItems' => 'navigation_items',
            'footerBrand' => 'footer_brand',
            'footerNavGroups' => 'footer_nav_groups',
            'footerQuickLinks' => 'footer_quick_links',
            'contactOffice' => 'contact_office',
            'directContacts' => 'direct_contacts',
            'socialLinks' => 'social_links',
        ]);

        if ($this->has('contact') && ! $this->has('contact_office') && ! $this->has('direct_contacts')) {
            $contact = $this->input('contact', []);

            if (is_array($contact)) {
                $this->merge([
                    'contact_office' => array_intersect_key($contact, array_flip([
                        'officeName',
                        'location',
                        'workingHours',
                    ])),
                    'direct_contacts' => array_intersect_key($contact, array_flip(['contacts'])),
                ]);
            }
        }

        if ($this->has('footer_nav_groups') || $this->has('footer_quick_links')) {
            $this->merge([
                'footer_groups' => [
                    'navGroups' => $this->input('footer_nav_groups', $this->input('footerNavGroups', [])),
                    'quickLinks' => $this->input('footer_quick_links', $this->input('footerQuickLinks', [])),
                ],
            ]);
        } elseif ($this->has('footerGroups')) {
            $this->merge(['footer_groups' => $this->input('footerGroups')]);
        }
    }

    public function rules(): array
    {
        return [
            'logo' => ['sometimes', 'nullable', 'array'],
            'navigation_items' => ['sometimes', 'nullable', 'array'],
            'footer_brand' => ['sometimes', 'nullable', 'array'],
            'footer_groups' => ['sometimes', 'nullable', 'array'],
            'contact_office' => ['sometimes', 'nullable', 'array'],
            'direct_contacts' => ['sometimes', 'nullable', 'array'],
            'social_links' => ['sometimes', 'nullable', 'array'],
            'copyright' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
