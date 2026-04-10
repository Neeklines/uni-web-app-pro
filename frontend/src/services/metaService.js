function formatTimestamp(epoch) {
    if (!epoch || epoch === 'unknown') return null;

    const date = new Date(epoch * 1000);

    return date.toLocaleString('en-GB', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }) + ' UTC';
}

function shortenHash(hash) {
    if (!hash || hash === 'unknown') return null;
    return hash.slice(0, 7);
}

export async function getMeta() {
    const response = await fetch('/api/meta');

    if (!response.ok) {
        throw new Error('Failed to fetch meta');
    }

    const data = await response.json();

    return {
        ...data,
        deployed_at_formatted: formatTimestamp(data.deployed_at),
        version_short: shortenHash(data.version),
    };
}