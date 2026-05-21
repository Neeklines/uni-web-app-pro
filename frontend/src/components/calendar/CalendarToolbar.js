import {
    addMonths,
    subMonths,
    format,
} from 'date-fns';

function CalendarToolbar({
    currentDate,
    setCurrentDate,
    view,
    setView,
}) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}
            <div>
                <h2 className="ml-6 text-3xl font-semibold text-white">
                    {format(currentDate, 'MMMM yyyy')}
                </h2>
            </div>

            {/* Right */}
            <div className="flex flex-wrap items-center gap-3">

                {/* View switch */}
                <div className="flex rounded-2xl border border-gray-700 bg-gray-900 p-1">

                    {['month', 'week', 'day'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setView(item)}
                            className={`
                                rounded-xl px-5 py-2 text-sm font-medium transition
                                ${view === item
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }
                            `}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">

                    <button
                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                        className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 transition"
                    >
                        ←
                    </button>

                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="rounded-2xl border border-gray-700 bg-gray-800 px-5 py-2 text-white hover:bg-gray-700 transition"
                    >
                        Today
                    </button>

                    <button
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                        className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 transition"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CalendarToolbar;