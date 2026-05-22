import {
    format,
    isSameDay,
    isToday,
} from 'date-fns';

import { useState } from 'react';

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
    const [expanded, setExpanded] = useState(false);
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
            h-[150px]
            overflow-hidden

            border-r
            border-b
            border-gray-700

            p-3
            text-left
            transition
            hover:bg-gray-800/70

            flex
            flex-col

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

            {/* Header */}
            <div className="mb-3 flex items-center justify-between flex-shrink-0">

                <span className="text-sm font-semibold text-white">
                    {format(day, 'd')}
                </span>

                <div
                    className={`
                    h-2 w-2 rounded-full transition
                    ${daySubscriptions.length > 0
                            ? 'bg-blue-400'
                            : 'bg-gray-700'
                        }
                `}
                />
            </div>

            {/* Events */}
            <div className="flex-1 min-h-0">

                {/* Default compact mode */}
                {!expanded && (
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
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(true);
                                }}
                                className="
                                text-xs
                                text-gray-500
                                hover:text-blue-400
                                transition
                            "
                            >
                                +{daySubscriptions.length - 2} more
                            </button>
                        )}
                    </div>
                )}

                {/* Expanded scroll mode */}
                {expanded && (
                    <div className="calendar-scroll h-full overflow-y-auto space-y-2">

                        {daySubscriptions.map((subscription) => (
                            <CalendarEventCard
                                key={`${subscription.id}-${subscription.eventDate}`}
                                subscription={subscription}
                                compact
                                toggleFavorite={toggleFavorite}
                                handleEditSubscription={handleEditSubscription}
                                handleCancelSubscription={handleCancelSubscription}
                            />
                        ))}

                    </div>
                )}
            </div>
        </button>
    );
}

export default CalendarDayCell;