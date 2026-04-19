import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useState, useEffect } from 'react';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                    Hasło zostało pomyślnie zresetowane. Możesz się teraz zalogować.
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
                <div className="mt-4 pt-4 border-t border-gray-700/50 text-center">
                    <Link 
                        to="/forgot-password" 
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Nie pamiętasz hasła?
                    </Link>
                </div>
            </AuthForm>

            <p className="text-gray-400 mt-6 text-center">
                Nie masz konta?{' '}
                <Link to="/register" className="text-blue-400 hover:underline">
                    Zarejestruj się
                </Link>
            </p>
        </div>
    );
}

export default Login;