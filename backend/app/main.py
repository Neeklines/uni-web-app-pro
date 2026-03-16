from fastapi import FastAPI
from app.database import Base, engine
from app.routers import health, auth

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(health.router)
app.include_router(auth.router)
