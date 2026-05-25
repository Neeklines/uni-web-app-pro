import { format } from 'date-fns';

export function formatDate(
    date,
    pattern = 'dd.MM.yyyy'
) {
    return format(
        new Date(date),
        pattern
    );
}