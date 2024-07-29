from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.user import Usuario
from app.core.security import get_current_user, get_password_hash, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database import get_db
from app.views.user_view import format_user, format_users
from pydantic import BaseModel
from typing import List, Optional
from datetime import timedelta

router = APIRouter()

class UserCreate(BaseModel):
    nome: str
    email: str
    senha: str

class UserRead(BaseModel):
    id: int
    nome: str
    email: str

@router.post("/usuarios/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.senha)
    db_user = Usuario(nome=user.nome, email=user.email, senha_hashed=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return format_user(db_user)

@router.get("/usuarios/", response_model=List[UserRead])
def read_users(skip: int = 0, limit: int = 10, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Usuario)
    if search:
        query = query.filter(or_(Usuario.nome.ilike(f"%{search}%"), Usuario.email.ilike(f"%{search}%")))
    users = query.offset(skip).limit(limit).all()
    return format_users(users)

@router.get("/usuarios/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return format_user(user)

@router.put("/usuarios/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    db_user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db_user.nome = user.nome
    db_user.email = user.email
    if user.senha:
        db_user.senha_hashed = get_password_hash(user.senha)
    db.commit()
    db.refresh(db_user)
    return format_user(db_user)

@router.delete("/usuarios/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    db_user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(db_user)
    db.commit()
    return {"detalhe": "Usuário removido"}

@router.post("/token", response_model=dict)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou Senha incorreto",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
