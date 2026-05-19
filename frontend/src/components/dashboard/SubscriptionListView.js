function SubscriptionListView({
    loading,
    error,
    subscriptions,
    filteredSubscriptions,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
    handleDeleteSubscription,
    setShowDeleteConfirm,
    showDeleteConfirm,
    getLogoSrc,
}) {
    return (
        <div className="mt-6 space-y-4">

            {loading ? (
                <p className="text-gray-400">
                    Ładowanie subskrypcji...
                </p>

            ) : error ? (
                <p className="text-red-400">
                    Błąd: {error}
                </p>

            ) : subscriptions.length === 0 ? (
                <p className="text-gray-400">
                    Brak subskrypcji do wyświetlenia.
                </p>

            ) : filteredSubscriptions.length === 0 ? (
                <p className="text-gray-400">
                    Nie znaleziono subskrypcji.
                </p>

            ) : (
                filteredSubscriptions.map((subscription) => {
                    const logoSrc = getLogoSrc(subscription);

                    return (
                        <div
                            key={subscription.id}
                            className={`rounded-3xl border border-gray-800 bg-gray-900/90 p-4 sm:p-5 relative ${!subscription.is_active ? 'opacity-50' : ''
                                }`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                {/* Left section */}
                                <div className="flex items-center gap-4 flex-1">

                                    {/* Logo */}
                                    <div className="h-14 w-14 rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                                        {logoSrc ? (
                                            <img
                                                src={logoSrc}
                                                alt={subscription.name}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-white text-lg font-semibold">
                                                {subscription.name?.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Subscription info */}
                                    <div>
                                        <div className="flex items-center gap-2">

                                            <p className="text-lg font-semibold text-white">
                                                {subscription.name}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => toggleFavorite(subscription.id)}
                                                className={`text-xl transition ${subscription.is_favourite
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-500 hover:text-yellow-300'
                                                    }`}
                                            >
                                                {subscription.is_favourite ? '★' : '☆'}
                                            </button>
                                        </div>

                                        <p className="mt-1 text-sm text-gray-400">
                                            Kategoria: {subscription.category}
                                        </p>

                                        {subscription.notes && (
                                            <p className="mt-1 text-sm text-gray-400">
                                                Notatki: {subscription.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Price section */}
                                <div className="text-right">
                                    <p className="text-xl font-semibold text-white">
                                        {subscription.price.toFixed(2)} PLN/mies.
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Następna płatność: {subscription.next_payment_date}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="relative">

                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirm(
                                                showDeleteConfirm === subscription.id
                                                    ? null
                                                    : subscription.id
                                            )
                                        }
                                        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition"
                                    >
                                        ⋯
                                    </button>

                                    {showDeleteConfirm === subscription.id && (
                                        <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg p-2 z-10 min-w-[120px]">

                                            <button
                                                onClick={() =>
                                                    handleEditSubscription(subscription)
                                                }
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-700 text-white rounded"
                                            >
                                                Edytuj
                                            </button>

                                            {subscription.is_active ? (
                                                <button
                                                    onClick={() =>
                                                        handleCancelSubscription(subscription.id)
                                                    }
                                                    className="block w-full text-left px-3 py-2 hover:bg-red-700 text-red-400 hover:text-red-300 rounded"
                                                >
                                                    Anuluj
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSubscription(subscription.id)
                                                    }
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
    );
}

export default SubscriptionListView;