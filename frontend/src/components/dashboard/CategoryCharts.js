import React from 'react';
import { usePreferences } from '../../context/UserPreferencesContext';
const chartColors = ['#7C3AED', '#EC4899', '#14B8A6', '#F97316', '#3B82F6', '#EAB308', '#10B981', '#F43F5E'];

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: cx + (r * Math.cos(angleInRadians)),
        y: cy + (r * Math.sin(angleInRadians)),
    };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
        `M ${start.x} ${start.y}`,
        `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
        `L ${cx} ${cy}`,
        'Z',
    ].join(' ');
};

const renderPieChart = (data, theme, isCurrency = false) => {

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <svg viewBox="0 0 220 220" className="h-56 w-56">
                {data.map((item, index) => {
                    const sliceAngle = total === 0 ? 0 : (item.value / total) * 360;
                    const endAngle = startAngle + sliceAngle;
                    const path = describeArc(110, 110, 90, startAngle, endAngle);
                    const color = chartColors[index % chartColors.length];
                    const midAngle = startAngle + sliceAngle / 2;
                    const labelPos = polarToCartesian(110, 110, 60, midAngle);
                    const percent = total === 0 ? 0 : Math.round((item.value / total) * 100);
                    startAngle = endAngle;

                    const isFull = total > 0 && (sliceAngle >= 359.999 || Math.abs(item.value - total) < 1e-9);
                    return (
                        <g key={item.label}>
                            {isFull ? (
                                <circle cx="110" cy="110" r="90" fill={color} />
                            ) : (
                                <path d={path} fill={color} />
                            )}
                            {sliceAngle > 4 && (
                                <text x={labelPos.x} y={labelPos.y} fill="#ffffff" fontSize="10" textAnchor="middle" dominantBaseline="middle">
                                    {percent}%
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <div className="grid gap-3">
                {data.map((item, index) => {
                    const displayValue = isCurrency ? `${item.value.toFixed(2)} PLN` : item.value;
                    return (
                        <div key={item.label} className={`flex items-center gap-3 text-sm ${theme === 'light' ? 'text-[rgb(70,70,70)]' : 'text-gray-300'}`}>
                            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                            <span>{item.label}</span>
                            <span className={`font-semibold ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>{displayValue}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const groupActiveSubscriptions = (subscriptions) => {
    const activeSubscriptions = subscriptions.filter((item) => item.is_active !== false);
    const categories = activeSubscriptions.reduce((acc, item) => {
        const category = item.category?.trim() || 'Inne';
        const price = Number(item.price) || 0;
        if (!acc[category]) {
            acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += price;
        acc[category].count += 1;
        return acc;
    }, {});

    return {
        categoryTotals: Object.entries(categories).map(([label, stats]) => ({
            label,
            value: stats.total,
        })).sort((a, b) => b.value - a.value),
        categoryCounts: Object.entries(categories).map(([label, stats]) => ({
            label,
            value: stats.count,
        })).sort((a, b) => b.value - a.value),
    };
};

function CategoryCharts({ subscriptions }) {
    const { theme } = usePreferences();
    const { categoryTotals, categoryCounts } = groupActiveSubscriptions(subscriptions);

    if (categoryTotals.length === 0 && categoryCounts.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4 mt-6 lg:grid-cols-2">
            <div className={`rounded-3xl p-6 shadow-md ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/10' : 'border border-gray-700 bg-gray-950/70 shadow-black/10'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Wydatki w kategoriach</p>
                        <p className={`mt-2 text-lg ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>Suma cen subskrypcji według kategorii</p>
                    </div>
                </div>
                {renderPieChart(categoryTotals, theme, true)}
            </div>
            <div className={`rounded-3xl p-6 shadow-md ${theme === 'light' ? 'border border-stone-300 bg-[rgb(252,249,244)] shadow-stone-300/10' : 'border border-gray-700 bg-gray-950/70 shadow-black/10'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-blue-400">Subskrypcje w kategoriach</p>
                        <p className={`mt-2 text-lg ${theme === 'light' ? 'text-[rgb(90,65,40)]' : 'text-white'}`}>Ilość subskrypcji w każdej kategorii</p>
                    </div>
                </div>
                {renderPieChart(categoryCounts, theme, false)}
            </div>
        </div>
    );
}

export default CategoryCharts;
