import {
    formatPrice,
} from '../../utils/formatPrice';

import {
    formatDate,
} from '../../utils/formatDate';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function SubscriptionCard({
    subscription,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
    handleDeleteSubscription,
    handleReactivateSubscription,
    activePopup,
    setActivePopup,
    getLogoSrc,
    popupRef,
}) {
    const {
        currency,
        dateFormat,
    } = usePreferences();

    const logoSrc = getLogoSrc(subscription);

    const formattedPrice =
        subscription.billing_cycle === 'yearly'
            ? `${formatPrice(
                subscription.price,
                currency
            )}/rok`
            : `${formatPrice(
                subscription.price,
                currency
            )}/mies.`;

    return (
        <div
            className={`
                rounded-3xl
                border
                border-gray-800
                ${!subscription.is_active ? 'bg-gray-900/45' : 'bg-gray-900/90'}
                p-4
                sm:p-5
                relative

                
            `}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">

                {/* Left */}
                <div className={`flex items-center gap-4 sm:min-w-[260px] sm:max-w-[320px] ${!subscription.is_active ? 'opacity-50' : ''}`}>

                    {/* Logo */}
                    <div className="
                        h-14
                        w-14
                        rounded-2xl
                        bg-gray-800
                        border
                        border-gray-700
                        overflow-hidden
                        flex
                        items-center
                        justify-center
                    ">
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

                    {/* Info */}
                    <div>

                        <div className="flex items-center gap-2">

                            <p className="text-lg font-semibold text-white">
                                {subscription.name}
                            </p>

                            <button
                                type="button"
                                onClick={() => toggleFavorite(subscription.id)}
                                className={`
                                    text-xl
                                    transition

                                    ${subscription.is_favourite
                                        ? 'text-yellow-400'
                                        : 'text-gray-500 hover:text-yellow-300'
                                    }
                                `}
                            >
                                {subscription.is_favourite ? '★' : '☆'}
                            </button>
                        </div>

                        <p className="mt-1 text-sm text-gray-400">
                            {subscription.category}
                        </p>
                    </div>
                </div>

                {/* Notes */}
                {subscription.notes && (
                    <div
                        className={`
                            flex-1

                            rounded-2xl
                            border
                            border-gray-800

                            bg-gray-800/40

                            sm:mr-12
                            px-4
                            py-3

                            text-sm
                            text-gray-300

                            flex
                            items-center

                            ${!subscription.is_active ? 'opacity-50' : ''}
                        `}
                    >
                        <p className="
                            line-clamp-2
                            break-words
                        ">
                            {subscription.notes}
                        </p>
                    </div>
                )}

                {/* Price */}
                <div className={`text-right sm:ml-auto ${!subscription.is_active ? 'opacity-50' : ''}`}>

                    <p className="text-xl font-semibold text-white">
                        {formattedPrice}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Następna płatność:{' '}
                        {formatDate(
                            subscription.next_payment_date,
                            dateFormat
                        )}
                    </p>
                </div>

                {/* Actions */}
                <div className="relative

                    sm:static

                    max-sm:absolute
                    max-sm:top-4
                    max-sm:right-4">

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            setActivePopup((prev) =>
                                (prev) === `subscription-${subscription.id}`
                                    ? null
                                    : `subscription-${subscription.id}`
                            );
                        }}
                        className="
                            text-gray-400
                            hover:text-white
                            p-2
                            rounded-full
                            hover:bg-gray-700
                            transition
                        "
                    >
                        ⋯
                    </button>

                    {activePopup === `subscription-${subscription.id}` && (
                        <div className="

                            absolute
                            right-0
                            top-full
                            mt-2

                            bg-gray-800
                            border
                            border-gray-600
                            rounded-lg
                            p-2
                            z-10
                            min-w-[120px]
                        "ref={popupRef}>

                            <button
                                onClick={() =>
                                    handleEditSubscription(subscription)
                                }
                                className="
                                    block
                                    w-full
                                    text-left
                                    px-3
                                    py-2
                                    hover:bg-gray-700
                                    text-white
                                    rounded
                                "
                            >
                                Edytuj
                            </button>

                            {subscription.is_active ? (
                                <button
                                    onClick={() =>
                                        handleCancelSubscription(subscription.id)
                                    }
                                    className="
                                        block
                                        w-full
                                        text-left
                                        px-3
                                        py-2
                                        hover:bg-red-700
                                        text-red-400
                                        hover:text-red-300
                                        rounded
                                    "
                                >
                                    Anuluj
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            handleReactivateSubscription(subscription.id)
                                        }
                                        className="
                                            block
                                            w-full
                                            text-left
                                            px-3
                                            py-2
                                            hover:bg-green-900/50
                                            text-green-400
                                            hover:text-green-300
                                            rounded
                                        "
                                    >
                                        Reaktywuj
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteSubscription(subscription.id)
                                        }
                                        className="
                                            block
                                            w-full
                                            text-left
                                            px-3
                                            py-2
                                            hover:bg-red-700
                                            text-red-400
                                            hover:text-red-300
                                            rounded
                                        "
                                    >
                                        Usuń
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubscriptionCard;