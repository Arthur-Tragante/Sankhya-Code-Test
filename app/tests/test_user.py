import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import Usuario
from app.core.security import get_password_hash, create_access_token
from datetime import timedelta

@pytest.fixture(scope="function")
def cleanup(db: Session):
    db.query(Usuario).delete()
    db.commit()

def test_create_user(client: TestClient, cleanup):
    response = client.post(
        "/usuarios/",
        json={"nome": "test_create", "email": "test_create@example.com", "senha": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test_create@example.com"

def test_read_users(client: TestClient, db: Session, cleanup):
    user = Usuario(
        nome="test_read",
        email="test_read@example.com",
        senha_hashed=get_password_hash("testpassword"),
    )
    db.add(user)
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = client.get("/usuarios/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["email"] == "test_read@example.com"

def test_update_user(client: TestClient, db: Session, cleanup):
    user = Usuario(
        nome="test_update",
        email="test_update@example.com",
        senha_hashed=get_password_hash("testpassword"),
    )
    db.add(user)
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = client.put(
        f"/usuarios/{user.id}",
        headers=headers,
        json={"nome": "test_updated", "email": "test_update@example.com", "senha": "newpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nome"] == "test_updated"

def test_delete_user(client: TestClient, db: Session, cleanup):
    user = Usuario(
        nome="test_delete",
        email="test_delete@example.com",
        senha_hashed=get_password_hash("testpassword"),
    )
    db.add(user)
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    headers = {"Authorization": f"Bearer {access_token}"}
    
    response = client.delete(f"/usuarios/{user.id}", headers=headers)
    assert response.status_code == 200
    assert db.query(Usuario).filter(Usuario.id == user.id).first() is None
