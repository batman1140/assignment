from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routes import groups, users

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Splitwise Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(groups.router, tags=["groups"])
app.include_router(users.router, tags=["users"])

@app.get("/")
def read_root():
    return {"message": "Splitwise Clone API"}