import SubscriptionCard from './SubscriptionCard';

function SubscriptionListView({
    loading,
    error,
    subscriptions,
    filteredSubscriptions,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
    handleDeleteSubscription,
    handleReactivateSubscription,
    getLogoSrc,
    activePopup,
    setActivePopup,
    popupRef,
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
                filteredSubscriptions.map((subscription) => (
                    <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                        handleDeleteSubscription={handleDeleteSubscription}
                        handleReactivateSubscription={handleReactivateSubscription}
                        getLogoSrc={getLogoSrc}
                        activePopup={activePopup}
                        setActivePopup={setActivePopup}
                        popupRef={popupRef}
                    />
                ))
            )}
        </div>
    );
}

export default SubscriptionListView;