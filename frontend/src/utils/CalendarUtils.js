import {
    addMonths,
    addYears,
    parseISO,
    isWithinInterval,
} from 'date-fns';

export function generateRecurringEvents(
    subscriptions,
    intervalStart,
    intervalEnd,
) {
    const events = [];

    subscriptions.forEach((subscription) => {

        if (!subscription.next_payment_date) {
            return;
        }

        let currentDate = parseISO(subscription.next_payment_date);

        // Safety limit
        let iterations = 0;

        while (currentDate <= intervalEnd && iterations < 100) {

            if (
                isWithinInterval(currentDate, {
                    start: intervalStart,
                    end: intervalEnd,
                })
            ) {
                events.push({
                    ...subscription,
                    eventDate: currentDate,
                });
            }

            if (subscription.billing_cycle === 'monthly') {
                currentDate = addMonths(currentDate, 1);

            } else if (subscription.billing_cycle === 'yearly') {
                currentDate = addYears(currentDate, 1);

            } else {
                break;
            }

            iterations++;
        }
    });

    return events;
}