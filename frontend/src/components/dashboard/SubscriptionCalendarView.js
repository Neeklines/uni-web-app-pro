import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    parseISO,
} from 'date-fns';

import { useMemo, useState } from 'react';

function SubscriptionCalendarView({
    subscriptions,
    onDayClick,
}) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const calendarStart = startOfWeek(monthStart, {
            weekStartsOn: 1,
        });

        const calendarEnd = endOfWeek(monthEnd, {
            weekStartsOn: 1,
        });

        const days = [];

        let day = calendarStart;

        while (day <= calendarEnd) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    }, [currentMonth]);

    const getSubscriptionsForDay = (day) => {
        return subscriptions.filter((subscription) => {
            if (!subscription.next_payment_date) return false;

            return isSameDay(
                parseISO(subscription.next_payment_date),
                day
            );
        });
    };

    return (
        <div className="mt-6 rounded-[32px] border border-gray-700 bg-gray-950/70 p-6 sm:p-8 shadow-xl shadow-black/20">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="rounded-full bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                >
                    ←
                </button>

                <h2 className="text-2xl font-semibold text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>

                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="rounded-full bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
                >
                    →
                </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-400 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">

                {calendarDays.map((day) => {
                    const daySubscriptions = getSubscriptionsForDay(day);

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={`
                                min-h-[120px]
                                rounded-2xl
                                border
                                p-2
                                text-left
                                transition
                                hover:border-blue-500
                                hover:bg-gray-900/80
                                ${isSameMonth(day, currentMonth)
                                    ? 'border-gray-800 bg-gray-900/60'
                                    : 'border-gray-900 bg-gray-950/40 opacity-40'
                                }
                            `}
                        >
                            {/* Day number */}
                            <div className="mb-2 flex items-center justify-between">

                                <span className={`
                                    text-sm font-medium
                                    ${isSameMonth(day, currentMonth)
                                        ? 'text-white'
                                        : 'text-gray-500'
                                    }
                                `}>
                                    {format(day, 'd')}
                                </span>

                                {daySubscriptions.length > 0 && (
                                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                                )}
                            </div>

                            {/* Subscriptions */}
                            <div className="space-y-1">

                                {daySubscriptions.slice(0, 2).map((subscription) => (
                                    <div
                                        key={subscription.id}
                                        className="truncate rounded-lg bg-blue-500/20 px-2 py-1 text-xs text-blue-300"
                                    >
                                        {subscription.name}
                                    </div>
                                ))}

                                {daySubscriptions.length > 2 && (
                                    <div className="text-xs text-gray-400">
                                        +{daySubscriptions.length - 2} more
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SubscriptionCalendarView;