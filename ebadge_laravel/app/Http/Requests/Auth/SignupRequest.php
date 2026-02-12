<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


/**
 * Objet représentant une requête d'inscription
 */
class SignupRequest extends FormRequest
{
    /**
     * Définit les règles de validation pour la requête
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'required|string|unique:user,username|min:2|max:50',
            'email' => 'required|string|email|unique:user,email|min:2|max:125|regex:/^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9_\.\-]+\.[a-zA-Z0-9_\.\-]{2,4}$/',
            'password' => 'required|string|min:6|max:60',
            'first_name' => 'required|string|min:2|max:50',
            'last_name' => 'required|string|min:2|max:50',
            'teacher_code' => [
                'string',
                Rule::exists('teacher_code', 'code')->where(function ($query) {
                    $query->whereNull('user_id');
                })
            ],
        ];
    }

    /**
     * Définit les messages de validation personnalisés.
     *
     * @return array
     * @author Philippe-Vu Beaulieu
     */
    public function messages()
    {
        return [
            'teacher_code.exists' => 'Le code enseignant est invalide, expiré ou déjà utilisé.',
            'teacher_code.string' => 'Le code enseignant doit être une chaîne de caractères valide.',
        ];
    }

}

