def test_register(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@test.com", "password": "123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@test.com"


def test_login(client):
    # create user first
    client.post(
        "/api/auth/register",
        json={"email": "test@test.com", "password": "123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "test@test.com", "password": "123"},
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
