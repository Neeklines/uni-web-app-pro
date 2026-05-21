import {
    format,
    isSameDay,
    isToday,
} from 'date-fns';

import CalendarEventCard from './CalendarEventCard';

function CalendarDayCell({
    day,
    subscriptions,
    isCurrentMonth,
    onClick,

    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    const daySubscriptions = subscriptions.filter((subscription) => {
        if (!subscription.eventDate) return false;

        return isSameDay(
            subscription.eventDate,
            day
        );
    });

    return (
        <button
            onClick={onClick}
            className={`
                min-h-[140px]
                border-r
                border-b
                border-gray-700
                p-3
                text-left
                transition
                hover:bg-gray-800/70
                ${isCurrentMonth
                    ? 'bg-gray-950/70'
                    : 'bg-gray-900/40 opacity-50'
                }
                ${isToday(day)
                    ? 'border border-blue-500/70 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.6),0_0_18px_rgba(59,130,246,0.18)]'
                    : ''
                }
            `}
        >
            {/* Day number */}
            <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-semibold text-white">
                    {format(day, 'd')}
                </span>

                {daySubscriptions.length > 0 && (
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                )}
            </div>

            {/* Events */}
            <div className="space-y-2">

                {daySubscriptions.slice(0, 2).map((subscription) => (
                    <CalendarEventCard
                        key={`${subscription.id}-${subscription.eventDate}`}
                        subscription={subscription}
                        compact
                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                    />
                ))}

                {daySubscriptions.length > 2 && (
                    <div className="text-xs text-gray-500">
                        +{daySubscriptions.length - 2} more
                    </div>
                )}
            </div>
        </button>
    );
}

export default CalendarDayCell;