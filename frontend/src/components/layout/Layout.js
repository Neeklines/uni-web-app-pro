import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {

    const theme =
        localStorage.getItem('theme') || 'dark';

    return (
        <div
            className={`min-h-screen flex flex-col ${theme === 'light'
                    ? 'bg-[rgb(248,244,238)]'
                    : 'bg-gray-900'
                }`}
        >

            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}

export default Layout;