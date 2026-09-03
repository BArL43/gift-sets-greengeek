from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def setup_function():
    main.promo_usage_count = 0


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_promo_calculation():
    response = client.post(
        "/promo/validate",
        json={
            "promo_code": "HELLOGREEN",
            "items": [{"price": 1000, "quantity": 2}],
        },
    )
    assert response.status_code == 200
    assert response.json()["discount"] == 300
    assert response.json()["discounted_total"] == 1700


def test_rejects_invalid_quantity():
    response = client.post(
        "/promo/validate",
        json={
            "promo_code": "HELLOGREEN",
            "items": [{"price": 1000, "quantity": 0}],
        },
    )
    assert response.status_code == 422


def test_rejects_tampered_total(monkeypatch):
    async def fake_send(_message):
        raise AssertionError("Telegram must not be called for invalid totals")

    monkeypatch.setattr(main, "send_telegram_message", fake_send)
    response = client.post(
        "/orders/",
        json={
            "name": "Test",
            "phone": "1",
            "address": "A",
            "items": [{"title": "Set", "price": 1000, "quantity": 1}],
            "total_amount": 1000,
        },
    )
    assert response.status_code == 400


def test_order_uses_server_total_and_escapes_html(monkeypatch):
    sent = []

    async def fake_send(message):
        sent.append(message)

    monkeypatch.setattr(main, "send_telegram_message", fake_send)
    expected = 850 + main.DELIVERY_COST_RUB
    response = client.post(
        "/orders/",
        json={
            "name": "<b>Eve</b>",
            "phone": "1",
            "address": "A",
            "comments": "<script>x</script>",
            "items": [{"title": "<Gift>", "price": 1000, "quantity": 1}],
            "promo_code": "hellogreen",
            "total_amount": expected,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["total_amount"] == expected
    assert body["delivery_cost"] == main.DELIVERY_COST_RUB
    assert main.promo_usage_count == 1
    assert "&lt;b&gt;Eve&lt;/b&gt;" in sent[0]
    assert "&lt;Gift&gt;" in sent[0]
    assert "<script>" not in sent[0]
