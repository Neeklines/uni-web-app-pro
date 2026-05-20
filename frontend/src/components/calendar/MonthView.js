import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
} from 'date-fns';

import CalendarDayCell from './CalendarDayCell';

function MonthView({
    currentDate,
    subscriptions,
    onDayClick,
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
        <div className="overflow-hidden rounded-[32px] border border-gray-700">

            {/* Week labels */}
            <div className="grid grid-cols-7 bg-gray-900">

                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                    <div
                        key={label}
                        className="border-b border-r border-gray-700 p-4 text-center text-sm font-medium text-gray-400 last:border-r-0"
                    >
                        {label}
                    </div>
                ))}
            </div>

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
                    />
                ))}
            </div>
        </div>
    );
}

export default MonthView;