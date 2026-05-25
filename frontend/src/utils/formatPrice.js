export function formatPrice(
    value,
    currency = 'PLN'
) {
    return new Intl.NumberFormat(
        'pl-PL',
        {
            style: 'currency',
            currency,
        }
    ).format(value);
}