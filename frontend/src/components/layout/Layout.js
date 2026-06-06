import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function Layout() {

    const { theme } =
        usePreferences();

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