import {
    Pencil,
    X,
    RotateCcw,
    Trash2,
} from 'lucide-react';

import {
    formatPrice,
} from '../../utils/formatPrice';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

function CalendarEventCard({
    subscription,
    compact = false,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
    handleReactivateSubscription,
    handleDeleteSubscription,
}) {
    const { currency, theme } = usePreferences();
    if (compact) {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();

                    if (subscription.is_active === false) {
                        if (
                            window.confirm(
                                `Przywrócić subskrypcję "${subscription.name}"?`
                            )
                        ) {
                            handleReactivateSubscription(
                                subscription.id
                            );
                        }

                        return;
                    }

                    handleEditSubscription(subscription);
                }}
                className={`
                flex
                items-center
                gap-2
                rounded-lg
                border
                ${theme === 'light'
                        ? `
                        bg-[rgb(245,240,232)]
                        border-[rgb(220,210,195)]
                        text-[rgb(90,65,40)]
                    `
                        : `
                        bg-gray-800/90
                        border-gray-700
                        text-white
                    `
                    }
                px-2
                py-1.5
                text-xs
                transition
                hover:border-blue-500
                hover:bg-gray-700/90
                cursor-pointer
                ${!subscription.is_active ? 'opacity-50' : ''}
            `}
            >
                {/* Star */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(subscription.id);
                    }}
                    className={`
                    transition
                    flex-shrink-0
                    ${subscription.is_favourite
                            ? 'text-yellow-400'
                            : 'text-gray-500 hover:text-yellow-300'
                        }
                `}
                >
                    {subscription.is_favourite ? '★' : '☆'}
                </button>

                {/* Name */}
                <div className="truncate flex-1">
                    {subscription.name}
                </div>

                {/* Cancel */}
                {subscription.is_active !== false ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCancelSubscription(subscription.id);
                        }}
                        className="
                            text-gray-500
                            hover:text-red-400
                            transition
                            flex-shrink-0
                        "
                    >
                        ✕
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubscription(subscription.id);
                        }}
                        className="
                            text-gray-500
                            hover:text-red-400
                            transition
                            flex-shrink-0
                        "
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        );
    }
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`
                rounded-xl border
                ${theme === 'light'
                    ? `
                        border-[rgb(220,210,195)]
                        bg-[rgb(245,240,232)]
                    `
                    : `
                        border-gray-700
                        bg-gray-800/90
                    `
                }
                text-left
                transition
                hover:border-blue-500
                px-2 py-1.5 text-xs
                ${!subscription.is_active ? 'opacity-50' : ''}
            `}
        >
            <div className="flex items-start justify-between gap-2">

                <div className="min-w-0 flex-1">

                    <p className={`
                        truncate 
                        font-medium
                        ${theme === 'light'
                            ? 'text-[rgb(90,65,40)]'
                            : 'text-white'
                        }`}>
                        {subscription.name}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => toggleFavorite(subscription.id)}
                    className={`
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


            <div className="mt-2 flex items-center justify-between gap-2">

                <p className={`text-xs ${theme === 'light' ? 'text-[rgb(100,100,100)]' : 'text-gray-500'}`}>
                    {formatPrice(
                        subscription.price,
                        currency
                    )}
                </p>

                <div className="flex items-center gap-2">

                    {subscription.is_active !== false ? (
                        <>
                            <button
                                onClick={() => handleEditSubscription(subscription)}
                                className="text-gray-400 hover:text-blue-400 transition"
                            >
                                <Pencil size={13} />
                            </button>

                            <button
                                onClick={() => handleCancelSubscription(subscription.id)}
                                className="text-gray-400 hover:text-red-400 transition"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    handleReactivateSubscription(subscription.id)
                                }
                                className="text-gray-400 hover:text-green-400 transition"
                            >
                                <RotateCcw size={13} />
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteSubscription(subscription.id)
                                }
                                className="text-gray-400 hover:text-red-400 transition"
                            >
                                <Trash2 size={13} />
                            </button>
                        </>
                    )}

                </div>
            </div>

        </div>
    );
}

export default CalendarEventCard;