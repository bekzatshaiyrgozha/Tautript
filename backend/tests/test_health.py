from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok_and_version():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert response.json() == {"status": "ok", "version": "0.1.0"}


def test_openapi_docs_available():
    assert client.get("/docs").status_code == 200

    schema = client.get("/openapi.json").json()
    assert "/health" in schema["paths"]
    assert schema["info"]["version"] == "0.1.0"
