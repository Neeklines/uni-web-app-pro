import { useState } from 'react';

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
} from 'date-fns';

import { generateRecurringEvents } from '../../utils/CalendarUtils';

import CalendarToolbar from './CalendarToolbar';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

function CalendarView({
    subscriptions,
    onDayClick,

    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
    handleDeleteSubscription,
    handleReactivateSubscription,

    showDeleteConfirm,
    setShowDeleteConfirm,

    getLogoSrc,
}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month');

    const intervalStart = startOfWeek(
        startOfMonth(currentDate),
        { weekStartsOn: 1 }
    );

    const intervalEnd = endOfWeek(
        endOfMonth(currentDate),
        { weekStartsOn: 1 }
    );

    const recurringEvents = generateRecurringEvents(
        subscriptions,
        intervalStart,
        intervalEnd,
    );

    const isMobile = window.innerWidth < 640;

    console.log({
        CalendarToolbar,
        DayView,
        WeekView,
        MonthView,
    });

    return (
        <div className="mt-6">

            <CalendarToolbar
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                view={view}
                setView={setView}
                isMobile={isMobile}
            />

            <div className="mt-6">

                {view === 'month' && (
                    <MonthView
                        currentDate={currentDate}
                        subscriptions={recurringEvents}
                        onDayClick={(day) => {
                            if (isMobile) {
                                setCurrentDate(day);
                                setView('day');
                                return;
                            }

                            onDayClick(day);
                        }}

                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                        handleDeleteSubscription={handleDeleteSubscription}
                        handleReactivateSubscription={handleReactivateSubscription}

                        showDeleteConfirm={showDeleteConfirm}
                        setShowDeleteConfirm={setShowDeleteConfirm}

                        getLogoSrc={getLogoSrc}
                    />
                )}

                {view === 'week' && (
                    <WeekView
                        currentDate={currentDate}
                        subscriptions={recurringEvents}

                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                        handleDeleteSubscription={handleDeleteSubscription}
                        handleReactivateSubscription={handleReactivateSubscription}

                        showDeleteConfirm={showDeleteConfirm}
                        setShowDeleteConfirm={setShowDeleteConfirm}

                        getLogoSrc={getLogoSrc}
                    />
                )}

                {view === 'day' && (
                    <DayView
                        currentDate={currentDate}
                        subscriptions={recurringEvents}

                        toggleFavorite={toggleFavorite}
                        handleEditSubscription={handleEditSubscription}
                        handleCancelSubscription={handleCancelSubscription}
                        handleDeleteSubscription={handleDeleteSubscription}
                        handleReactivateSubscription={handleReactivateSubscription}

                        showDeleteConfirm={showDeleteConfirm}
                        setShowDeleteConfirm={setShowDeleteConfirm}

                        getLogoSrc={getLogoSrc}
                    />
                )}

            </div>
        </div>
    );
}

export default CalendarView;