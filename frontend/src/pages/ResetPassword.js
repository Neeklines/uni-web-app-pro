import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const theme =
    localStorage.getItem('theme') || 'dark';

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
      const response = await fetch('/api/auth/reset-password', {
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
        let errorMessage =
          'Nie udało się zmienić hasła.';

        if (
          Array.isArray(data.detail) &&
          data.detail.length > 0
        ) {
          errorMessage =
            data.detail[0].msg.replace(
              'Value error, ',
              ''
            );
        } else if (
          typeof data.detail === 'string'
        ) {
          errorMessage = data.detail;
        }

        throw new Error(errorMessage);
      }

      navigate('/login', {
        state: {
          resetSuccess: true,
        },
      });

    } catch (err) {
      setError(
        err.message ||
        'Wystąpił błąd.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">

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
          Ustaw nowe hasło
        </h1>

        {!token && (
          <p className="text-red-400 text-sm text-center mb-4">
            Link resetu jest nieprawidłowy.
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label
              htmlFor="newPassword"
              className={`block mb-1 ${theme === 'light'
                  ? 'text-[rgb(100,100,100)]'
                  : 'text-gray-300'
                }`}
            >
              Nowe hasło
            </label>

            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              disabled={!token}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light'
                  ? 'bg-[rgb(245,240,232)] border border-[rgb(220,210,195)] text-[rgb(35,35,35)]'
                  : 'bg-gray-700 text-white'
                }`}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={`block mb-1 ${theme === 'light'
                  ? 'text-[rgb(100,100,100)]'
                  : 'text-gray-300'
                }`}
            >
              Powtórz hasło
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              disabled={!token}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light'
                  ? 'bg-[rgb(245,240,232)] border border-[rgb(220,210,195)] text-[rgb(35,35,35)]'
                  : 'bg-gray-700 text-white'
                }`}
            />
          </div>

          {message && (
            <p className="text-green-500 text-sm text-center">
              {message}
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading
              ? 'Zapisywanie...'
              : 'Zmień hasło'}
          </button>

        </form>

        <p
          className={`mt-6 text-center ${theme === 'light'
              ? 'text-[rgb(100,100,100)]'
              : 'text-gray-400'
            }`}
        >
          <Link
            to="/login"
            className={`hover:underline ${theme === 'light'
                ? 'text-blue-600'
                : 'text-blue-400'
              }`}
          >
            Wróć do logowania
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ResetPassword;