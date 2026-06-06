import { Link } from 'react-router-dom';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function Header() {

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
        <header
            className={`border-b ${theme === 'light'
                ? 'border-stone-300 bg-[rgb(252,249,244)]'
                : 'border-gray-700 bg-gray-800/50'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className={`text-2xl font-semibold tracking-tight transition ${theme === 'light'
                        ? 'text-[rgb(90,65,40)] hover:text-black'
                        : 'text-white hover:text-gray-300'
                        }`}
                >
                    SmartSub
                </Link>
                <button
                    onClick={toggleTheme}
                    className={`h-9 w-9 rounded-full border text-lg transition ${theme === 'light'
                        ? 'border-stone-300 bg-[rgb(245,240,232)] hover:bg-[rgb(235,228,218)]'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                        }`}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
        </header>
    );
}

export default Header;