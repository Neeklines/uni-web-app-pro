def create_user(client):
    return client.post(
        "/api/auth/register",
        json={"email": "user@test.com", "password": "123456"},
    )


def test_create_subscription(client):
    user = create_user(client).json()

    response = client.post(
        "/api/subscriptions",
        headers={"x-user-id": str(user["id"])},
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
    user = create_user(client).json()

    # create 2 subscriptions
    for name in ["Netflix", "Spotify"]:
        client.post(
            "/api/subscriptions",
            headers={"x-user-id": str(user["id"])},
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
        headers={"x-user-id": str(user["id"])},
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 2
    assert data[0]["name"] in ["Netflix", "Spotify"]
