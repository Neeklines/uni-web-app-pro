import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function AuthLayout() {

    const { theme } =
        usePreferences();

    return (
        <div
            className={`min-h-screen flex flex-col ${theme === 'light'
                ? 'bg-[rgb(248,244,238)]'
                : 'bg-gray-900'
                }`}
        >

            <Header />

            <main className="flex-1 flex items-center justify-center px-4">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}

export default AuthLayout;