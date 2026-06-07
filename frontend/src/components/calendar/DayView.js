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
    handleReactivateSubscription,
    handleDeleteSubscription,
}) {
    const dayEvents = subscriptions.filter((subscription) =>
        isSameDay(subscription.eventDate, currentDate)
    );

    return (


        <div className="space-y-4">

            {dayEvents.length === 0 ? (
                <p className="text-gray-400">
                    Brak subskrypcji w tym dniu.
                </p>
            ) : (
                dayEvents.map((subscription) => (
                    <CalendarEventCard
                        key={`${subscription.id}-${subscription.eventDate}`}
                        subscription={subscription}
                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                        handleReactivateSubscription={handleReactivateSubscription}
                        handleDeleteSubscription={handleDeleteSubscription}
                    />
                ))
            )}
        </div>

    );
}

export default DayView;