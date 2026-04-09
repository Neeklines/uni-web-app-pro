import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useState } from 'react';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError('');

        // 👇 delay showing loader
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

            <AuthForm
                type="login"
                onSubmit={handleLogin}
                error={error}
                loading={loading}
                showLoader={showLoader}
                onResetError={() => setError('')}
            />

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