function Footer({ git }) {
    return (
        <footer className="text-center text-gray-500 text-sm mt-16 mb-6">

            <p>
                SmartSub © 2026{' '}
                <a
                    href="https://github.com/Neeklines"
                    className="text-gray-400 hover:text-white transition"
                >
                    Neeklines
                </a>
            </p>

            <p className="mt-1">
                <a
                    href="/tos"
                    className="hover:text-gray-300 transition"
                >
                    Terms of Service
                </a>{' '}
                ·{' '}
                <a
                    href="/privacy"
                    className="hover:text-gray-300 transition"
                >
                    Privacy Policy
                </a>
            </p>

            {git?.hash && (
                <p className="mt-1 text-gray-600">
                    Running commit{' '}
                    <a
                        href={`https://github.com/yourrepo/commit/${git.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-400 transition"
                    >
                        {git.hash}
                    </a>{' '}
                    deployed {git.date}
                </p>
            )}

        </footer>
    );
}

export default Footer;