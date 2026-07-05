<?php

namespace App\Http\Requests\Public;

use App\Http\Requests\Concerns\MapsCamelCaseInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobApplicationRequest extends FormRequest
{
    use MapsCamelCaseInput;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mapCamelCaseInput([
            'fullName' => 'full_name',
            'yearsOfExperience' => 'years_of_experience',
            'linkedin' => 'linkedin_url',
            'coverLetter' => 'cover_letter',
        ]);
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'years_of_experience' => ['required', 'numeric', 'min:0'],
            'linkedin_url' => ['required', 'url', 'max:255'],
            'cover_letter' => ['required', 'string'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }
}
