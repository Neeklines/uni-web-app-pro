import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import * as subscriptionService from '../services/subscriptionService';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import amazonPrimeLogo from '../logos/amazon_prime_logo.png';
import appleTVLogo from '../logos/apple_TV_plus_logo.png';
import canalLogo from '../logos/canal_+_logo.png';
import cdaLogo from '../logos/cda_logo.png';
import disneyPlusLogo from '../logos/disney_plus_logo.png';
import duolingoLogo from '../logos/duolingo_logo.png';
import hboMaxLogo from '../logos/hbo_max_logo.png';
import netflixLogo from '../logos/netflix_logo.png';
import playerLogo from '../logos/player_logo.png';
import skyshowtimeLogo from '../logos/skyshowtime_logo.png';
import spotifyLogo from '../logos/spotify_logo.png';
import youtubeLogo from '../logos/youtube_logo.png';

function Dashboard() {
    const { user, logout, token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [sortMode, setSortMode] = useState('name-asc');
    const [showSortPopup, setShowSortPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        billing_cycle: 'monthly',
        next_payment_date: '',
        category: '',
        is_pinned: false,
        is_favourite: false,
        notes: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [upcomingPayments, setUpcomingPayments] = useState([]);

    const predefinedLogos = [
        { id: 'amazon_prime', label: 'Amazon Prime', src: amazonPrimeLogo },
        { id: 'apple_tv', label: 'Apple TV+', src: appleTVLogo },
        { id: 'canal_plus', label: 'Canal+', src: canalLogo },
        { id: 'cda', label: 'CDA', src: cdaLogo },
        { id: 'disney_plus', label: 'Disney+', src: disneyPlusLogo },
        { id: 'duolingo', label: 'Duolingo', src: duolingoLogo },
        { id: 'hbo_max', label: 'HBO Max', src: hboMaxLogo },
        { id: 'netflix', label: 'Netflix', src: netflixLogo },
        { id: 'player', label: 'Player', src: playerLogo },
        { id: 'skyshowtime', label: 'SkyShowtime', src: skyshowtimeLogo },
        { id: 'spotify', label: 'Spotify', src: spotifyLogo },
        { id: 'youtube', label: 'YouTube', src: youtubeLogo },
    ];

    const getLogoSrc = (subscription) => {
        const logoItem = predefinedLogos.find(logo => logo.label === subscription.name);
        return logoItem ? logoItem.src : null;
    };

    const fetchSubscriptions = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const data = await subscriptionService.getSubscriptions(token);
            setSubscriptions(data);

            const popupAlreadyShown = sessionStorage.getItem('popupShown');
            if (popupAlreadyShown) return;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const in7Days = new Date(today);
            in7Days.setDate(in7Days.getDate() + 7);

            const upcoming = data.filter((sub) => {
                const payDate = new Date(sub.next_payment_date);
                const isActive = sub.is_active !== false;

                return isActive && payDate >= today && payDate <= in7Days;
            });


            setUpcomingPayments(upcoming);
            setShowPopup(true);

            sessionStorage.setItem('popupShown', 'true');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            billing_cycle: 'monthly',
            next_payment_date: '',
            category: '',
            is_pinned: false,
            is_favourite: false,
            notes: '',
            selectedPredefined: 'custom',
        });
        setEditingSubscription(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        if (!isNextPaymentDateValid(formData.next_payment_date)) {
            setFormError('Data następnej płatności musi być dzisiaj lub później.');
            setFormLoading(false);
            return;
        }

        if (formData.logoType === 'custom' && !formData.custom_logo_url.trim()) {
            setFormError('Podaj adres URL logo lub wybierz logo z listy.');
            setFormLoading(false);
            return;
        }

        try {
            const submissionData = {
                name: formData.name,
                price: parseFloat(formData.price),
                billing_cycle: formData.billing_cycle,
                next_payment_date: new Date(formData.next_payment_date).toISOString().split('T')[0],
                category: formData.category,
                is_pinned: formData.is_pinned,
                is_favourite: formData.is_favourite,
                notes: formData.notes,
            };

            await subscriptionService.createSubscription(token, submissionData);
            await fetchSubscriptions();

            resetForm();
            setShowAddForm(false);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubscription = (subscription) => {
        const isPredefined = predefinedLogos.some(logo => logo.label === subscription.name);
        setEditingSubscription(subscription);
        setFormData({
            name: subscription.name,
            price: subscription.price.toString(),
            billing_cycle: subscription.billing_cycle,
            next_payment_date: subscription.next_payment_date,
            category: subscription.category,
            is_pinned: subscription.is_pinned ?? false,
            is_favourite: subscription.is_favourite ?? false,
            notes: subscription.notes ?? '',
            selectedPredefined: isPredefined ? subscription.name : 'custom',
        });
        setShowAddForm(true);
    };

    const handleDeleteSubscription = async (subscriptionId) => {
        try {
            await subscriptionService.deleteSubscription(token, subscriptionId);
            await fetchSubscriptions();
            setShowDeleteConfirm(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        try {
            await subscriptionService.cancelSubscription(token, subscriptionId);
            await fetchSubscriptions();
            setShowDeleteConfirm(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateSubscription = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        if (!isNextPaymentDateValid(formData.next_payment_date)) {
            setFormError('Data następnej płatności musi być dzisiaj lub później.');
            setFormLoading(false);
            return;
        }

        if (formData.logoType === 'custom' && !formData.custom_logo_url.trim()) {
            setFormError('Podaj adres URL logo lub wybierz logo z listy.');
            setFormLoading(false);
            return;
        }

        try {
            const submissionData = {
                name: formData.name,
                price: parseFloat(formData.price),
                billing_cycle: formData.billing_cycle,
                next_payment_date: new Date(formData.next_payment_date).toISOString().split('T')[0],
                category: formData.category,
                is_pinned: formData.is_pinned,
                is_favourite: formData.is_favourite,
                notes: formData.notes,
            };

            await subscriptionService.updateSubscription(token, editingSubscription.id, submissionData);
            await fetchSubscriptions();

            resetForm();
            setShowAddForm(false);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setFormLoading(false);
        }
    };



    const toggleFavorite = async (subscriptionId) => {
        const sub = subscriptions.find(s => s.id === subscriptionId);
        if (!sub) return;
        try {
            await subscriptionService.updateSubscription(token, subscriptionId, { is_favourite: !sub.is_favourite });
            await fetchSubscriptions();
        } catch (err) {
            setError(err.message);
        }
    };

    const totalMonthly = subscriptions.reduce((sum, item) => sum + item.price, 0);
    const totalYearly = totalMonthly * 12;

    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
        // First, sort by is_favourite (true first)
        const favDiff = (b.is_favourite ? 1 : 0) - (a.is_favourite ? 1 : 0);
        if (favDiff !== 0) return favDiff;

        // Then, sort by is_active (true first, so active at top)
        const activeDiff = (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        if (activeDiff !== 0) return activeDiff;

        // Then, by sort mode
        switch (sortMode) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'date-asc':
                return new Date(a.next_payment_date) - new Date(b.next_payment_date);
            case 'date-desc':
                return new Date(b.next_payment_date) - new Date(a.next_payment_date);
            default:
                return 0;
        }
    });

    const filteredSubscriptions = sortedSubscriptions.filter(subscription =>
        subscription.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    const getSortIcon = () => {
        switch (sortMode) {
            case 'name-asc': return 'A-Z↑';
            case 'name-desc': return 'A-Z↓';
            case 'price-asc': return '↑ Cena';
            case 'price-desc': return '↓ Cena';
            case 'date-asc': return '↑ 🕒';
            case 'date-desc': return '↓ 🕒';
            default: return 'A↑';
        }
    };

    const isNextPaymentDateValid = (dateValue) => {
        if (!dateValue) return false;
        const selectedDate = new Date(dateValue);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    };

    const isPageLoading = loading || !user;

    return (
        <>
            <FullScreenLoader show={isPageLoading} />

            {showPopup && (
                <div className="fixed top-5 right-5 z-50 bg-gray-950/70 border border-gray-700 shadow-xl shadow-black/20 rounded-[32px] p-6 w-80">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm uppercase tracking-[0.15em] text-blue-400 whitespace-nowrap">
                            Nadchodzące płatności
                        </p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="text-gray-400 hover:text-white text-xl leading-none ml-4 flex-shrink-0"
                        >
                            ×
                        </button>
                    </div>
                    {upcomingPayments.length === 0 ? (
                        <p className="text-gray-400 text-sm">Brak nadchodzących płatności</p>
                    ) : (
                        <ul className="space-y-3">
                            {upcomingPayments.map((sub) => (
                                <li key={sub.id} className="rounded-3xl border border-gray-800 bg-gray-900/90 px-4 py-3 flex justify-between text-sm">
                                    <span className="text-white font-semibold">{sub.name}</span>
                                    <span className="text-gray-400">
                                        {new Date(sub.next_payment_date).toLocaleDateString('en-GB')}
                                    </span>                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="bg-gray-900 text-white px-4 py-8 sm:px-6 sm:py-12">
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
                                onClick={() => {
                                    sessionStorage.removeItem('popupShown');
                                    logout();
                                }}
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
                            <div className="flex gap-2 relative">
                                <button
                                    onClick={() => setShowSortPopup(!showSortPopup)}
                                    className="rounded-full bg-gray-600 px-4 py-2 text-white font-semibold hover:bg-gray-500 transition"
                                >
                                    {getSortIcon()}
                                </button>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="rounded-full bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-400 transition"
                                >
                                    +
                                </button>
                                {showSortPopup && (
                                    <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg p-2 z-10 min-w-[120px]">
                                        <button onClick={() => { setSortMode('name-asc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">A-Z↑</button>
                                        <button onClick={() => { setSortMode('name-desc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">A-Z↓</button>
                                        <button onClick={() => { setSortMode('price-asc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">↑ Cena</button>
                                        <button onClick={() => { setSortMode('price-desc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">↓ Cena</button>
                                        <button onClick={() => { setSortMode('date-asc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">↑🕒 </button>
                                        <button onClick={() => { setSortMode('date-desc'); setShowSortPopup(false); }} className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-white">↓ 🕒</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Szukaj subskrypcji..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mt-6 space-y-4">
                            {loading ? (
                                <p className="text-gray-400">Ładowanie subskrypcji...</p>
                            ) : error ? (
                                <p className="text-red-400">Błąd: {error}</p>
                            ) : subscriptions.length === 0 ? (
                                <p className="text-gray-400">Brak subskrypcji do wyświetlenia.</p>
                            ) : filteredSubscriptions.length === 0 ? (
                                <p className="text-gray-400">Nie znaleziono subskrypcji.</p>
                            ) : (
                                filteredSubscriptions.map((subscription) => {
                                    const logoSrc = getLogoSrc(subscription);
                                    return (
                                        <div
                                            key={subscription.id}
                                            className={`rounded-3xl border border-gray-800 bg-gray-900/90 p-4 sm:p-5 relative ${!subscription.is_active ? 'opacity-50' : ''}`}
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="h-14 w-14 rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                                                        {logoSrc ? (
                                                            <img src={logoSrc} alt={subscription.name} className="h-full w-full object-contain" />
                                                        ) : (
                                                            <span className="text-white text-lg font-semibold">
                                                                {subscription.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-lg font-semibold text-white">{subscription.name}</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleFavorite(subscription.id)}
                                                                className={`text-xl transition ${subscription.is_favourite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                                                            >
                                                                {subscription.is_favourite ? '★' : '☆'}
                                                            </button>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-400">Kategoria: {subscription.category}</p>
                                                        {subscription.notes && (
                                                            <p className="mt-1 text-sm text-gray-400">Notatki: {subscription.notes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-semibold text-white">
                                                        {subscription.price.toFixed(2)} PLN/mies.
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-400">Następna płatność: {subscription.next_payment_date}</p>
                                                </div>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(showDeleteConfirm === subscription.id ? null : subscription.id)}
                                                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition"
                                                    >
                                                        ⋯
                                                    </button>
                                                    {showDeleteConfirm === subscription.id && (
                                                        <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg p-2 z-10 min-w-[120px]">
                                                            <button
                                                                onClick={() => handleEditSubscription(subscription)}
                                                                className="block w-full text-left px-3 py-2 hover:bg-gray-700 text-white rounded"
                                                            >
                                                                Edytuj
                                                            </button>
                                                            {subscription.is_active ? (
                                                                <button
                                                                    onClick={() => handleCancelSubscription(subscription.id)}
                                                                    className="block w-full text-left px-3 py-2 hover:bg-red-700 text-red-400 hover:text-red-300 rounded"
                                                                >
                                                                    Anuluj
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleDeleteSubscription(subscription.id)}
                                                                    className="block w-full text-left px-3 py-2 hover:bg-red-700 text-red-400 hover:text-red-300 rounded"
                                                                >
                                                                    Usuń
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                }}>
                    <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-white">
                                {editingSubscription ? 'Edytuj subskrypcję' : 'Dodaj subskrypcję'}
                            </h2>
                            <button onClick={() => {
                                setShowAddForm(false);
                                resetForm();
                            }} className="text-gray-400 hover:text-white text-2xl">×</button>
                        </div>
                        <form onSubmit={editingSubscription ? handleUpdateSubscription : handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Predefiniowana subskrypcja
                                </label>
                                <select
                                    value={formData.selectedPredefined || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'custom') {
                                            setFormData(prev => ({ ...prev, selectedPredefined: 'custom', name: '' }));
                                        } else {
                                            const logoItem = predefinedLogos.find(logo => logo.label === value);
                                            setFormData(prev => ({ ...prev, selectedPredefined: value, name: value }));
                                        }
                                    }}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="custom">Własna</option>
                                    {predefinedLogos.map((logo) => (
                                        <option key={logo.id} value={logo.label}>{logo.label}</option>
                                    ))}
                                </select>
                            </div>

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
                                        disabled={formData.selectedPredefined && formData.selectedPredefined !== 'custom'}
                                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                        placeholder="np. Netflix"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Cena
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
                                    required
                                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="np. Rozrywka"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Notatki
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Dodatkowe notatki..."
                                    rows="3"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex items-center gap-3 text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="is_pinned"
                                        checked={formData.is_pinned}
                                        onChange={handleFormChange}
                                        className="accent-blue-500"
                                    />
                                    Przypięte
                                </label>
                                <label className="flex items-center gap-3 text-gray-300">
                                    <input
                                        type="checkbox"
                                        name="is_favourite"
                                        checked={formData.is_favourite}
                                        onChange={handleFormChange}
                                        className="accent-blue-500"
                                    />
                                    Ulubione
                                </label>
                            </div>





                            {formError && (
                                <p className="text-red-400 text-sm">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formLoading ? (editingSubscription ? 'Aktualizowanie...' : 'Dodawanie...') : (editingSubscription ? 'Aktualizuj subskrypcję' : 'Dodaj subskrypcję')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;