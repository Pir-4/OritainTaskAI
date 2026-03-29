from app.verification import verify


def _sample(test_name, **overrides):
    data = {
        "product_name": f"Manuka Honey {test_name}",
        "claimed_origin": "New Zealand",
        "sample_data": {
            "isotope_ratio_o18": -2.85,
            "isotope_ratio_c13": -25.1,
            "trace_element_sr": 0.7091,
        },
    }
    data.update(overrides)
    return data


def test_create_sample(client, test_name):
    resp = client.post("/samples/", json=_sample(test_name))
    assert resp.status_code == 201
    data = resp.json()
    assert test_name in data["product_name"]
    assert data["claimed_origin"] == "New Zealand"
    assert data["sample_data"]["isotope_ratio_o18"] == -2.85
    assert data["sample_data"]["isotope_ratio_c13"] == -25.1
    assert data["sample_data"]["trace_element_sr"] == 0.7091
    assert data["status"] == verify(data["id"])
    assert "id" in data
    assert "created_at" in data


def test_create_sample_missing_product_name(client):
    resp = client.post(
        "/samples/",
        json={
            "claimed_origin": "New Zealand",
            "sample_data": {
                "isotope_ratio_o18": -2.85,
                "isotope_ratio_c13": -25.1,
                "trace_element_sr": 0.7091,
            },
        },
    )
    assert resp.status_code == 422


def test_create_sample_missing_claimed_origin(client):
    resp = client.post(
        "/samples/",
        json={
            "product_name": "Honey",
            "sample_data": {
                "isotope_ratio_o18": -2.85,
                "isotope_ratio_c13": -25.1,
                "trace_element_sr": 0.7091,
            },
        },
    )
    assert resp.status_code == 422


def test_create_sample_missing_sample_data(client):
    resp = client.post(
        "/samples/",
        json={"product_name": "Honey", "claimed_origin": "New Zealand"},
    )
    assert resp.status_code == 422


def test_list_samples(client, test_name):
    client.post("/samples/", json=_sample(test_name))
    client.post(
        "/samples/",
        json=_sample(
            test_name,
            product_name=f"Olive Oil {test_name}",
            claimed_origin="Italy",
        ),
    )
    resp = client.get("/samples/")
    assert resp.status_code == 200
    data = resp.json()
    test_items = [s for s in data if test_name in s["product_name"]]
    assert len(test_items) == 2


def test_get_sample(client, test_name):
    create_resp = client.post("/samples/", json=_sample(test_name))
    sample_id = create_resp.json()["id"]
    resp = client.get(f"/samples/{sample_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == sample_id
    assert test_name in data["product_name"]
    assert data["status"] == verify(sample_id)


def test_get_sample_not_found(client):
    resp = client.get("/samples/999999")
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Sample not found"
