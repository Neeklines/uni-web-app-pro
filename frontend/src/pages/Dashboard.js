import { useAuth } from '../context/AuthContext';

const mockSubscriptions = [
    {
        id: '1',
        name: 'Netflix',
        price: 35.99,
        billing_cycle: 'monthly',
        next_payment_date: '2026-05-02',
        category: 'Entertainment',
    },
    {
        id: '2',
        name: 'Spotify',
        price: 19.99,
        billing_cycle: 'monthly',
        next_payment_date: '2026-05-05',
        category: 'Music',
    },
    {
        id: '3',
        name: 'Adobe Creative Cloud',
        price: 129.0,
        billing_cycle: 'monthly',
        next_payment_date: '2026-05-10',
        category: 'Productivity',
    },
];

function Dashboard() {
    const { user, logout } = useAuth();
    const totalMonthly = mockSubscriptions.reduce((sum, item) => sum + item.price, 0);
    const totalYearly = totalMonthly * 12;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-900 text-white px-4 py-8 sm:px-6 sm:py-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="rounded-[32px] border border-gray-700 bg-gray-950/70 p-6 sm:p-8 shadow-xl shadow-black/20">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Dashboard</p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-white break-words">
                                Witaj, {user?.email ?? 'użytkowniku'}
                            </h1>
                            <p className="mt-4 text-gray-400">
                                Tutaj możesz sprawdzić swoje aktualne subskrypcje oraz miesięczne i roczne koszty.
                                Mockowe dane służą jako tymczasowa podstawa do przyszłego panelu subskrypcji.
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 sm:w-auto"
                        >
                            Wyloguj się
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-gray-700 bg-gray-950/70 p-6 shadow-md shadow-black/10">
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Miesięczny koszt</p>
                        <p className="mt-4 text-4xl font-semibold text-white">{totalMonthly.toFixed(2)} PLN</p>
                        <p className="mt-2 text-sm text-gray-400">Suma wszystkich subskrypcji na najbliższy miesiąc.</p>
                    </div>
                    <div className="rounded-3xl border border-gray-700 bg-gray-950/70 p-6 shadow-md shadow-black/10">
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Roczny koszt</p>
                        <p className="mt-4 text-4xl font-semibold text-white">{totalYearly.toFixed(2)} PLN</p>
                        <p className="mt-2 text-sm text-gray-400">Szacowany koszt subskrypcji za 12 miesięcy.</p>
                    </div>
                </div>

                <div className="rounded-[32px] border border-gray-700 bg-gray-950/70 p-6 sm:p-8 shadow-xl shadow-black/20">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Twoje subskrypcje</p>
                            <h2 className="mt-3 text-2xl font-semibold text-white">Lista subskrypcji</h2>
                        </div>
                        <p className="text-sm text-gray-400">Wszystkie subskrypcje na podstawie danych mockowych.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {mockSubscriptions.map((subscription) => (
                            <div
                                key={subscription.id}
                                className="rounded-3xl border border-gray-800 bg-gray-900/90 p-4 sm:p-5"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-white">{subscription.name}</p>
                                        <p className="mt-1 text-sm text-gray-400">Kategoria: {subscription.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-semibold text-white">
                                            {subscription.price.toFixed(2)} PLN/mies.
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">Następna płatność: {subscription.next_payment_date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;