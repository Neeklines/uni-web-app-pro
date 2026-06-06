import { useState } from 'react';

import {
  usePreferences,
} from '../context/UserPreferencesContext';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { theme } =
    usePreferences();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          'Nie udało się wysłać linku resetu.'
        );
      }

      setMessage(
        data.message ||
        'Jeśli konto istnieje, link został wysłany.'
      );

      setEmail('');

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
          Reset hasła
        </h1>

        <p
          className={`text-sm text-center mb-6 ${theme === 'light'
            ? 'text-[rgb(100,100,100)]'
            : 'text-gray-400'
            }`}
        >
          Podaj adres email.
        </p>

        <form
          onSubmit={handleSubmit}
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
              required
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
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading
              ? 'Wysyłanie...'
              : 'Wyślij link resetu'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ForgotPassword;