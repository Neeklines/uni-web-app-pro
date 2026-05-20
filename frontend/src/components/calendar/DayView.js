import {
    format,
    isSameDay,
} from 'date-fns';

import CalendarEventCard from './CalendarEventCard';

function DayView({
    currentDate,
    subscriptions,
    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    const dayEvents = subscriptions.filter((subscription) =>
        isSameDay(subscription.eventDate, currentDate)
    );

    return (
        <div className="rounded-3xl border border-gray-700 bg-gray-900/70 p-6">

            <div className="mb-6">
                <p className="text-gray-400">
                    {format(currentDate, 'EEEE')}
                </p>

                <h2 className="text-4xl font-semibold text-white">
                    {format(currentDate, 'd MMMM yyyy')}
                </h2>
            </div>

            <div className="space-y-4">

                {dayEvents.length === 0 ? (
                    <p className="text-gray-400">
                        No subscriptions for this day.
                    </p>
                ) : (
                    dayEvents.map((subscription) => (
                        <CalendarEventCard
                            key={`${subscription.id}-${subscription.eventDate}`}
                            subscription={subscription}
                            toggleFavorite={toggleFavorite}
                            handleEditSubscription={handleEditSubscription}
                            handleCancelSubscription={handleCancelSubscription}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default DayView;