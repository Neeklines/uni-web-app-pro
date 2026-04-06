import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useState } from 'react';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (email, password) => {
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md">

                <AuthForm
                    type="login"
                    onSubmit={handleLogin}
                    error={error}
                />

                <p className="text-gray-400 mt-6 text-center">
                    Nie masz konta?{' '}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Zarejestruj się
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;