import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function Navbar() {
    const { user, logout } = useAuth();
    const username = user?.email?.split('@')[0];

    const {
        theme,
        setTheme,
    } = usePreferences();

    const toggleTheme = () => {
        setTheme(
            theme === 'dark'
                ? 'light'
                : 'dark'
        );
    };

    return (
        <nav
            className={`border-b ${theme === 'light'
                ? 'bg-[rgb(252,249,244)] border-stone-300'
                : 'bg-gray-800 border-gray-700'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Title */}
                <Link
                    to="/"
                    className={`text-2xl font-semibold tracking-tight ${theme === 'light'
                        ? 'text-[rgb(90,65,40)]'
                        : 'text-white'
                        }`}
                >
                    SmartSub
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {user ? (
                        <>
                            <p
                                className={`text-sm ${theme === 'light'
                                    ? 'text-[rgb(100,100,100)]'
                                    : 'text-gray-400'
                                    }`}
                            >
                                Zalogowano jako{' '}
                                <span
                                    className={`font-medium ${theme === 'light'
                                        ? 'text-[rgb(90,65,40)]'
                                        : 'text-white'
                                        }`}
                                >
                                    {username}
                                </span>
                            </p>

                            <button
                                onClick={logout}
                                className="
                                    bg-red-500
                                    hover:bg-red-600
                                    text-white
                                    px-4
                                    py-1.5
                                    rounded-md
                                    font-medium
                                    transition
                                "
                            >
                                Wyloguj
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={toggleTheme}
                                className={`h-9 w-9 rounded-full border text-lg transition ${theme === 'light'
                                    ? 'border-stone-300 bg-[rgb(245,240,232)] hover:bg-[rgb(235,228,218)]'
                                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                                    }`}
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            <Link
                                to="/login"
                                className={`px-3 py-1.5 rounded-md transition ${theme === 'light'
                                    ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className={`
                                    ${theme === 'light'
                                        ? `
                                            bg-[rgb(90,65,40)]
                                            hover:bg-[rgb(120,95,70)]
                                            text-white
                                        `
                                        : `
                                            bg-blue-500
                                            hover:bg-blue-600
                                            text-white
                                        `
                                    }
                                    px-4
                                    py-1.5
                                    rounded-md
                                    font-medium
                                    transition
                                `}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;