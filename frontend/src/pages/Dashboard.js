import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Filter, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useRef } from 'react';
import { usePreferences } from '../context/UserPreferencesContext';
import CalendarView from '../components/calendar/CalendarView';
import SubscriptionListView from '../components/dashboard/SubscriptionListView';
import * as subscriptionService from '../services/subscriptionService';
import FullScreenLoader from '../components/ui/FullScreenLoader';
import CategoryCharts from '../components/dashboard/CategoryCharts';
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

import {
    formatPrice,
} from '../utils/formatPrice';

import {
    formatDate,
} from '../utils/formatDate';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout, token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [sortMode, setSortMode] = useState('name-asc');
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBillingCycle, setSelectedBillingCycle] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const hasActiveFilters =
        onlyFavorites ||
        selectedCategory !== 'all' ||
        selectedBillingCycle !== 'all' ||
        minPrice !== '' ||
        maxPrice !== '';

    const getResultsLabel = (count) => {

        if (count === 1) {
            return 'wynik';
        }

        if (
            count % 10 >= 2 &&
            count % 10 <= 4 &&
            (count % 100 < 12 || count % 100 > 14)
        ) {
            return 'wyniki';
        }

        return 'wyników';
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        billing_cycle: 'monthly',
        next_payment_date: '',
        category: '',
        is_favourite: false,
        notes: '',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [upcomingPayments, setUpcomingPayments] = useState([]);
    const [viewMode, setViewMode] = useState('list');
    const [activePopup, setActivePopup] = useState(null);
    const popupRef = useRef(null);

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

    const {
        currency,
        dateFormat,
        inAppNotifications,
    } = usePreferences();

    const fetchSubscriptions = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        if (!inAppNotifications) {
            return;
        }

        try {
            const data = await subscriptionService.getSubscriptions(token);
            setSubscriptions(data);
            console.log('Fetched subscriptions:', data);

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
    }, [token, inAppNotifications]);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!activePopup) return;

            if (
                popupRef.current &&
                popupRef.current.contains(event.target)
            ) {
                return;
            }

            setActivePopup(null);
        }

        document.addEventListener(
            'click',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'click',
                handleClickOutside
            );
        };
    }, [activePopup]);

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

    const handleReactivateSubscription = async (subscriptionId) => {
        try {
            await subscriptionService.reactivateSubscription(token, subscriptionId);
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

    const activeSubscriptions = subscriptions.filter((item) => item.is_active !== false);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totalMonthly = activeSubscriptions.reduce((sum, item) => {
        const price = Number(item.price) || 0;

        const paymentDate = new Date(item.next_payment_date);

        const isDueThisMonth =
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear;

        if (item.billing_cycle === 'monthly') {
            return sum + price;
        }

        if (item.billing_cycle === 'yearly' && isDueThisMonth) {
            return sum + price;
        }

        return sum;
    }, 0);

    const totalYearly = activeSubscriptions.reduce((sum, item) => {
        const price = Number(item.price) || 0;

        return sum + (
            item.billing_cycle === 'yearly'
                ? price
                : price * 12
        );
    }, 0);

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
    const categories = [
        ...new Set(
            subscriptions
                .map(sub => sub.category)
                .filter(Boolean)
        )
    ];
    const filteredSubscriptions = sortedSubscriptions.filter(subscription => {

        const matchesSearch =
            subscription.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFavorites = !onlyFavorites || subscription.is_favourite;
        const matchesCategory = selectedCategory === 'all' || subscription.category === selectedCategory;
        const matchesBillingCycle = selectedBillingCycle === 'all' || subscription.billing_cycle === selectedBillingCycle;
        const matchesMinPrice = minPrice === '' || Number(subscription.price) >= Number(minPrice);
        const matchesMaxPrice = maxPrice === '' || Number(subscription.price) <= Number(maxPrice);
        return (matchesSearch && matchesFavorites && matchesCategory && matchesBillingCycle && matchesMinPrice && matchesMaxPrice);
    });

    const getSortIcon = () => {
        switch (sortMode) {
            case 'name-asc': return 'A-Z ↑';
            case 'name-desc': return 'A-Z ↓';
            case 'price-asc': return 'Cena ↑';
            case 'price-desc': return 'Cena ↓';
            case 'date-asc': return '🕒 ↑';
            case 'date-desc': return '🕒 ↓';
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
    const { theme } = usePreferences();
    return (
        <>
            <FullScreenLoader show={isPageLoading} />

            {showPopup && (<div className={`fixed top-5 right-5 z-50 rounded-[32px] p-6 w-80 shadow-xl ${theme === 'light' ? 'bg-[rgb(252,249,244)] border border-stone-300 shadow-stone-300/20' : 'bg-gray-950/70 border border-gray-700 shadow-black/20'}`}>
                <div className="flex justify-between items-center mb-4">
                    <p className={`text-sm uppercase tracking-[0.15em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'} whitespace-nowrap`}>
                        Nadchodzące płatności
                    </p>
                    <button
                        onClick={() => setShowPopup(false)}
                        className={`text-xl leading-none ml-4 flex-shrink-0 ${theme === 'light' ? 'text-gray-500 hover:text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        ×
                    </button>
                </div>
                {upcomingPayments.length === 0 ? (
                    <p className={`text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>Brak nadchodzących płatności</p>
                ) : (
                    <ul className="space-y-3">
                        {upcomingPayments.map((sub) => (
                            <li key={sub.id} className={`rounded-3xl px-4 py-3 flex justify-between text-sm ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(245,240,232)]' : 'border border-gray-800 bg-gray-900/90'}`}>
                                <span className={`font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>{sub.name}</span>
                                <span className={`${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>{formatDate(sub.next_payment_date, dateFormat)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            )}

            <div className={`px-4 py-4 sm:px-6 sm:py-6 ${theme === 'light' ? 'bg-[rgb(237,228,211)] text-black' : 'bg-gray-900 text-white'}`}>
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className={`rounded-[32px] p-6 sm:p-8 shadow-xl ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/20' : 'border border-gray-700 bg-gray-950/70 shadow-black/20'}`}>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="text-center sm:text-left">
                                <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'}`}>Dashboard</p>
                                <h1 className={`mt-3 text-3xl sm:text-4xl font-semibold break-words ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                    Witaj, {user?.display_name || user?.email}
                                </h1>
                                <p className={`mt-4 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>
                                    Tutaj możesz sprawdzić swoje aktualne subskrypcje oraz miesięczne i roczne koszty.
                                </p>
                            </div>
                            <div className="
                                flex
                                justify-center
                                items-center
                                gap-3
                                sm:justify-start
                            ">
                                <button
                                    onClick={() => navigate('/settings')}
                                    className={`flex h-12 w-12 items-center justify-center rounded-full transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    <Settings size={20} />
                                </button>

                                <button
                                    onClick={() => {
                                        sessionStorage.removeItem(
                                            'popupShown'
                                        );

                                        logout();
                                    }}
                                    className={`
                                        rounded-full
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        transition
                                        ${theme === 'light'
                                            ? `
                                                bg-[rgb(90,65,40)]
                                                hover:bg-[rgb(120,95,70)]
                                                text-white
                                            `
                                            : `
                                                bg-blue-500
                                                hover:bg-blue-400
                                                text-white
                                            `
                                        }
                                    `}
                                >
                                    Wyloguj się
                                </button>

                                <button
                                    onClick={() => navigate('/settings')}
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center

                                        rounded-full
                                        bg-gray-800

                                        text-gray-300

                                        transition
                                        hover:bg-gray-700
                                        hover:text-white
                                    "
                                >
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className={`rounded-3xl p-6 shadow-md ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/10' : 'border border-gray-700 bg-gray-950/70 shadow-black/10'}`}>
                            <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'}`}>Miesięczny koszt</p>
                            <p className={`mt-4 text-4xl font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>{formatPrice(totalMonthly, currency)}</p>
                            <p className={`mt-2 text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>Suma wszystkich subskrypcji na najbliższy miesiąc.</p>
                        </div>
                        <div className={`rounded-3xl p-6 shadow-md ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/10' : 'border border-gray-700 bg-gray-950/70 shadow-black/10'}`}>
                            <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'}`}>Roczny koszt</p>
                            <p className={`mt-4 text-4xl font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>{formatPrice(totalYearly, currency)}</p>
                            <p className={`mt-2 text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>Szacowany koszt subskrypcji za 12 miesięcy.</p>
                        </div>
                    </div>

                    <CategoryCharts subscriptions={subscriptions} />

                    <div className={`rounded-[32px] p-6 sm:p-8 shadow-xl ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/20' : 'border border-gray-700 bg-gray-950/70 shadow-black/20'}`}>

                        {/* Toolbar */}

                        {/* Mobile */}
                        <div className="flex flex-col gap-5 sm:hidden">

                            {/* Title */}
                            <div className="text-center">
                                <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'}`}>
                                    Twoje subskrypcje
                                </p>

                                <h2 className={`mt-3 text-2xl font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                    {viewMode === 'list'
                                        ? 'Lista subskrypcji'
                                        : 'Kalendarz subskrypcji'}
                                </h2>
                            </div>

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Szukaj subskrypcji..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'}`}
                            />

                            {/* View buttons */}
                            <div className="flex justify-center gap-3">

                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-full px-4 py-2 font-semibold transition ${viewMode === 'list'
                                        ? theme === 'light'
                                            ? `
                                                bg-[rgb(90,65,40)]
                                                text-white
                                            `
                                            : `
                                                bg-blue-500
                                                text-white
                                            `
                                        : theme === 'light'
                                            ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)]'
                                            : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    Lista
                                </button>

                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`rounded-full px-4 py-2 font-semibold transition ${viewMode === 'calendar'
                                        ? theme === 'light'
                                            ? `
                                                bg-[rgb(90,65,40)]
                                                text-white
                                            `
                                            : `
                                                bg-blue-500
                                                text-white
                                            `
                                        : theme === 'light'
                                            ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)]'
                                            : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    Kalendarz
                                </button>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-center gap-3">

                                {/* SORT */}
                                <div className="relative flex items-center">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            setActivePopup((prev) =>
                                                prev === 'sort'
                                                    ? null
                                                    : 'sort'
                                            );
                                        }}
                                        className={`h-10 rounded-full px-4 font-semibold transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        {getSortIcon()}
                                    </button>

                                    {activePopup === 'sort' && (
                                        <div
                                            ref={popupRef}
                                            className={`absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 z-20 min-w-[140px] rounded-xl p-2 shadow-xl ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(252,249,244)]' : 'border border-gray-700 bg-gray-800'}`}
                                        >
                                            <button onClick={() => { setSortMode('name-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>A-Z ↑</button>
                                            <button onClick={() => { setSortMode('name-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>A-Z ↓</button>
                                            <button onClick={() => { setSortMode('price-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>Cena ↑</button>
                                            <button onClick={() => { setSortMode('price-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>Cena ↓</button>
                                            <button onClick={() => { setSortMode('date-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>🕒 ↑</button>
                                            <button onClick={() => { setSortMode('date-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>🕒 ↓</button>
                                        </div>
                                    )}
                                </div>

                                {/* FILTER */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        setActivePopup((prev) =>
                                            prev === 'filter'
                                                ? null
                                                : 'filter'
                                        );
                                    }}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                >
                                    <Filter size={18} fill={hasActiveFilters ? 'currentColor' : 'none'} />
                                </button>

                                {activePopup === 'filter' && (
                                    <div
                                        ref={popupRef}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`fixed top-1/2 -ztranslate-x-1/2 -translate-y-1/2 z-50 w-[80vw] max-w-sm rounded-xl p-4 shadow-xl ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(252,249,244)] text-[rgb(35,35,35)]' : 'border border-gray-700 bg-gray-800 text-white'}`}
                                    >
                                        <div className="flex flex-col gap-4 min-w-[260px]">
                                            <label className="flex items-center gap-2 text-white">
                                                <button
                                                    onClick={() =>
                                                        setOnlyFavorites(!onlyFavorites)
                                                    }
                                                    className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                            rounded-lg
                                                            px-2
                                                            py-2
                                                            transition
                                                            hover:bg-gray-700
                                                        "
                                                >
                                                    <span
                                                        className={`
                                                                    text-2xl
                                                                    transition
                                                                ${onlyFavorites
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-500 hover:text-yellow-300'
                                                            }
                                                            `}
                                                    >
                                                        {onlyFavorites ? '★' : '☆'}
                                                    </span>
                                                    <span className={`${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                                        Tylko ulubione
                                                    </span>
                                                </button>
                                            </label>

                                            <div>
                                                <label className={`block mb-1 text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                                    Kategoria
                                                </label>

                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                >
                                                    <option value="all">
                                                        Wszystkie
                                                    </option>
                                                    {categories.map(category => (
                                                        <option
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`block mb-1 text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                                    Cykl rozliczeniowy
                                                </label>

                                                <select
                                                    value={selectedBillingCycle}
                                                    onChange={(e) => setSelectedBillingCycle(e.target.value)}
                                                    className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                >
                                                    <option value="all">
                                                        Wszystkie
                                                    </option>
                                                    <option value="monthly">
                                                        Miesięczne
                                                    </option>
                                                    <option value="yearly">
                                                        Roczne
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`block mb-2 text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                                    Cena
                                                </label>

                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Od"
                                                        value={minPrice}
                                                        onChange={(e) => setMinPrice(e.target.value)}
                                                        className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                    />

                                                    <input
                                                        type="number"
                                                        placeholder="Do"
                                                        value={maxPrice}
                                                        onChange={(e) => setMaxPrice(e.target.value)}
                                                        className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between gap-3">

                                            <p className={`text-sm ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-400'}`}>
                                                {filteredSubscriptions.length}{' '}
                                                {getResultsLabel(
                                                    filteredSubscriptions.length
                                                )}
                                            </p>

                                            <button
                                                onClick={() => {
                                                    setOnlyFavorites(false);
                                                    setSelectedCategory('all');
                                                    setSelectedBillingCycle('all');
                                                    setMinPrice('');
                                                    setMaxPrice('');
                                                }}
                                                className={`rounded-lg px-3 py-2 transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                            >
                                                Wyczyść
                                            </button>

                                        </div>
                                    </div>
                                )}

                                {/* ADD */}
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        font-semibold
                                        transition
                                        ${theme === 'light'
                                            ? `
                                                bg-[rgb(90,65,40)]
                                                hover:bg-[rgb(120,95,70)]
                                                text-white
                                            `
                                            : `
                                                bg-blue-500
                                                hover:bg-blue-400
                                                text-white
                                            `
                                        }
                                    `}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Desktop */}
                        <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <p className={`text-sm uppercase tracking-[0.3em] ${theme === 'light' ? 'text-[rgb(140,110,80)]' : 'text-blue-400'}`}>Twoje subskrypcje</p>
                                <h2 className={`mt-3 text-2xl font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                    {viewMode === 'list'
                                        ? 'Lista subskrypcji'
                                        : 'Kalendarz subskrypcji'}
                                </h2>
                            </div>

                            {/* Right controls */}
                            <div className="flex flex-wrap items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Szukaj subskrypcji..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'}`}
                                />
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'}`}
                                >
                                    Lista
                                </button>

                                <button
                                    onClick={() => setViewMode('calendar')}
                                    className={`rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)] placeholder-[rgb(120,120,120)]' : 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'}`}
                                >
                                    Kalendarz
                                </button>
                                <div className="relative flex items-center">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            setActivePopup((prev) =>
                                                prev === 'sort'
                                                    ? null
                                                    : 'sort'
                                            );
                                        }}
                                        className={`h-10 rounded-full px-4 font-semibold transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        {getSortIcon()}
                                    </button>

                                    {activePopup === 'sort' && (
                                        <div
                                            ref={popupRef}
                                            className={`absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 z-20 min-w-[140px] rounded-xl p-2 shadow-xl ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(252,249,244)]' : 'border border-gray-700 bg-gray-800'}`}
                                        >
                                            <button onClick={() => { setSortMode('name-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>A-Z ↑</button>
                                            <button onClick={() => { setSortMode('name-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>A-Z ↓</button>
                                            <button onClick={() => { setSortMode('price-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>Cena ↑</button>
                                            <button onClick={() => { setSortMode('price-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>Cena ↓</button>
                                            <button onClick={() => { setSortMode('date-asc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>🕒 ↑</button>
                                            <button onClick={() => { setSortMode('date-desc'); setActivePopup(null); }} className={`block w-full text-left px-3 py-1 rounded-lg ${theme === 'light' ? 'text-[rgb(90,65,40)] hover:bg-[rgb(245,240,232)]' : 'text-white hover:bg-gray-700'}`}>🕒 ↓</button>
                                        </div>
                                    )}

                                </div>
                                {/* filter */}
                                <div className="relative flex items-center">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActivePopup((prev) => prev === 'filter' ? null : 'filter');
                                        }}
                                        className={`rounded-full px-4 h-10 transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                    >
                                        <Filter size={18} />
                                    </button>

                                    {activePopup === 'filter' && (
                                        <div
                                            ref={popupRef}
                                            className={`absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 z-20 rounded-xl p-4 shadow-xl ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(252,249,244)] text-[rgb(35,35,35)]' : 'border border-gray-700 bg-gray-800 text-white'}`}
                                        >
                                            <div className="flex flex-col gap-4 min-w-[260px]">
                                                <label className="flex items-center gap-2 text-white">
                                                    <button
                                                        onClick={() =>
                                                            setOnlyFavorites(!onlyFavorites)
                                                        }
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                            rounded-lg
                                                            px-2
                                                            py-2
                                                            transition
                                                            hover:bg-gray-700
                                                        "
                                                    >
                                                        <span
                                                            className={`
                                                                    text-2xl
                                                                    transition
                                                                ${onlyFavorites
                                                                    ? 'text-yellow-400'
                                                                    : 'text-gray-500 hover:text-yellow-300'
                                                                }
                                                            `}
                                                        >
                                                            {onlyFavorites ? '★' : '☆'}
                                                        </span>
                                                        <span className={`${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                                            Tylko ulubione
                                                        </span>
                                                    </button>
                                                </label>

                                                <div>
                                                    <label className={`${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                                        Kategoria
                                                    </label>

                                                    <select
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                    >
                                                        <option value="all">
                                                            Wszystkie
                                                        </option>
                                                        {categories.map(category => (
                                                            <option
                                                                key={category}
                                                                value={category}
                                                            >
                                                                {category}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={`${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                                        Cykl rozliczeniowy
                                                    </label>

                                                    <select
                                                        value={selectedBillingCycle}
                                                        onChange={(e) => setSelectedBillingCycle(e.target.value)}
                                                        className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                    >
                                                        <option value="all">
                                                            Wszystkie
                                                        </option>
                                                        <option value="monthly">
                                                            Miesięczne
                                                        </option>
                                                        <option value="yearly">
                                                            Roczne
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={`${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                                        Cena
                                                    </label>

                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Od"
                                                            value={minPrice}
                                                            onChange={(e) => setMinPrice(e.target.value)}
                                                            className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                        />

                                                        <input
                                                            type="number"
                                                            placeholder="Do"
                                                            value={maxPrice}
                                                            onChange={(e) => setMaxPrice(e.target.value)}
                                                            className={`w-full rounded-lg border px-3 py-2 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-700 text-white'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-3">

                                                <p className="text-sm text-gray-400">
                                                    {filteredSubscriptions.length}{' '}
                                                    {getResultsLabel(
                                                        filteredSubscriptions.length
                                                    )}
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        setOnlyFavorites(false);
                                                        setSelectedCategory('all');
                                                        setSelectedBillingCycle('all');
                                                        setMinPrice('');
                                                        setMaxPrice('');
                                                    }}
                                                    className={`rounded-lg px-3 py-2 transition ${theme === 'light' ? 'bg-[rgb(245,240,232)] text-[rgb(90,65,40)] border border-[rgb(220,210,195)] hover:bg-[rgb(235,228,218)]' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                                >
                                                    Wyczyść
                                                </button>

                                            </div>
                                        </div>
                                    )}

                                </div>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className={`rounded-full px-4 h-10 font-semibold transition
                                        ${theme === 'light'
                                            ? `
                                                bg-[rgb(90,65,40)]
                                                hover:bg-[rgb(120,95,70)]
                                                text-white
                                            `
                                            : `
                                                bg-blue-500
                                                hover:bg-blue-400
                                                text-white
                                            `
                                        }
                                    `}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-6 h-px bg-gray-800" />

                        {/* Content */}



                        {viewMode === 'list' ? (
                            <SubscriptionListView
                                loading={loading}
                                error={error}
                                subscriptions={subscriptions}
                                filteredSubscriptions={filteredSubscriptions}
                                toggleFavorite={toggleFavorite}
                                handleEditSubscription={handleEditSubscription}
                                handleCancelSubscription={handleCancelSubscription}
                                handleDeleteSubscription={handleDeleteSubscription}
                                handleReactivateSubscription={handleReactivateSubscription}
                                activePopup={activePopup}
                                setActivePopup={setActivePopup}
                                popupRef={popupRef}
                                getLogoSrc={getLogoSrc}
                            />
                        ) : (
                            <CalendarView
                                subscriptions={filteredSubscriptions}
                                onDayClick={(day) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        next_payment_date: format(day, 'yyyy-MM-dd'),
                                    }));

                                    setEditingSubscription(null);
                                    setShowAddForm(true);
                                }}

                                toggleFavorite={toggleFavorite}
                                handleEditSubscription={handleEditSubscription}
                                handleCancelSubscription={handleCancelSubscription}
                                handleDeleteSubscription={handleDeleteSubscription}
                                handleReactivateSubscription={handleReactivateSubscription}

                                showDeleteConfirm={showDeleteConfirm}
                                setShowDeleteConfirm={setShowDeleteConfirm}

                                getLogoSrc={getLogoSrc}
                            />
                        )}
                    </div>
                </div>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                }}>
                    <div className={`p-6 rounded-lg max-w-md w-full mx-4 ${theme === 'light' ? 'bg-[rgb(252,249,244)] border border-[rgb(220,210,195)]' : 'bg-gray-800'}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                                {editingSubscription ? 'Edytuj subskrypcję' : 'Dodaj subskrypcję'}
                            </h2>
                            <button onClick={() => {
                                setShowAddForm(false);
                                resetForm();
                            }} className={`text-2xl ${theme === 'light' ? 'text-gray-500 hover:text-black' : 'text-gray-400 hover:text-white'}`}>×</button>
                        </div>
                        <form onSubmit={editingSubscription ? handleUpdateSubscription : handleFormSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
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
                                    className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                >
                                    <option value="custom">Własna</option>
                                    {predefinedLogos.map((logo) => (
                                        <option key={logo.id} value={logo.label}>{logo.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                        Nazwa
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        required
                                        disabled={formData.selectedPredefined && formData.selectedPredefined !== 'custom'}
                                        className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                        placeholder="np. Netflix"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
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
                                        className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                        Cykl rozliczeniowy
                                    </label>
                                    <select
                                        name="billing_cycle"
                                        value={formData.billing_cycle}
                                        onChange={handleFormChange}
                                        className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                    >
                                        <option value="monthly">Miesięczny</option>
                                        <option value="yearly">Roczny</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                        Następna płatność
                                    </label>
                                    <input
                                        type="date"
                                        name="next_payment_date"
                                        value={formData.next_payment_date}
                                        onChange={handleFormChange}
                                        required
                                        className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                    Kategoria
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    required
                                    className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                    placeholder="np. Rozrywka"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                    Notatki
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                    className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'light' ? 'border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(35,35,35)]' : 'border-gray-600 bg-gray-800 text-white'}`}
                                    placeholder="Dodatkowe notatki..."
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-300'}`}>
                                    Ulubione
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, is_favourite: !prev.is_favourite }))}
                                    title={formData.is_favourite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                                    className={`text-2xl transition ${formData.is_favourite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                                >
                                    {formData.is_favourite ? '★' : '☆'}
                                </button>
                            </div>

                            {formError && (
                                <p className="text-red-400 text-sm">{formError}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formLoading}
                                className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${theme === 'light'
                                        ? `
                                                bg-[rgb(90,65,40)]
                                                hover:bg-[rgb(120,95,70)]
                                                text-white
                                            `
                                        : `
                                                bg-blue-500
                                                hover:bg-blue-400
                                                text-white
                                            `
                                    }
                                `}
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
