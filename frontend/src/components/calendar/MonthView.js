import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    format,
} from 'date-fns';

import CalendarDayCell from './CalendarDayCell';

function MonthView({
    currentDate,
    subscriptions,
    onDayClick,

    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
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
        <div className="overflow-hidden sm:rounded-[32px] rounded-[12px] border border-gray-700">

            {/* Week labels */}
            <div className="grid grid-cols-7 bg-gray-600">

                {['Pon', 'Wt', 'Śrs', 'Czw', 'Pt', 'Sob', 'Ndz'].map((label) => (
                    <div
                        key={label}
                        className="border-b border-r border-slate-700 sm:p-4 p-1 text-center text-sm font-medium text-white last:border-r-0"
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