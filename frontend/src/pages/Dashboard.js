import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import * as subscriptionService from '../services/subscriptionService';

function Dashboard() {
    const { user, logout, token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        billing_cycle: 'monthly',
        next_payment_date: '',
        category: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const fetchSubscriptions = async () => {
        if (!token) return;

        try {
            const data = await subscriptionService.getSubscriptions(token);
            setSubscriptions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [token]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        try {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price),
                next_payment_date: new Date(formData.next_payment_date).toISOString().split('T')[0],
            };

            await subscriptionService.createSubscription(token, submissionData);
            await fetchSubscriptions();

            // Reset form
            setFormData({
                name: '',
                price: '',
                billing_cycle: 'monthly',
                next_payment_date: '',
                category: '',
            });
            setShowAddForm(false);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const totalMonthly = subscriptions.reduce((sum, item) => sum + item.price, 0);
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

                {/* DUMMY FORM - Easy to remove later */}
                <div className="rounded-[32px] border border-gray-700 bg-gray-950/70 p-6 sm:p-8 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Dodaj subskrypcję (test)</h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {showAddForm ? 'Ukryj formularz' : 'Pokaż formularz'}
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nazwa
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="np. Netflix"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Cena (PLN)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleFormChange}
                                        required
                                        step="0.01"
                                        min="0"
                                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Cykl rozliczeniowy
                                    </label>
                                    <select
                                        name="billing_cycle"
                                        value={formData.billing_cycle}
                                        onChange={handleFormChange}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="monthly">Miesięczny</option>
                                        <option value="yearly">Roczny</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Następna płatność
                                    </label>
                                    <input
                                        type="date"
                                        name="next_payment_date"
                                        value={formData.next_payment_date}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kategoria
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="np. Rozrywka"
                                />
                            </div>

                            {formError && (
                                <p className="text-red-400 text-sm">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formLoading ? 'Dodawanie...' : 'Dodaj subskrypcję'}
                            </button>
                        </form>
                    )}
                </div>
                {/* END DUMMY FORM */}

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
                        <p className="text-sm text-gray-400">Wszystkie Twoje subskrypcje.</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {loading ? (
                            <p className="text-gray-400">Ładowanie subskrypcji...</p>
                        ) : error ? (
                            <p className="text-red-400">Błąd: {error}</p>
                        ) : subscriptions.length === 0 ? (
                            <p className="text-gray-400">Brak subskrypcji do wyświetlenia.</p>
                        ) : (
                            subscriptions.map((subscription) => (
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;