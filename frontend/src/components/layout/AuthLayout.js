import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Footer from './Footer';

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            {/* Header with logo */}
            <header className="border-b border-gray-700 bg-gray-800/50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <Link
                        to="/"
                        className="text-white text-2xl font-semibold tracking-tight hover:text-gray-300 transition"
                    >
                        SmartSub
                    </Link>
                </div>
            </header>

            {/* Center content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default AuthLayout;