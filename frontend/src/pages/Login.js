import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useState, useEffect } from 'react';

import {
    usePreferences,
} from '../context/UserPreferencesContext';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { theme } =
        usePreferences();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const resetSuccess = location.state?.resetSuccess || false;

    useEffect(() => {
        if (resetSuccess) {
            window.history.replaceState({}, document.title);
        }
    }, [resetSuccess]);

    const handleLogin = async (email, password) => {
        console.log('LOGIN SUBMIT FIRED', { email, password });

        setLoading(true);
        setError('');

        const timer = setTimeout(() => {
            setShowLoader(true);
        }, 200);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            clearTimeout(timer);
            setLoading(false);
            setShowLoader(false);
        }
    };

    return (
        <div className="w-full max-w-md">

            {resetSuccess && (
                <div
                    className={`mb-4 rounded-lg px-4 py-3 text-sm ${theme === 'light'
                        ? 'border border-green-300 bg-green-50 text-green-700'
                        : 'border border-green-500/30 bg-green-500/10 text-green-300'
                        }`}
                >
                    Hasło zostało pomyślnie zresetowane.
                    Możesz się teraz zalogować.
                </div>
            )}

            <AuthForm
                type="login"
                onSubmit={handleLogin}
                error={error}
                loading={loading}
                showLoader={showLoader}
                onResetError={() => setError('')}
            >
                <div
                    className={`mt-4 pt-4 text-center ${theme === 'light'
                        ? 'border-t border-stone-300'
                        : 'border-t border-gray-700/50'
                        }`}
                >
                    <Link
                        to="/forgot-password"
                        className={`text-sm transition-colors ${theme === 'light'
                            ? 'text-blue-600 hover:text-blue-700'
                            : 'text-blue-400 hover:text-blue-300'
                            }`}
                    >
                        Nie pamiętasz hasła?
                    </Link>
                </div>
            </AuthForm>

            <p
                className={`mt-6 text-center ${theme === 'light'
                    ? 'text-[rgb(100,100,100)]'
                    : 'text-gray-400'
                    }`}
            >
                Nie masz konta?{' '}
                <Link
                    to="/register"
                    className={`hover:underline ${theme === 'light'
                        ? 'text-blue-600'
                        : 'text-blue-400'
                        }`}
                >
                    Zarejestruj się
                </Link>
            </p>
        </div>
    );
}

export default Login;