import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_root_redirect():
    response = client.get("/")
    assert response.status_code == 200 or response.status_code == 307
    # Should redirect to /static/index.html
    if response.status_code == 307:
        assert response.headers["location"].endswith("/static/index.html")

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert "Chess Club" in data
    assert "Programming Class" in data

def test_signup_and_unregister():
    activity = "Chess Club"
    email = "testuser@mergington.edu"
    # Signup
    response = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert response.status_code == 200 or response.status_code == 400
    if response.status_code == 200:
        assert f"Signed up {email} for {activity}" in response.json()["message"]
    # Duplicate signup should fail
    response = client.post(f"/activities/{activity}/signup", params={"email": email})
    assert response.status_code == 400
    # Unregister
    response = client.post(f"/activities/{activity}/unregister", params={"email": email})
    assert response.status_code == 200
    assert f"Unregistered {email} from {activity}" in response.json()["message"]
    # Unregister again should fail
    response = client.post(f"/activities/{activity}/unregister", params={"email": email})
    assert response.status_code == 404
