

function Landing() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white px-6 py-12 flex items-center justify-center">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-3xl border border-gray-700 bg-gray-950/60 p-10 shadow-xl shadow-black/20">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                        SmartSub
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl">
                        Zarządzaj swoimi subskrypcjami i stałymi wydatkami w jednym miejscu. SmartSub pomaga kontrolować miesięczne koszty,
                        śledzić aktywne usługi i planować budżet bez zbędnego stresu.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-gray-900/90 p-5 border border-gray-800">
                            <h2 className="text-xl font-semibold text-white">Wszystko w jednym</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Przechowuj subskrypcje, opłaty i stałe wydatki w jednym przejrzystym panelu.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-gray-900/90 p-5 border border-gray-800">
                            <h2 className="text-xl font-semibold text-white">Śledź wydatki</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Zobacz, ile wydajesz co miesiąc i które usługi najbardziej obciążają budżet.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-gray-900/90 p-5 border border-gray-800">
                            <h2 className="text-xl font-semibold text-white">Bezpieczny start</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Zaloguj się lub zarejestruj, aby szybko rozpocząć zarządzanie subskrypcjami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;