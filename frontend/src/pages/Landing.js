function Landing() {

    const theme =
        localStorage.getItem('theme') || 'dark';

    return (
        <div
            className={`px-6 py-12 flex items-center justify-center ${theme === 'light'
                    ? 'bg-[rgb(248,244,238)] text-[rgb(35,35,35)]'
                    : 'bg-gray-900 text-white'
                }`}
        >
            <div className="max-w-4xl mx-auto">

                <div
                    className={`rounded-3xl p-10 shadow-xl ${theme === 'light'
                            ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/20'
                            : 'border border-gray-700 bg-gray-950/60 shadow-black/20'
                        }`}
                >

                    <h1
                        className={`text-4xl sm:text-5xl font-bold tracking-tight ${theme === 'light'
                                ? 'text-[rgb(90,65,40)]'
                                : 'text-white'
                            }`}
                    >
                        SmartSub
                    </h1>

                    <p
                        className={`mt-4 text-lg sm:text-xl max-w-3xl ${theme === 'light'
                                ? 'text-[rgb(70,70,70)]'
                                : 'text-gray-300'
                            }`}
                    >
                        Zarządzaj swoimi subskrypcjami i stałymi wydatkami w jednym miejscu.
                        SmartSub pomaga kontrolować miesięczne koszty, śledzić aktywne
                        usługi i planować budżet bez zbędnego stresu.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">

                        <div
                            className={`rounded-2xl p-5 border ${theme === 'light'
                                    ? 'bg-[rgb(245,240,232)] border-[rgb(220,210,195)]'
                                    : 'bg-gray-900/90 border-gray-800'
                                }`}
                        >
                            <h2
                                className={`text-xl font-semibold ${theme === 'light'
                                        ? 'text-[rgb(90,65,40)]'
                                        : 'text-white'
                                    }`}
                            >
                                Wszystko w jednym
                            </h2>

                            <p
                                className={`mt-2 text-sm ${theme === 'light'
                                        ? 'text-[rgb(100,100,100)]'
                                        : 'text-gray-400'
                                    }`}
                            >
                                Przechowuj subskrypcje, opłaty i stałe wydatki
                                w jednym przejrzystym panelu.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl p-5 border ${theme === 'light'
                                    ? 'bg-[rgb(245,240,232)] border-[rgb(220,210,195)]'
                                    : 'bg-gray-900/90 border-gray-800'
                                }`}
                        >
                            <h2
                                className={`text-xl font-semibold ${theme === 'light'
                                        ? 'text-[rgb(90,65,40)]'
                                        : 'text-white'
                                    }`}
                            >
                                Śledź wydatki
                            </h2>

                            <p
                                className={`mt-2 text-sm ${theme === 'light'
                                        ? 'text-[rgb(100,100,100)]'
                                        : 'text-gray-400'
                                    }`}
                            >
                                Zobacz, ile wydajesz co miesiąc i które usługi
                                najbardziej obciążają budżet.
                            </p>
                        </div>

                        <div
                            className={`rounded-2xl p-5 border ${theme === 'light'
                                    ? 'bg-[rgb(245,240,232)] border-[rgb(220,210,195)]'
                                    : 'bg-gray-900/90 border-gray-800'
                                }`}
                        >
                            <h2
                                className={`text-xl font-semibold ${theme === 'light'
                                        ? 'text-[rgb(90,65,40)]'
                                        : 'text-white'
                                    }`}
                            >
                                Bezpieczny start
                            </h2>

                            <p
                                className={`mt-2 text-sm ${theme === 'light'
                                        ? 'text-[rgb(100,100,100)]'
                                        : 'text-gray-400'
                                    }`}
                            >
                                Zaloguj się lub zarejestruj, aby szybko rozpocząć
                                zarządzanie subskrypcjami.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;