export async function getSubscriptions(token) {
    const response = await fetch('/api/subscriptions', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
}

export async function createSubscription(token, subscriptionData) {
    const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create subscription');
    }

    return response.json();
}