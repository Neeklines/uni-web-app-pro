def test_register(client):
    r = client.post(
        "/auth/register", json={"email": "test@test.com", "password": "123"}
    )

    assert r.status_code == 200


def test_login(client):
    client.post("/auth/register", json={"email": "test@test.com", "password": "123"})

    r = client.post("/auth/login", json={"email": "test@test.com", "password": "123"})

    assert r.status_code == 200
