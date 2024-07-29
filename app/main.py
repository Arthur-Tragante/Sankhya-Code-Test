# app/tests/conftest.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.controllers.user_controller import router as user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router)

@app.get("/health", tags=["Health"])
def health_check():
    """Endpoint de verificação de saúde."""
    return {"status": "ok"}
