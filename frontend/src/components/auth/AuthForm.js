import { useState } from 'react';
import { loginSchema, registerSchema } from '../../validation/authSchemas';
import { GoogleLogin } from '@react-oauth/google';

function AuthForm({ type, onSubmit, error, loading, showLoader, onResetError }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const schema = type === 'login' ? loginSchema : registerSchema;

    const handleSubmit = (e) => {
        e.preventDefault();

        setValidationError('');
        onResetError?.();

        const result = schema.safeParse({ email, password });

        if (!result.success) {
            setValidationError(result.error.issues?.[0]?.message || 'Invalid input');
            return;
        }

        onSubmit(email, password);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">

            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                {type === 'login' ? 'Logowanie' : 'Rejestracja'}
            </h1>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

                <div>
                    <label htmlFor="email" className="block text-gray-300 mb-1">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-300 mb-1">
                        Hasło
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition disabled:opacity-50"
                >
                    {showLoader ? 'Ładowanie...' : type === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                </button>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            console.log("Sukces! Token od Google:", credentialResponse.credential);
                         }}
                        onError={() => {
                             console.log("Logowanie Google zakończyło się niepowodzeniem");
                        }}
                    />
                </div>
            </form>

            {/* Validation error */}
            {validationError && (
                <p className="text-red-400 mt-4 text-center">
                    {validationError}
                </p>
            )}

            {/* Backend error */}
            {error && (
                <p className="text-yellow-400 mt-2 text-center">
                    {error}
                </p>
            )}

        </div>
    );
}

export default AuthForm;