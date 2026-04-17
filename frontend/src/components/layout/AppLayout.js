import { Outlet } from 'react-router-dom';
import Footer from './Footer';

function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AppLayout;