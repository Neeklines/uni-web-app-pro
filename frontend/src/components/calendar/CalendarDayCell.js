import {
    format,
    isSameDay,
    isToday,
} from 'date-fns';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import CalendarEventCard from './CalendarEventCard';

function CalendarDayCell({
    day,
    subscriptions,
    isCurrentMonth,
    onClick,

    toggleFavorite,
    handleEditSubscription,
    handleCancelSubscription,
}) {
    const [expanded, setExpanded] = useState(false);
    const daySubscriptions = subscriptions.filter((subscription) => {
        if (!subscription.eventDate) return false;

        return isSameDay(
            subscription.eventDate,
            day
        );
    });
    const scrollRef = useRef(null);

    const [hasOverflow, setHasOverflow] = useState(false);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);

    useEffect(() => {
        if (!expanded || !scrollRef.current) return;

        const el = scrollRef.current;

        const updateScrollState = () => {
            const hasScrollableContent =
                el.scrollHeight > el.clientHeight;

            setHasOverflow(hasScrollableContent);

            setShowTopFade(el.scrollTop > 4);

            setShowBottomFade(
                el.scrollTop + el.clientHeight < el.scrollHeight - 4
            );
        };

        updateScrollState();

        el.addEventListener('scroll', updateScrollState);

        return () => {
            el.removeEventListener('scroll', updateScrollState);
        };
    }, [expanded, daySubscriptions]);

    return (
        <button
            onClick={onClick}
            className={`
            group

            h-[72px] sm:h-[150px]
            overflow-hidden

            border-r
            border-b
            border-gray-700

            p-1.5 sm:p-3
            text-left
            transition
            hover:bg-gray-800/70

            flex
            flex-col

            ${isCurrentMonth
                    ? 'bg-gray-950/70'
                    : 'bg-gray-900/40 opacity-50'
                }

            ${isToday(day)
                    ? 'border border-blue-500/70 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.6),0_0_18px_rgba(59,130,246,0.18)]'
                    : ''
                }
        `}
        >

            {/* Header */}
            <div className="mb-1 flex items-center justify-center sm:justify-between flex-shrink-0">

                <span className="text-sm font-semibold text-white">
                    {format(day, 'd')}
                </span>

                {daySubscriptions.length > 0 && (
                    <div
                        className="
                    h-2 w-2 rounded-full hidden
                    bg-blue-400 sm:block
                "></div>)}
            </div>

            {/* Events */}
            <div className="mt-2 flex-1 min-h-0">

                {/* Desktop */}
                <div className="hidden sm:block h-full">

                    {/* Default compact mode */}
                    {!expanded && (
                        <div className="space-y-2">

                            {daySubscriptions.slice(0, 2).map((subscription) => (
                                <CalendarEventCard
                                    key={`${subscription.id}-${subscription.eventDate}`}
                                    subscription={subscription}
                                    compact
                                    toggleFavorite={toggleFavorite}
                                    handleEditSubscription={handleEditSubscription}
                                    handleCancelSubscription={handleCancelSubscription}
                                />
                            ))}

                            {daySubscriptions.length > 2 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpanded(true);
                                    }}
                                    className="
                            text-xs
                            text-gray-500
                            hover:text-blue-400
                            transition
                        "
                                >
                                    +{daySubscriptions.length - 2} more
                                </button>
                            )}
                        </div>
                    )}

                    {/* Expanded scroll mode */}
                    {expanded && (
                        <div className="relative h-full">

                            {/* Scroll area */}
                            <div
                                ref={scrollRef}
                                className="
                        no-scrollbar
                        h-full
                        overflow-y-auto
                        space-y-2
                    "
                            >
                                {daySubscriptions.map((subscription) => (
                                    <CalendarEventCard
                                        key={`${subscription.id}-${subscription.eventDate}`}
                                        subscription={subscription}
                                        compact
                                        toggleFavorite={toggleFavorite}
                                        handleEditSubscription={handleEditSubscription}
                                        handleCancelSubscription={handleCancelSubscription}
                                    />
                                ))}
                            </div>

                            {/* Top fade */}
                            {hasOverflow && showTopFade && (
                                <div
                                    className="
                            pointer-events-none
                            absolute
                            top-0
                            left-0
                            right-0
                            h-5
                            bg-gradient-to-b
                            from-gray-950
                            to-transparent
                            opacity-100
                            transition-opacity
                            duration-200
                            group-hover:opacity-60
                        "
                                />
                            )}

                            {/* Bottom fade */}
                            {hasOverflow && showBottomFade && (
                                <div
                                    className="
                            pointer-events-none
                            absolute
                            bottom-0
                            left-0
                            right-0
                            h-5
                            bg-gradient-to-t
                            from-gray-950
                            to-transparent
                            opacity-100
                            transition-opacity
                            duration-200
                            group-hover:opacity-60
                        "
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile */}
                <div className="sm:hidden flex justify-center flex-wrap gap-1">

                    {daySubscriptions.slice(0, 4).map((subscription) => (
                        <div
                            key={`${subscription.id}-${subscription.eventDate}`}
                            className={`
                    h-2
                    w-2
                    rounded-full
                    ${subscription.is_favourite
                                    ? 'bg-yellow-400'
                                    : 'bg-blue-400'
                                }
                `}
                        />
                    ))}

                    {daySubscriptions.length > 4 && (
                        <div className="text-[10px] text-gray-500 leading-none">
                            +{daySubscriptions.length - 4}
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}

export default CalendarDayCell;