import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    format,
} from 'date-fns';

import {
    usePreferences,
} from '../../context/UserPreferencesContext';

import CalendarDayCell from './CalendarDayCell';

function MonthView({
    currentDate,
    subscriptions,
    onDayClick,

    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    const { theme } = usePreferences();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

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

    return (
        <div
            className={`
                overflow-hidden
                sm:rounded-[32px]
                rounded-[12px]
                border

                ${theme === 'light'
                    ? 'border-[rgb(220,210,195)]'
                    : 'border-gray-700'
                }
            `}
        >

            {/* Week labels */}
            <div
                className={`
                    grid
                    grid-cols-7

                    ${theme === 'light'
                        ? 'bg-[rgb(245,240,232)]'
                        : 'bg-gray-900'
                    }
                `}
            >

                {['Pon', 'Wt', 'Śrs', 'Czw', 'Pt', 'Sob', 'Ndz'].map((label) => (
                    <div
                        key={label}
                        className={`
                            border-b
                            border-r

                            sm:p-4
                            p-1

                            text-center
                            text-sm
                            font-medium

                            last:border-r-0

                            ${theme === 'light'
                                ? `
                                    border-[rgb(220,210,195)]
                                    text-[rgb(100,100,100)]
                                `
                                : `
                                    border-gray-700
                                    text-gray-400
                                `
                            }
                        `}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div
                key={format(currentDate, 'yyyy-MM')}
                className="animate-calendar-fade"
            >
                {/* Calendar grid */}
                <div className="grid grid-cols-7">

                    {days.map((day) => (
                        <CalendarDayCell
                            key={day.toISOString()}
                            day={day}
                            currentDate={currentDate}
                            subscriptions={subscriptions}
                            isCurrentMonth={isSameMonth(day, currentDate)}
                            onClick={() => onDayClick(day)}
                            toggleFavorite={toggleFavorite}
                            handleEditSubscription={handleEditSubscription}
                            handleCancelSubscription={handleCancelSubscription}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MonthView;