export async function login(email, password, captchaToken) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captcha_token: captchaToken }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail);

    return data;
}

export async function register(email, password, captchaToken) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, captcha_token: captchaToken }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.detail);

    return data;
}

export async function getMe(token) {
    const response = await fetch('/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
}