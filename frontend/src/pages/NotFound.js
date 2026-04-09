import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="text-center text-white py-20">

            <h1 className="text-6xl font-bold mb-4">404</h1>

            <p className="text-gray-400 mb-6">
                Strona nie istnieje
            </p>

            <Link
                to="/"
                className="text-blue-400 hover:underline"
            >
                Wróć na stronę główną
            </Link>

        </div>
    );
}

export default NotFound;