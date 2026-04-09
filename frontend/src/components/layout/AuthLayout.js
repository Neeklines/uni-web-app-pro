import { Outlet } from 'react-router-dom';
import Footer from './Footer';

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            {/* Center content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default AuthLayout;