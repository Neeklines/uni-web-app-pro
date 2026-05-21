import {
    Pencil,
    X,
} from 'lucide-react';

function CalendarEventCard({
    subscription,
    compact = false,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`
                rounded-xl border border-gray-700 bg-gray-800/90
                text-left
                transition
                hover:border-blue-500
                ${compact
                    ? 'px-2 py-1.5 text-xs'
                    : 'p-3'
                }
            `}
        >
            <div className="flex items-start justify-between gap-2">

                <div className="min-w-0 flex-1">

                    <p className="truncate font-medium text-white">
                        {subscription.name}
                    </p>

                    {!compact && (
                        <>
                            <p className="mt-1 text-sm text-gray-400">
                                {subscription.price.toFixed(2)} PLN
                            </p>

                            <p className="text-xs text-gray-500">
                                {subscription.category}
                            </p>
                        </>
                    )}
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

            {/* Compact actions */}
            {compact && (
                <div className="mt-2 flex items-center gap-2">

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
                </div>
            )}

            {/* Full actions */}
            {!compact && (
                <div className="mt-3 flex gap-2">

                    <button
                        onClick={() => handleEditSubscription(subscription)}
                        className="rounded-lg bg-gray-700 px-3 py-1 text-xs text-white hover:bg-gray-600 transition"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/30 transition"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default CalendarEventCard;