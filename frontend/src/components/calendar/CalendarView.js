import { useState } from 'react';
import { format } from 'date-fns';

import CalendarToolbar from './CalendarToolbar';
import MonthView from './MonthView';

function CalendarView({
    subscriptions,
    onDayClick,
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month');

    return (
        <div className="rounded-[32px] border border-gray-700 bg-gray-950/70 p-6 sm:p-8 shadow-xl shadow-black/20">

            <CalendarToolbar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                view={view}
                setView={setView}
            />

            <div className="mt-6">
                {view === 'month' && (
                    <MonthView
                        currentDate={currentDate}
                        subscriptions={subscriptions}
                        onDayClick={onDayClick}
                    />
                )}

                {view === 'week' && (
                    <div className="text-gray-400">
                        Week view coming soon
                    </div>
                )}

                {view === 'day' && (
                    <div className="text-gray-400">
                        Day view coming soon
                    </div>
                )}
            </div>
        </div>
    );
}

export default CalendarView;