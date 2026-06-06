import { useState } from 'react';
import { loginSchema, registerSchema } from '../../validation/authSchemas';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function AuthForm({
    type,
    onSubmit,
    error,
    success,
    loading,
    showLoader,
    onResetError,
    children, initialEmail = '',
}) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const { theme } =
        usePreferences();

    const schema =
        type === 'login'
            ? loginSchema
            : registerSchema;

    const handleSubmit = (e) => {
        e.preventDefault();

        setValidationError('');
        onResetError?.();

        const result = schema.safeParse({
            email,
            password,
        });

        if (!result.success) {
            setValidationError(
                result.error.issues?.[0]?.message ||
                'Invalid input'
            );
            return;
        }

        onSubmit(email, password);
    };

    return (
        <div
            className={`p-8 rounded-2xl shadow-lg ${theme === 'light'
                ? 'bg-[rgb(252,249,244)] border border-stone-300'
                : 'bg-gray-800'
                }`}
        >
            <h1
                className={`text-3xl font-bold mb-6 text-center ${theme === 'light'
                    ? 'text-[rgb(90,65,40)]'
                    : 'text-white'
                    }`}
            >
                {type === 'login'
                    ? 'Logowanie'
                    : 'Rejestracja'}
            </h1>

            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
            >
                <div>
                    <label
                        htmlFor="email"
                        className={`block mb-1 ${theme === 'light'
                            ? 'text-[rgb(100,100,100)]'
                            : 'text-gray-300'
                            }`}
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light'
                            ? 'bg-[rgb(245,240,232)] border border-[rgb(220,210,195)] text-[rgb(35,35,35)]'
                            : 'bg-gray-700 text-white'
                            }`}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className={`block mb-1 ${theme === 'light'
                            ? 'text-[rgb(100,100,100)]'
                            : 'text-gray-300'
                            }`}
                    >
                        Hasło
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light'
                            ? 'bg-[rgb(245,240,232)] border border-[rgb(220,210,195)] text-[rgb(35,35,35)]'
                            : 'bg-gray-700 text-white'
                            }`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-lg font-semibold transition disabled:opacity-50
                    ${theme === 'light'
                            ? `
                            bg-[rgb(90,65,40)]
                            hover:bg-[rgb(120,95,70)]
                            text-white
                        `
                            : `
                            bg-blue-500
                            hover:bg-blue-600
                            text-white
                        `
                        }
                    `}
                >
                    {showLoader
                        ? 'Ładowanie...'
                        : type === 'login'
                            ? 'Zaloguj się'
                            : 'Zarejestruj się'}
                </button>

                {children}
            </form>

            {validationError && (
                <p className="text-red-400 mt-4 text-center">
                    {validationError}
                </p>
            )}

            {error && (
                <p className="text-yellow-500 mt-2 text-center">
                    {error}
                </p>
            )}

            {success && (
                <p className="text-green-500 mt-2 text-center">
                    {success}
                </p>
            )}
        </div>
    );
}

export default AuthForm;