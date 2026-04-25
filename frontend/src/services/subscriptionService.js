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

export async function updateSubscription(token, subscriptionId, subscriptionData) {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update subscription');
    }

    return response.json();
}

export async function deleteSubscription(token, subscriptionId) {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete subscription');
    }

    return response.json();
}

export async function cancelSubscription(token, subscriptionId) {
    const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to cancel subscription');
    }

    return response.json();
}