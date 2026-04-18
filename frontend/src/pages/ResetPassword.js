import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Brak tokenu resetu w linku.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Hasła nie są takie same.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Nie udało się zmienić hasła.');
      }

      setMessage(data.message || 'Hasło zostało zmienione.');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Wystąpił błąd.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Ustaw nowe hasło
        </h1>

        {!token && (
          <p className="text-red-400 text-sm text-center mb-4">
            Link resetu jest nieprawidłowy.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-gray-300 mb-1">
              Nowe hasło
            </label>
            <input
              id="newPassword"
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={!token}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">
              Powtórz hasło
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!token}
            />
          </div>

          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Zapisywanie...' : 'Zmień hasło'}
          </button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          <Link to="/login" className="text-blue-400 hover:underline">
            Wróć do logowania
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;