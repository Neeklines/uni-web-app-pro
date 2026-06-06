import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import { usePreferences } from '../../context/UserPreferencesContext';

function AppLayout() {

    const { theme } = usePreferences();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundColor:
                    theme === 'light'
                        ? 'rgb(237, 228, 211)'
                        : 'rgb(17, 24, 39)'
            }}
        >

            <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AppLayout;