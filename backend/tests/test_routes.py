from app.verification import verify


def _sample(test_name, **overrides):
    data = {
        "species": f"Manuka Honey {test_name}",
        "origin_country": "New Zealand",
    }
    data.update(overrides)
    return data


def test_create_sample(client, test_name):
    resp = client.post("/samples/", json=_sample(test_name))
    assert resp.status_code == 201
    data = resp.json()
    assert test_name in data["species"]
    assert data["origin_country"] == "New Zealand"
    assert data["collected_at"] is None
    assert data["status"] == verify(data["id"])
    assert "id" in data
    assert "created_at" in data


def test_create_sample_with_collected_at(client, test_name):
    payload = _sample(
        test_name,
        species=f"Olive Oil {test_name}",
        origin_country="Italy",
        collected_at="2026-01-15T10:00:00",
    )
    resp = client.post("/samples/", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["collected_at"] is not None


def test_create_sample_missing_species(client):
    resp = client.post(
        "/samples/",
        json={"origin_country": "New Zealand"},
    )
    assert resp.status_code == 422


def test_create_sample_missing_origin_country(client):
    resp = client.post("/samples/", json={"species": "Honey"})
    assert resp.status_code == 422


def test_list_samples(client, test_name):
    client.post("/samples/", json=_sample(test_name))
    client.post(
        "/samples/",
        json=_sample(
            test_name,
            species=f"Olive Oil {test_name}",
            origin_country="Italy",
        ),
    )
    resp = client.get("/samples/")
    assert resp.status_code == 200
    data = resp.json()
    test_items = [s for s in data if test_name in s["species"]]
    assert len(test_items) == 2


def test_get_sample(client, test_name):
    create_resp = client.post("/samples/", json=_sample(test_name))
    sample_id = create_resp.json()["id"]
    resp = client.get(f"/samples/{sample_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == sample_id
    assert test_name in data["species"]
    assert data["status"] == verify(sample_id)


def test_get_sample_not_found(client):
    resp = client.get("/samples/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Sample not found"
