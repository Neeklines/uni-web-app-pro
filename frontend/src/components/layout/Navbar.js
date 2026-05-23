import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const username = user?.email?.split('@')[0];
    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Title */}
                <Link
                    to="/"
                    className="text-white text-2xl font-semibold tracking-tight"
                >
                    SmartSub
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">

                    {user ? (
                        <>
                            <p className="text-sm text-gray-400">
                                Zalogowano jako{' '}
                                <span className="text-white font-medium">
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
                            <Link
                                to="/login"
                                className="
                                    text-gray-400
                                    hover:text-white
                                    px-3
                                    py-1.5
                                    rounded-md
                                    transition
                                "
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="
                                    bg-blue-500
                                    hover:bg-blue-600
                                    text-white
                                    px-4
                                    py-1.5
                                    rounded-md
                                    font-medium
                                    transition
                                "
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