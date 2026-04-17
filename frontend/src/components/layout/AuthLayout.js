import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            {/* Header with logo */}
            <Header />

            {/* Center content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default AuthLayout;