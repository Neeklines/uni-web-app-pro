import {
    addMonths,
    addWeeks,
    addDays,
    subMonths,
    subWeeks,
    subDays,
    startOfWeek,
    endOfWeek,
    format,
} from 'date-fns';
import {
    usePreferences,
} from '../../context/UserPreferencesContext';
import { pl } from 'date-fns/locale';

function CalendarToolbar({
    currentDate,
    setCurrentDate,
    view,
    setView,
    isMobile,
}) {
    const { theme } = usePreferences();
    const handlePrevious = () => {
        if (view === 'month') {
            setCurrentDate(subMonths(currentDate, 1));
        }

        if (view === 'week') {
            setCurrentDate(subWeeks(currentDate, 1));
        }

        if (view === 'day') {
            setCurrentDate(subDays(currentDate, 1));
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(addMonths(currentDate, 1));
        }

        if (view === 'week') {
            setCurrentDate(addWeeks(currentDate, 1));
        }

        if (view === 'day') {
            setCurrentDate(addDays(currentDate, 1));
        }
    };

    const capitalize = (text) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    const getTitle = () => {
        if (view === 'month') {
            return capitalize(format(currentDate, 'LLLL yyyy', {
                locale: pl,
            }));
        }

        if (view === 'week') {

            const weekStart = startOfWeek(currentDate, {
                weekStartsOn: 1,
            });

            const weekEnd = endOfWeek(currentDate, {
                weekStartsOn: 1,
            });

            return `Tydzień ${format(
                weekStart,
                'd MMMM yyyy',
                { locale: pl }
            )} - ${format(
                weekEnd,
                'd MMMM yyyy',
                { locale: pl }
            )}`;
        }

        return capitalize(
            format(
                currentDate,
                'EEEE, d MMMM yyyy',
                { locale: pl }
            )
        );
    };

    const viewLabels = {
        month: 'Miesiąc',
        week: 'Tydzień',
        day: 'Dzień',
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Left */}
            <div>
                <h2 className={`sm:ml-6 text-3xl font-semibold text-center sm:text-left ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>
                    {getTitle()}
                </h2>
            </div>

            {/* Right */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3">

                {/* Navigation */}
                <div className="flex justify-center gap-2">

                    <button
                        onClick={() => handlePrevious()}
                        className={`rounded-2xl px-4 py-2 transition ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(90,65,40)] hover:bg-[rgb(235,228,218)]' : 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        ←
                    </button>

                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className={`rounded-2xl px-4 py-2 transition ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(90,65,40)] hover:bg-[rgb(235,228,218)]' : 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        Dziś
                    </button>

                    <button
                        onClick={() => handleNext()}
                        className={`rounded-2xl px-4 py-2 transition ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(245,240,232)] text-[rgb(90,65,40)] hover:bg-[rgb(235,228,218)]' : 'border border-gray-700 bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        →
                    </button>
                </div>

                {/* View switch */}
                <div className={`flex rounded-2xl p-1 ${theme === 'light' ? 'border border-[rgb(220,210,195)] bg-[rgb(245,240,232)]' : 'border border-gray-700 bg-gray-900'}`}>

                    {['month', ...(isMobile ? [] : ['week']), 'day'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setView(item)}
                            className={`
                                rounded-xl px-5 py-2 text-sm font-medium transition
                               ${view === item
                                    ? 'bg-blue-500 text-white'
                                    : theme === 'light'
                                        ? 'text-[rgb(90,65,40)] hover:bg-[rgb(235,228,218)]'
                                        : 'text-gray-400 hover:text-white'
                                }
                            `}
                        >
                            {viewLabels[item]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CalendarToolbar;