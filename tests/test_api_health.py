import app.api.health as health_api


class _FakePool:
    def status(self) -> str:
        return "Pool size: 5  Connections in pool: 3 Current Overflow: -1 Current Checked out connections: 1"


class _FakeEngine:
    pool = _FakePool()


def test_db_pool_status_returns_pool_metrics(client, monkeypatch):
    monkeypatch.setattr(health_api, "_get_db_engine", lambda: _FakeEngine())

    response = client.get("/api/v1/health/db-pool")

    assert response.status_code == 200
    assert response.json() == {
        "pool_size": 5,
        "checked_in": 3,
        "checked_out": 1,
        "overflow": -1,
    }
