from fastapi.testclient import TestClient

EMAIL = "Aigerim@Example.com"
PASSWORD = "mountains123"


def start(client: TestClient, email: str = EMAIL, tag: str = "aigerim") -> dict:
    response = client.post("/auth/signup/start", json={"email": email, "tag": tag})
    assert response.status_code == 200, response.text
    return response.json()


def sign_up(client: TestClient, email: str = EMAIL, tag: str = "aigerim", **profile) -> dict:
    code = start(client, email, tag)["dev_code"]
    token = client.post("/auth/signup/verify", json={"email": email, "code": code}).json()["signup_token"]
    body = {"signup_token": token, "tag": tag, "password": PASSWORD, "name": "Айгерім", **profile}
    response = client.post("/auth/register", json=body)
    assert response.status_code == 201, response.text
    return response.json()


def test_full_signup_flow(client):
    body = sign_up(client, birthday="2004-05-17", gender="female", preferences=["peaks", "lakes"])

    user = body["user"]
    assert body["access_token"]
    assert user["email"] == "aigerim@example.com"
    assert user["tag"] == "aigerim"
    assert user["birthday"] == "2004-05-17"
    assert user["gender"] == "female"
    assert user["preferences"] == ["peaks", "lakes"]


def test_signup_start_sends_6_digit_code_in_dev_mode(client):
    body = start(client)

    assert body["email"] == "aigerim@example.com"
    assert len(body["dev_code"]) == 6 and body["dev_code"].isdigit()


def test_signup_start_rejects_taken_email_and_tag(client):
    sign_up(client)

    taken_email = client.post("/auth/signup/start", json={"email": EMAIL, "tag": "other"})
    taken_tag = client.post("/auth/signup/start", json={"email": "new@example.com", "tag": "AIGERIM"})

    assert taken_email.json()["detail"] == "email_taken"
    assert taken_tag.json()["detail"] == "tag_taken"


def test_signup_start_validates_tag(client):
    assert client.post("/auth/signup/start", json={"email": EMAIL, "tag": "a!"}).status_code == 422


def test_resend_too_soon(client):
    start(client)

    again = client.post("/auth/signup/start", json={"email": EMAIL, "tag": "aigerim"})

    assert again.status_code == 429
    assert again.json()["detail"] == "too_soon"


def test_wrong_code_and_attempt_limit(client):
    code = start(client)["dev_code"]
    wrong = "000000" if code != "000000" else "111111"

    for _ in range(5):
        response = client.post("/auth/signup/verify", json={"email": EMAIL, "code": wrong})
        assert response.json()["detail"] == "invalid_code"

    blocked = client.post("/auth/signup/verify", json={"email": EMAIL, "code": code})
    assert blocked.json()["detail"] == "too_many_attempts"


def test_register_requires_valid_signup_token(client):
    body = {"signup_token": "garbage", "tag": "aigerim", "password": PASSWORD, "name": "А"}

    response = client.post("/auth/register", json=body)

    assert response.status_code == 400
    assert response.json()["detail"] == "invalid_signup_token"


def test_login_token_is_not_a_signup_token(client):
    login_token = sign_up(client)["access_token"]

    body = {"signup_token": login_token, "tag": "x_user", "password": PASSWORD, "name": "X"}
    assert client.post("/auth/register", json=body).json()["detail"] == "invalid_signup_token"


def test_login(client):
    sign_up(client)

    ok = client.post("/auth/login", json={"email": "aigerim@example.com", "password": PASSWORD})
    wrong = client.post("/auth/login", json={"email": EMAIL, "password": "wrong-password"})
    unknown = client.post("/auth/login", json={"email": "nobody@example.com", "password": "whatever1"})

    assert ok.status_code == 200
    assert ok.json()["user"]["tag"] == "aigerim"
    for response in (wrong, unknown):
        assert response.status_code == 401
        assert response.json()["detail"] == "invalid_credentials"


def test_me_requires_valid_token(client):
    token = sign_up(client)["access_token"]

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "aigerim@example.com"

    assert client.get("/auth/me").status_code == 401
    assert client.get("/auth/me", headers={"Authorization": "Bearer garbage"}).status_code == 401


def test_password_reset(client):
    sign_up(client)

    code = client.post("/auth/password/forgot", json={"email": EMAIL}).json()["dev_code"]
    reset = client.post("/auth/password/reset", json={"email": EMAIL, "code": code, "new_password": "newpass123"})

    assert reset.status_code == 200
    assert client.post("/auth/login", json={"email": EMAIL, "password": "newpass123"}).status_code == 200
    assert client.post("/auth/login", json={"email": EMAIL, "password": PASSWORD}).status_code == 401


def test_forgot_password_does_not_reveal_unknown_email(client):
    response = client.post("/auth/password/forgot", json={"email": "nobody@example.com"})

    assert response.status_code == 200
    assert response.json()["dev_code"] is None
