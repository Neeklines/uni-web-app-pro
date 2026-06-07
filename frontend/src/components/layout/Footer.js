import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMeta } from '../../services/metaService';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function Footer() {
    const [meta, setMeta] = useState(null);

    const { theme } = usePreferences();

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const data = await getMeta();
                setMeta(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMeta();
    }, []);

    return (
        <footer
            className={`text-center text-sm my-6 ${theme === 'light'
                ? 'text-[rgb(100,100,100)]'
                : 'text-gray-500'
                }`}
        >
            <p>
                SmartSub © 2026{' '}
                <a
                    href="https://github.com/Neeklines"
                    className={`transition ${theme === 'light'
                        ? 'text-[rgb(90,65,40)] hover:text-black'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Yehor Timofieiev
                </a>
            </p>

            <p className="mt-1">
                <Link
                    to="/tos"
                    className={`transition ${theme === 'light'
                        ? 'text-[rgb(90,65,40)] hover:text-black'
                        : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Terms of Service
                </Link>{' '}
                ·{' '}
                <Link
                    to="/privacy"
                    className={`transition ${theme === 'light'
                        ? 'text-[rgb(90,65,40)] hover:text-black'
                        : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Privacy Policy
                </Link>
            </p>

            {meta?.env === 'dev' && (
                <p
                    className={`mt-1 ${theme === 'light'
                        ? 'text-[rgb(120,120,120)]'
                        : 'text-gray-600'
                        }`}
                >
                    Running development version
                </p>
            )}

            {meta?.env === 'prod' &&
                meta.version !== 'unknown' &&
                meta.deployed_at_formatted !== 'unknown' && (
                    <p className="mt-1">
                        Running commit{' '}
                        <a
                            href={`https://github.com/Neeklines/uni-web-app-pro/commit/${meta.version}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition ${theme === 'light'
                                ? 'text-[rgb(90,65,40)] hover:text-black'
                                : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            {meta.version_short}
                        </a>{' '}
                        deployed at {meta.deployed_at_formatted}
                    </p>
                )}
        </footer>
    );
}

export default Footer;