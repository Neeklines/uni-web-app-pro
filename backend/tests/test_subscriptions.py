def create_user(client):
    return client.post(
        "/api/auth/register",
        json={"email": "user@test.com", "password": "123456"},
    )


def login_user(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "user@test.com", "password": "123456"},
    )
    return response.json()["access_token"]


def test_create_subscription(client):
    create_user(client)
    token = login_user(client)

    response = client.post(
        "/api/subscriptions",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Netflix",
            "price": 15.99,
            "billing_cycle": "monthly",
            "next_payment_date": "2026-04-01",
            "category": "Entertainment",
        },
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Netflix"
    assert data["price"] == 15.99


def test_get_subscriptions(client):
    create_user(client)
    token = login_user(client)

    for name in ["Netflix", "Spotify"]:
        client.post(
            "/api/subscriptions",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": name,
                "price": 10,
                "billing_cycle": "monthly",
                "next_payment_date": "2026-04-01",
                "category": "Test",
            },
        )

    response = client.get(
        "/api/subscriptions",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["name"] in ["Netflix", "Spotify"]
