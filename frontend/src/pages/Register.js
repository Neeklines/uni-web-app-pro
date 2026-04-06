import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useState } from 'react';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleRegister = async (email, password) => {
        try {
            await register(email, password);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md">

                <AuthForm
                    type="register"
                    onSubmit={handleRegister}
                    error={error}
                />

                <p className="text-gray-400 mt-6 text-center">
                    Masz konto?{' '}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Zaloguj się
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;