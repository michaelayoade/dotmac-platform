import app.main as main


def test_api_version_header_defaults_when_version_missing(client, monkeypatch):
    monkeypatch.delattr(main.settings, "VERSION", raising=False)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["X-API-Version"] == "0.1.0"


def test_api_version_header_uses_settings_version(client, monkeypatch):
    monkeypatch.setattr(main.settings, "VERSION", "2.4.1", raising=False)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["X-API-Version"] == "2.4.1"
