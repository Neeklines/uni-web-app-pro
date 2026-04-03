import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">

            <Navbar />

            <main className="flex-1">
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default Layout;