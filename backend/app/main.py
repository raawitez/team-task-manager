from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_db
from app.routers import users, projects, tasks
from app import crud
from sqlalchemy.orm import Session
from app import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Team Task Manager API",
    description="A full-stack task management system",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)

@app.get("/dashboard", response_model = schemas.DashboardStats, tags=["Dashboard"])
def get_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)

@app.get("/", tags=["Health"])
def root():
    return {"status": "Team Task Manager API is running"}

