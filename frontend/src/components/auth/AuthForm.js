import { useState } from 'react';

function AuthForm({ type, onSubmit, error }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">

            <h1 className="text-3xl font-bold text-white mb-6 text-center">
                {type === 'login' ? 'Logowanie' : 'Rejestracja'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-1">Hasło</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
                >
                    {type === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
                </button>
            </form>

            {error && (
                <p className="text-yellow-400 mt-4 text-center">{error}</p>
            )}

        </div>
    );
}

export default AuthForm;