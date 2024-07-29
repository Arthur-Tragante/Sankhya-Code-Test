import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.database import get_db, Base, engine, SessionLocal
from app.models.user import Usuario
from app.core.security import get_password_hash

client = TestClient(app)

def override_get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="function")
def cleanup(db: Session):
    db.query(Usuario).delete()
    db.commit()

def test_create_access_token(cleanup, db: Session):
    user = Usuario(
        nome="arthur",
        email="arthur_access_token@example.com",
        senha_hashed=get_password_hash("arthurpassword"),
    )
    db.add(user)
    db.commit()
    response = client.post(
        "/token",
        data={"username": "arthur_access_token@example.com", "password": "arthurpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
