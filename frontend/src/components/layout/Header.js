import { Link } from 'react-router-dom';

function Header() {

    const theme =
        localStorage.getItem('theme') || 'dark';

    return (
        <header
            className={`border-b ${theme === 'light'
                    ? 'border-stone-300 bg-[rgb(252,249,244)]'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <Link
                    to="/"
                    className={`text-2xl font-semibold tracking-tight transition ${theme === 'light'
                            ? 'text-[rgb(90,65,40)] hover:text-black'
                            : 'text-white hover:text-gray-300'
                        }`}
                >
                    SmartSub
                </Link>
            </div>
        </header>
    );
}

export default Header;