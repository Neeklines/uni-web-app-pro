import {
    startOfWeek,
    addDays,
    format,
    isSameDay,
} from 'date-fns';

import { pl } from 'date-fns/locale';

import CalendarEventCard from './CalendarEventCard';

function WeekView({
    currentDate,
    subscriptions,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    const weekStart = startOfWeek(currentDate, {
        weekStartsOn: 1,
    });

    const days = Array.from({ length: 7 }, (_, i) =>
        addDays(weekStart, i)
    );

    return (
        <div className="grid grid-cols-7 gap-4">

            {days.map((day) => {
                const dayEvents = subscriptions.filter((subscription) =>
                    isSameDay(subscription.eventDate, day)
                );

                return (
                    <div
                        key={day.toISOString()}
                        className="rounded-2xl border border-gray-700 bg-gray-900/70 p-3 min-h-[500px]"
                    >
                        <div className="mb-4">
                            <p className="text-sm text-gray-400">
                                {format(day, 'EEE', {
                                    locale: pl,
                                })}
                            </p>

                            <p className="text-2xl font-semibold text-white">
                                {format(day, 'd')}
                            </p>
                        </div>

                        <div className="space-y-3">

                            {dayEvents.map((subscription) => (
                                <CalendarEventCard
                                    key={`${subscription.id}-${subscription.eventDate}`}
                                    subscription={subscription}
                                    toggleFavorite={toggleFavorite}
                                    handleEditSubscription={handleEditSubscription}
                                    handleCancelSubscription={handleCancelSubscription}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default WeekView;