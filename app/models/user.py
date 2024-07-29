from sqlalchemy import Column, Integer, String, MetaData
from app.database import Base

metadata = MetaData()

class Usuario(Base):
    """Modelo de banco de dados para o usuário."""
    __tablename__ = "usuarios"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha_hashed = Column(String)
